/**
 * Authoritative match-status tests.
 *
 * Covers the scenarios required for the live-match accuracy fix:
 *  1. Active provider match → classified live (shown on every live surface)
 *  2. Zero live matches from the provider → live filter matches nothing
 *  3. Stale Mongo "live" record + provider without live → not displayed live
 *  4. matchStarted=true + matchEnded=true → completed, never live
 *  5. Newer completed match sorts before older ones (completedAt)
 *  6. Recent matches sorted newest first via RECENT_MATCHES_SORT
 *  7. Upcoming fixtures are not mixed into completed (and vice versa)
 *  8. Provider failure → "unavailable"/"stale" meta, not a fake zero
 *  9. Duplicate provider records collapse into one entry
 * 10. Missing optional fields never crash the classifier/reconciler
 *
 * All tests use mocked provider responses — no real CricAPI quota used.
 *
 * Run: node --test backend/tests/matchStatus.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  getMatchState,
  normalizeStatus,
  buildProviderStateMap,
  effectiveMatchStatus,
  applyReconciledStatuses,
  buildMatchListMeta,
  dedupeByProviderId,
} from "../utils/matchStatus.js";
import {
  buildStatusFilter,
  getStatusSnapshot,
  RECENT_MATCHES_SORT,
} from "../services/matchQuery.service.js";
import {
  resolveCompletedAt,
  parseProviderMatchDate,
} from "../services/matchSync.service.js";

// ─── 1. Active match is live ─────────────────────────────────────────────────

describe("active provider match", () => {
  it("classifies an in-progress match as live", () => {
    const state = getMatchState({
      id: "match-live-1",
      matchStarted: true,
      matchEnded: false,
      status: "Live",
    });
    assert.equal(state, "live");
  });

  it("puts a confirmed live match in the live filter", () => {
    const stateMap = buildProviderStateMap([
      { id: "match-live-1", matchStarted: true, matchEnded: false },
    ]);
    const filter = buildStatusFilter("live", stateMap, true);
    assert.deepEqual(filter.providerId.$in, ["match-live-1"]);
  });
});

// ─── 2. Zero live matches ────────────────────────────────────────────────────

describe("provider returns zero live matches", () => {
  it("builds an empty live filter ($in [])", () => {
    const stateMap = buildProviderStateMap([
      { id: "c1", matchStarted: true, matchEnded: true, status: "A won by 4 runs" },
      { id: "u1", matchStarted: false, status: "Starts soon" },
    ]);
    assert.equal(stateMap.get("c1"), "completed");
    assert.equal(stateMap.get("u1"), "upcoming");
    const filter = buildStatusFilter("live", stateMap, true);
    assert.deepEqual(filter.providerId.$in, []);
  });

  it("treats stored live matches without provider confirmation as completed", () => {
    const stateMap = buildProviderStateMap([
      { id: "c1", matchStarted: true, matchEnded: true },
    ]);
    assert.equal(
      effectiveMatchStatus(
        { providerId: "stale-live", status: "live" },
        stateMap,
        true
      ),
      "completed"
    );
  });
});

// ─── 3. Stale Mongo LIVE record is not displayed live ────────────────────────

describe("stale MongoDB live record", () => {
  it("is demoted when the provider no longer confirms it", () => {
    // Latest successful provider response has zero live matches.
    const stateMap = buildProviderStateMap([]);
    const doc = { providerId: "0cb2b44c-69b3", status: "live", matchDate: new Date("2026-10-11") };
    assert.equal(effectiveMatchStatus(doc, stateMap, true), "completed");
  });

  it("is excluded from the live tab filter", () => {
    const stateMap = buildProviderStateMap([]);
    const filter = buildStatusFilter("live", stateMap, true);
    assert.deepEqual(filter.providerId.$in, []);
    assert.ok(!JSON.stringify(filter).includes("0cb2b44c"));
  });

  it("still appears under completed once demoted", () => {
    const stateMap = buildProviderStateMap([]);
    const filter = buildStatusFilter("completed", stateMap, true);
    // Stored live + absent from the feed counts as completed.
    assert.deepEqual(filter.$or[1].$and[1].status.$in, ["completed", "live"]);
    assert.deepEqual(filter.$or[1].$and[0].providerId.$nin, []);
  });
});

// ─── 4. matchStarted + matchEnded → completed ────────────────────────────────

describe("completed match with both flags set", () => {
  it("is classified completed, not live", () => {
    const state = getMatchState({
      id: "done",
      matchStarted: true,
      matchEnded: true,
      status: "England won by 8 wkts",
    });
    assert.equal(state, "completed");
    assert.notEqual(state, "live");
  });

  it("result text alone (without booleans) classifies as completed", () => {
    assert.equal(
      getMatchState({ status: "Australia won by 5 runs" }),
      "completed"
    );
    assert.equal(getMatchState({ status: "Match tied" }), "completed");
    assert.equal(getMatchState({ status: "Match abandoned" }), "completed");
  });

  it("scores alone never imply a live match", () => {
    assert.equal(
      getMatchState({ score: [{ inning: "A", r: 120, w: 3, o: 14 }] }),
      "unknown"
    );
  });
});

// ─── 5 & 6. Recent matches: completion time, newest first ────────────────────

describe("recent matches ordering", () => {
  it("sorts by completedAt descending with matchDate tiebreak", () => {
    assert.deepEqual(RECENT_MATCHES_SORT, { completedAt: -1, matchDate: -1 });
  });

  it("records observation time when a watched live match completes", () => {
    const before = Date.now();
    const completedAt = resolveCompletedAt(
      { status: "live", completedAt: null },
      "completed",
      new Date("2026-10-01")
    );
    assert.ok(completedAt instanceof Date);
    assert.ok(completedAt.getTime() >= before);
  });

  it("uses the provider match date when first seen already completed", () => {
    const matchDate = new Date("2026-10-09T00:00:00.000Z");
    const completedAt = resolveCompletedAt(null, "completed", matchDate);
    assert.equal(completedAt.getTime(), matchDate.getTime());
  });

  it("never overwrites an existing completedAt", () => {
    const existing = new Date("2026-10-14T10:00:00.000Z");
    const result = resolveCompletedAt(
      { status: "completed", completedAt: existing },
      "completed",
      new Date("2026-10-01")
    );
    assert.equal(result, undefined);
  });

  it("places a newer completed match before an older one", () => {
    // Simulates the Mongo sort: completedAt desc, matchDate desc.
    const docs = [
      { _id: "old", completedAt: new Date("2026-10-09T00:00:00Z"), matchDate: new Date("2026-10-09T00:00:00Z") },
      { _id: "new", completedAt: new Date("2026-10-14T12:00:00Z"), matchDate: new Date("2026-10-13T00:00:00Z") },
    ];
    docs.sort((a, b) => {
      const d = b.completedAt - a.completedAt;
      return d !== 0 ? d : b.matchDate - a.matchDate;
    });
    assert.equal(docs[0]._id, "new");
  });
});

// ─── 7. Upcoming is not mixed with completed ─────────────────────────────────

describe("upcoming / completed separation", () => {
  it("upcoming filter only includes provider-confirmed or stored upcoming", () => {
    const stateMap = buildProviderStateMap([
      { id: "live1", matchStarted: true, matchEnded: false },
      { id: "done1", matchStarted: true, matchEnded: true },
      { id: "next1", matchStarted: false },
    ]);
    const filter = buildStatusFilter("upcoming", stateMap, true);
    assert.deepEqual(filter.$or[0].providerId.$in, ["next1"]);
    // Absent records keep their stored upcoming status only.
    assert.equal(filter.$or[1].$and[1].status, "upcoming");
  });

  it("a completed match confirmed by the provider never appears as upcoming", () => {
    const stateMap = buildProviderStateMap([
      { id: "done1", matchStarted: true, matchEnded: true, status: "won by 4 runs" },
    ]);
    // Stored as upcoming but provider says completed.
    assert.equal(
      effectiveMatchStatus({ providerId: "done1", status: "upcoming" }, stateMap, true),
      "completed"
    );
  });

  it("upcoming fixtures are not in the completed filter", () => {
    const stateMap = buildProviderStateMap([
      { id: "next1", matchStarted: false },
    ]);
    const filter = buildStatusFilter("completed", stateMap, true);
    // No branch can match next1: the $in list is empty and the absent-feed
    // branch explicitly excludes feed ids via $nin.
    assert.deepEqual(filter.$or[0].providerId.$in, []);
    assert.ok(filter.$or[1].$and[0].providerId.$nin.includes("next1"));
  });
});

// ─── 8. Provider failure ≠ successful empty response ────────────────────────

describe("provider failure handling", () => {
  it("reports unavailable (not zero-live) when no snapshot exists", () => {
    const meta = buildMatchListMeta(null);
    assert.equal(meta.providerStatus, "unavailable");
    assert.equal(meta.stale, true);
    assert.equal(meta.lastSyncAt, null);
    assert.equal(meta.liveCount, 0);
  });

  it("marks cached data stale when the latest poll failed", () => {
    const meta = buildMatchListMeta({
      lastError: "CricAPI error: Blocked for 15 minutes",
      stale: false,
      fetchedAt: "2026-10-15T10:00:00.000Z",
      liveCount: 2,
    });
    assert.equal(meta.providerStatus, "stale");
    assert.equal(meta.stale, true);
    assert.equal(meta.lastSyncAt, "2026-10-15T10:00:00.000Z");
  });

  it("reports ok only for a fresh successful snapshot", () => {
    const meta = buildMatchListMeta({
      lastError: null,
      stale: false,
      fetchedAt: "2026-10-15T10:00:00.000Z",
      liveCount: 0,
    });
    assert.equal(meta.providerStatus, "ok");
    assert.equal(meta.stale, false);
    assert.equal(meta.liveCount, 0);
  });

  it("live endpoints without any poll report unavailable meta", () => {
    // In the test process no poll has run, so the authoritative state
    // must be reported as unavailable — never as confirmed zero live.
    const snapshot = getStatusSnapshot();
    assert.equal(snapshot.snapshotAvailable, false);
    assert.equal(snapshot.meta.providerStatus, "unavailable");
    assert.equal(snapshot.meta.stale, true);
  });
});

// ─── 9. Duplicate provider records ──────────────────────────────────────────

describe("duplicate provider records", () => {
  it("collapses duplicates in the state map", () => {
    const stateMap = buildProviderStateMap([
      { id: "dup", matchStarted: true, matchEnded: false },
      { id: "dup", matchStarted: true, matchEnded: true, status: "won by 1 run" },
    ]);
    assert.equal(stateMap.size, 1);
  });

  it("dedupeByProviderId keeps the first occurrence", () => {
    const out = dedupeByProviderId([
      { id: "a", status: "first" },
      { id: "a", status: "second" },
      { id: "b", status: "other" },
    ]);
    assert.equal(out.length, 2);
    assert.equal(out[0].status, "first");
  });
});

// ─── 10. Missing optional fields ─────────────────────────────────────────────

describe("missing optional fields", () => {
  it("classifier never throws on sparse input", () => {
    assert.equal(getMatchState(null), "unknown");
    assert.equal(getMatchState(undefined), "unknown");
    assert.equal(getMatchState({}), "unknown");
    assert.equal(getMatchState({ status: null }), "unknown");
    assert.equal(getMatchState({ matchStarted: "yes" }), "unknown");
  });

  it("state map and reconciler survive sparse arrays", () => {
    // Unresolvable matches must not pollute the state map with "unknown".
    assert.equal(buildProviderStateMap([{ id: "y" }]).size, 0);

    const stateMap = buildProviderStateMap([
      null,
      undefined,
      {},
      { id: "x", matchStarted: false },
    ]);
    assert.equal(stateMap.size, 1);
    const docs = applyReconciledStatuses(
      [null, { providerId: "x", status: "upcoming" }],
      stateMap,
      true
    );
    assert.equal(docs[1].status, "upcoming");
  });

  it("normalizeStatus handles non-strings safely", () => {
    assert.equal(normalizeStatus(undefined), null);
    assert.equal(normalizeStatus(42), null);
    assert.equal(normalizeStatus(" LIVE "), "live");
  });

  it("provider date parsing tolerates missing fields", () => {
    assert.equal(parseProviderMatchDate({}, new Date("2026-10-01")) instanceof Date, true);
    assert.equal(parseProviderMatchDate(null, null), null);
    assert.equal(
      parseProviderMatchDate({ dateTimeGMT: "2026-10-05T13:30:00" }, null) instanceof Date,
      true
    );
  });
});
