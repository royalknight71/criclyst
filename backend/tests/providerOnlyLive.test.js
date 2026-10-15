/**
 * Regression tests: provider-confirmed LIVE matches whose teams are
 * missing from MongoDB must not be silently hidden.
 *
 * Scenario from production: /api/live-cricket/live returned 1 live match
 * while /api/matches?status=live returned 0 because Match.teamA/teamB are
 * required refs and the team records did not exist (sync skips them —
 * teams are never auto-created).
 *
 * All data here is mocked provider output — no real CricAPI calls, no
 * database writes.
 *
 * Run: node --test backend/tests/providerOnlyLive.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildProviderStateMap } from "../utils/matchStatus.js";
import {
    buildStatusFilter,
    buildProviderOnlyLiveDocs,
    getIdsWithState,
} from "../services/matchQuery.service.js";

/** Normalized provider match (as cricketPolling's extractRelevantMatches builds). */
function providerLiveMatch(overrides = {}) {
    return {
        id: "unresolved-live-1",
        name: "1st T20I, Example Women vs Missingland",
        status: "In Progress",
        matchType: "t20i",
        score: [{ r: 45, w: 2, o: 6.3 }],
        teams: ["Example Women", "Missingland"],
        teamInfo: [
            { name: "Example Women", img: null },
            { name: "Missingland", img: null },
        ],
        venue: "Example Oval",
        date: "15 Oct 2026",
        dateTimeGMT: "2026-10-15T10:00:00.000Z",
        matchStarted: true,
        matchEnded: false,
        matchState: "live",
        ...overrides,
    };
}

describe("buildStatusFilter includes unresolved provider ids in the live filter", () => {
    it("the confirmed-live id is part of $in even with no stored document", () => {
        const stateMap = buildProviderStateMap([providerLiveMatch()]);
        const filter = buildStatusFilter("live", stateMap, true);
        assert.deepEqual(filter, { providerId: { $in: ["unresolved-live-1"] } });
    });

    it("getIdsWithState reports the confirmed live ids", () => {
        const stateMap = buildProviderStateMap([
            providerLiveMatch(),
            providerLiveMatch({
                id: "upcoming-1",
                matchStarted: false,
                matchState: "upcoming",
                matchEnded: false,
            }),
        ]);
        assert.deepEqual(getIdsWithState(stateMap, "live"), ["unresolved-live-1"]);
    });
});

describe("buildProviderOnlyLiveDocs — provider-confirmed live with unresolved teams (regression)", () => {
    const stateMap = buildProviderStateMap([providerLiveMatch()]);

    it("emits a display-only doc when no stored document exists", () => {
        const docs = buildProviderOnlyLiveDocs({
            stateMap,
            relevant: [providerLiveMatch()],
            existingDocs: [],
            snapshotAvailable: true,
        });
        assert.equal(docs.length, 1);
        const doc = docs[0];
        // Never a real Mongo id; flagged so UI never links to it.
        assert.equal(doc._id, null);
        assert.equal(doc.providerOnly, true);
        assert.equal(doc.providerId, "unresolved-live-1");
        // Status comes straight from the provider snapshot — nothing inferred.
        assert.equal(doc.status, "live");
        assert.equal(doc.matchState, "live");
        // Team names come from the provider payload only; no country/format
        // values are invented for them.
        assert.deepEqual(doc.teamA, {
            _id: null,
            name: "Example Women",
            country: null,
        });
        assert.deepEqual(doc.teamB, {
            _id: null,
            name: "Missingland",
            country: null,
        });
        // Provider-sourced fields, no fabrication.
        assert.equal(doc.venue, "Example Oval");
        assert.equal(doc.format, "t20i");
        assert.equal(doc.matchDate?.toISOString?.(), "2026-10-15T10:00:00.000Z");
        assert.equal(doc.result, "");
        assert.equal(doc.winner, null);
        assert.equal(doc.tossWinner, null);
    });

    it("does not duplicate matches that already have a stored document", () => {
        const docs = buildProviderOnlyLiveDocs({
            stateMap,
            relevant: [providerLiveMatch()],
            existingDocs: [{ providerId: "unresolved-live-1" }],
            snapshotAvailable: true,
        });
        assert.deepEqual(docs, []);
    });

    it("returns nothing without an authoritative snapshot", () => {
        assert.deepEqual(
            buildProviderOnlyLiveDocs({
                stateMap,
                relevant: [providerLiveMatch()],
                existingDocs: [],
                snapshotAvailable: false,
            }),
            []
        );
        assert.deepEqual(
            buildProviderOnlyLiveDocs({
                stateMap: null,
                relevant: [providerLiveMatch()],
                existingDocs: [],
                snapshotAvailable: true,
            }),
            []
        );
    });

    it("never emits provider matches that are not live", () => {
        const completed = providerLiveMatch({
            id: "done-1",
            matchStarted: true,
            matchEnded: true,
            matchState: "completed",
            status: "Example won by 5 runs",
        });
        const upcoming = providerLiveMatch({
            id: "next-1",
            matchStarted: false,
            matchEnded: false,
            matchState: "upcoming",
        });
        const snapshot = [completed, upcoming];
        const docs = buildProviderOnlyLiveDocs({
            stateMap: buildProviderStateMap(snapshot),
            relevant: snapshot,
            existingDocs: [],
            snapshotAvailable: true,
        });
        assert.deepEqual(docs, []);
    });

    it("collapses duplicate provider records into one doc", () => {
        const docs = buildProviderOnlyLiveDocs({
            stateMap,
            relevant: [providerLiveMatch(), providerLiveMatch()],
            existingDocs: [],
            snapshotAvailable: true,
        });
        assert.equal(docs.length, 1);
    });

    it("never invents team names when the provider payload lacks them", () => {
        const noTeams = providerLiveMatch({ teams: [], teamInfo: [], id: "bare-1" });
        const docs = buildProviderOnlyLiveDocs({
            stateMap: buildProviderStateMap([noTeams]),
            relevant: [noTeams],
            existingDocs: [],
            snapshotAvailable: true,
        });
        assert.deepEqual(docs, []);
    });

    it("keeps provider scores when present (no score fabrication)", () => {
        const docs = buildProviderOnlyLiveDocs({
            stateMap,
            relevant: [providerLiveMatch()],
            existingDocs: [],
            snapshotAvailable: true,
        });
        assert.equal(docs[0].scorecard?.teamAScore, "45/2");
        assert.equal(docs[0].scorecard?.overs, "6.3");
    });
});
