/**
 * Match & player synchronization tests.
 *
 * Covers the pure mapping logic (status resolution with defensive
 * date fallbacks, scorecard summary, winner parsing, role mapping),
 * the providerId unique-index definitions, and model preservation
 * guarantees (existing fields are not part of the sync write set).
 *
 * Run: node --test backend/tests/matchPlayerSync.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import Match from "../models/match.model.js";
import Player from "../models/player.model.js";
import {
  normalizeName,
  parseProviderDate,
  resolveMatchStatus,
  resolveWinnerId,
  buildScorecardSummary,
  LIVE_STALE_MS,
  UPCOMING_STALE_MS,
} from "../services/matchSync.service.js";
import {
  normalizeRole,
  inferRoleFromScorecard,
} from "../services/playerSync.service.js";

// ─── Schema index tests ──────────────────────────────────────────────────────

describe("providerId schema indexes", () => {
  it("Match schema defines a partial unique index on providerId", () => {
    const index = Match.schema.indexes().find(([keys]) => keys.providerId === 1);
    assert.ok(index, "providerId index missing on Match");
    assert.equal(index[1].unique, true);
    assert.ok(index[1].partialFilterExpression, "partialFilterExpression required");
    assert.deepEqual(index[1].partialFilterExpression.providerId, {
      $type: "string",
      $gt: "",
    });
  });

  it("Player schema defines a partial unique index on providerId", () => {
    const index = Player.schema.indexes().find(([keys]) => keys.providerId === 1);
    assert.ok(index, "providerId index missing on Player");
    assert.equal(index[1].unique, true);
    assert.ok(index[1].partialFilterExpression, "partialFilterExpression required");
    assert.deepEqual(index[1].partialFilterExpression.providerId, {
      $type: "string",
      $gt: "",
    });
  });

  it("legacy documents without providerId are exempt from the unique index", () => {
    // The partial filter only includes docs where providerId is a non-empty
    // string, so null/missing providerId (admin/manual records) never collide.
    const filter = Match.schema
      .indexes()
      .find(([keys]) => keys.providerId === 1)[1].partialFilterExpression.providerId;
    assert.notEqual(filter.$type, undefined);
    assert.ok(filter.$gt !== undefined && filter.$gt === "");
  });

  it("providerId is optional on both schemas", () => {
    assert.ok(!Match.schema.path("providerId").isRequired);
    assert.ok(!Player.schema.path("providerId").isRequired);
  });
});

// ─── Status resolution (provider-first, date as fallback only) ───────────────

describe("resolveMatchStatus", () => {
  const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentDate = new Date(Date.now() - 60 * 60 * 1000);
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  it("uses provider live state even when the date is in the past", () => {
    const status = resolveMatchStatus(
      { matchStarted: true, matchEnded: false, matchState: "live", status: "Live" },
      recentDate,
      "upcoming"
    );
    assert.equal(status, "live");
  });

  it("keeps provider completed state", () => {
    const status = resolveMatchStatus(
      { matchStarted: true, matchEnded: true, matchState: "completed", status: "Australia won by 5 runs" },
      pastDate,
      "live"
    );
    assert.equal(status, "completed");
  });

  it("keeps provider upcoming state for future fixtures", () => {
    const status = resolveMatchStatus(
      { matchStarted: false, matchEnded: false, matchState: "upcoming", status: "Match starts soon" },
      futureDate,
      "completed"
    );
    assert.equal(status, "upcoming");
  });

  it("defensively demotes stale 'upcoming' records far past their date", () => {
    const staleDate = new Date(Date.now() - UPCOMING_STALE_MS - 60 * 60 * 1000);
    const status = resolveMatchStatus(
      { matchStarted: false, matchEnded: false, matchState: "upcoming", status: "Match starts soon" },
      staleDate,
      "upcoming"
    );
    assert.equal(status, "completed");
  });

  it("defensively demotes frozen 'live' records far past their date", () => {
    const staleDate = new Date(Date.now() - LIVE_STALE_MS - 60 * 60 * 1000);
    const status = resolveMatchStatus(
      { matchStarted: true, matchEnded: false, matchState: "live", status: "Live" },
      staleDate,
      "live"
    );
    assert.equal(status, "completed");
  });

  it("derives state from provider booleans when matchState is absent", () => {
    const status = resolveMatchStatus(
      { matchStarted: true, matchEnded: false },
      recentDate,
      null
    );
    assert.equal(status, "live");
  });

  it("falls back to the existing status when nothing is resolvable", () => {
    const status = resolveMatchStatus({}, null, "completed");
    assert.equal(status, "completed");
  });
});

// ─── Date parsing ────────────────────────────────────────────────────────────

describe("parseProviderDate", () => {
  it("parses CricAPI { date } objects", () => {
    const parsed = parseProviderDate({ date: "2026-10-05" });
    assert.ok(parsed instanceof Date);
    assert.equal(parsed.getFullYear(), 2026);
  });

  it("parses plain string dates", () => {
    const parsed = parseProviderDate("2026-10-05");
    assert.ok(parsed instanceof Date);
  });

  it("returns null for missing or invalid dates", () => {
    assert.equal(parseProviderDate(null), null);
    assert.equal(parseProviderDate(undefined), null);
    assert.equal(parseProviderDate("not-a-date"), null);
  });
});

// ─── Scorecard mapping ───────────────────────────────────────────────────────

describe("buildScorecardSummary", () => {
  it("maps provider score entries to the Match.scorecard shape", () => {
    const summary = buildScorecardSummary([
      { inning: "India Inning 1", r: 180, w: 4, o: 20 },
      { inning: "Australia Inning 1", r: 120, w: 6, o: 15.2 },
    ]);
    assert.equal(summary.teamAScore, "180/4");
    assert.equal(summary.teamBScore, "120/6");
    assert.equal(summary.overs, "15.2");
    assert.equal(summary.target, 181);
    assert.ok(summary.currentRunRate > 0);
  });

  it("returns null when there is no score data", () => {
    assert.equal(buildScorecardSummary([]), null);
    assert.equal(buildScorecardSummary(undefined), null);
    assert.equal(buildScorecardSummary(null), null);
  });

  it("does not fabricate a target for a single innings", () => {
    const summary = buildScorecardSummary([{ r: 150, w: 7, o: 20 }]);
    assert.equal(summary.teamAScore, "150/7");
    assert.equal(summary.target, undefined);
  });
});

// ─── Winner parsing ──────────────────────────────────────────────────────────

describe("resolveWinnerId", () => {
  const teamA = { _id: "a1", name: "india" };
  const teamB = { _id: "b1", name: "australia" };

  it("resolves the winner from provider status text", () => {
    const winner = resolveWinnerId(
      { status: "Australia won by 6 wickets" },
      teamA,
      teamB,
      ["India"],
      ["Australia"]
    );
    assert.equal(winner, "b1");
  });

  it("returns null for ties, draws and unparseable statuses", () => {
    assert.equal(
      resolveWinnerId({ status: "Match tied" }, teamA, teamB, ["India"], ["Australia"]),
      null
    );
    assert.equal(
      resolveWinnerId({ status: "Match drawn" }, teamA, teamB, ["India"], ["Australia"]),
      null
    );
    assert.equal(
      resolveWinnerId({ status: "" }, teamA, teamB, ["India"], ["Australia"]),
      null
    );
  });
});

// ─── Name normalization ──────────────────────────────────────────────────────

describe("normalizeName", () => {
  it("lowercases, trims and collapses whitespace", () => {
    assert.equal(normalizeName("  New   Zealand "), "new zealand");
    assert.equal(normalizeName("St. Lucia"), "st lucia");
    assert.equal(normalizeName(null), "");
  });
});

// ─── Player role mapping ─────────────────────────────────────────────────────

describe("player role mapping", () => {
  it("maps provider roles onto the existing role enum", () => {
    assert.equal(normalizeRole("Batsman"), "Batsman");
    assert.equal(normalizeRole("BAT"), "Batsman");
    assert.equal(normalizeRole("bowler"), "Bowler");
    assert.equal(normalizeRole("All-Rounder"), "All-Rounder");
    assert.equal(normalizeRole("WK"), "Wicket-Keeper");
    assert.equal(normalizeRole("Wicket-Keeper"), "Wicket-Keeper");
  });

  it("returns null for unknown roles", () => {
    assert.equal(normalizeRole("Captain"), null);
    assert.equal(normalizeRole(""), null);
    assert.equal(normalizeRole(undefined), null);
  });

  it("infers role from scorecard participation when no role is provided", () => {
    assert.equal(inferRoleFromScorecard(true, true, null), "All-Rounder");
    assert.equal(inferRoleFromScorecard(false, true, null), "Bowler");
    assert.equal(inferRoleFromScorecard(true, false, null), "Batsman");
    assert.equal(inferRoleFromScorecard(false, false, null), "Batsman");
  });

  it("prefers an explicit provider role over inference", () => {
    assert.equal(inferRoleFromScorecard(true, false, "Wicket-Keeper"), "Wicket-Keeper");
    assert.equal(inferRoleFromScorecard(true, false, "nonsense"), "Batsman");
  });
});
