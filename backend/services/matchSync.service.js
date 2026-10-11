/**
 * Match synchronization service.
 *
 * Upserts CricAPI "current matches" data into the Match collection using
 * providerId as the primary identity. It reuses the payload that the
 * existing cricket polling infrastructure already fetched, so it performs
 * no additional CricAPI calls.
 *
 * Rules enforced here:
 * - Provider state (matchStarted/matchEnded/status) is the primary source
 *   of truth for Match.status; date logic is only a defensive stale-data
 *   fallback.
 * - Teams are resolved by normalized name. Missing teams are logged and
 *   skipped — never auto-created with fabricated captain/coach data.
 * - Stale records (past matches still marked "live"/"upcoming") are
 *   demoted to "completed" so Home sections stop showing them incorrectly.
 */

import Match from "../models/match.model.js";
import Team from "../models/team.model.js";
import { getMatchState } from "./cricketPolling.service.js";

// Defensive stale-data fallbacks (never the primary status source).
// Test matches can run ~5 days, so the "live" grace window is generous.
const UPCOMING_STALE_MS = 48 * 60 * 60 * 1000; // upcoming +48h past start
const LIVE_STALE_MS = 7 * 24 * 60 * 60 * 1000; // live +7d past start

// CricAPI matchType → our Match.format enum
const FORMAT_MAP = {
    t20: "t20i",
    t20i: "t20i",
    odi: "odi",
    test: "test",
};

const VALID_STATUSES = new Set(["upcoming", "live", "completed"]);

/** Lowercase, trim, collapse whitespace and drop trivial punctuation. */
export function normalizeName(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/\./g, "")
        .replace(/\s+/g, " ");
}

/**
 * Resolve Match.status for a provider match.
 * Provider state wins; dates are only used as a defensive fallback for
 * frozen/stale provider records.
 */
export function resolveMatchStatus(providerMatch, matchDate, existingStatus) {
    // No usable provider signals at all → keep what we already have.
    const hasProviderSignal =
        providerMatch?.matchStarted !== undefined ||
        providerMatch?.matchEnded !== undefined ||
        (typeof providerMatch?.status === "string" && providerMatch.status.trim() !== "") ||
        (Array.isArray(providerMatch?.score) && providerMatch.score.length > 0);
    if (!hasProviderSignal) {
        return existingStatus || null;
    }

    let state = providerMatch?.matchState;
    if (!VALID_STATUSES.has(state)) {
        state = getMatchState(providerMatch);
    }
    if (!VALID_STATUSES.has(state)) {
        return existingStatus || null;
    }

    if (matchDate instanceof Date && !Number.isNaN(matchDate.getTime())) {
        const ageMs = Date.now() - matchDate.getTime();
        if (state === "upcoming" && ageMs > UPCOMING_STALE_MS) return "completed";
        if (state === "live" && ageMs > LIVE_STALE_MS) return "completed";
    }

    return state;
}

/** Parse the CricAPI date field ({ date } object or plain string). */
export function parseProviderDate(raw) {
    if (!raw) return null;
    const value = typeof raw === "object" ? raw.date : raw;
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Format a provider score entry ({ r, w }) as "120/3". */
function formatInningsScore(entry) {
    if (!entry || typeof entry.r !== "number" || typeof entry.w !== "number") return "";
    return `${entry.r}/${entry.w}`;
}

/**
 * Map the provider score array onto the existing Match.scorecard shape.
 * Returns null when there is nothing usable to write.
 */
export function buildScorecardSummary(score) {
    if (!Array.isArray(score) || score.length === 0) return null;
    const first = score[0] || null;
    const second = score[1] || null;
    const last = score[score.length - 1] || null;

    const summary = {};
    const teamAScore = formatInningsScore(first);
    const teamBScore = formatInningsScore(second);
    if (teamAScore) summary.teamAScore = teamAScore;
    if (teamBScore) summary.teamBScore = teamBScore;
    if (last && typeof last.o === "number") summary.overs = String(last.o);

    // Derived values — only when unambiguous, never fabricated.
    if (second && typeof second.r === "number" && typeof second.o === "number" && second.o > 0) {
        summary.currentRunRate = Math.round((second.r / second.o) * 100) / 100;
    }
    if (first && typeof first.r === "number" && second) {
        summary.target = first.r + 1;
    }

    return Object.keys(summary).length > 0 ? summary : null;
}

/**
 * Best-effort winner detection from provider status text
 * (e.g. "Australia won by 6 wickets"). Returns an ObjectId or null.
 */
export function resolveWinnerId(providerMatch, teamA, teamB, namesA, namesB) {
    const text = String(providerMatch?.status || "");
    const match = text.match(/^(.+?)\s+won by/i);
    if (!match) return null;

    const winnerKey = normalizeName(match[1]);
    if (!winnerKey) return null;

    const keysA = new Set([...namesA, teamA?.name].map(normalizeName).filter(Boolean));
    const keysB = new Set([...namesB, teamB?.name].map(normalizeName).filter(Boolean));

    if (keysA.has(winnerKey)) return teamA._id;
    if (keysB.has(winnerKey)) return teamB._id;
    return null;
}

async function loadTeamIndex() {
    const teams = await Team.find({})
        .select("name country format")
        .lean();

    const byName = new Map();
    const byCountry = new Map();
    const byId = new Map();

    for (const team of teams) {
        byId.set(String(team._id), team);
        const nameKey = normalizeName(team.name);
        if (nameKey && !byName.has(nameKey)) byName.set(nameKey, team);
        const countryKey = normalizeName(team.country);
        if (countryKey) {
            const list = byCountry.get(countryKey) || [];
            list.push(team);
            byCountry.set(countryKey, list);
        }
    }

    return { byName, byCountry, byId };
}

/**
 * Resolve a provider team name to an existing Team document.
 * Never creates teams; ambiguity is treated as unresolved.
 */
export function resolveTeamByName(teamIndex, rawName) {
    const key = normalizeName(rawName);
    if (!key) return null;

    const byName = teamIndex.byName.get(key);
    if (byName) return byName;

    const countryMatches = teamIndex.byCountry.get(key);
    if (countryMatches && countryMatches.length === 1) return countryMatches[0];

    return null;
}

function collectProviderTeamNames(providerMatch) {
    const infoNames = Array.isArray(providerMatch?.teamInfo)
        ? providerMatch.teamInfo.map((t) => t?.name).filter(Boolean)
        : [];
    const teamNames = Array.isArray(providerMatch?.teams)
        ? providerMatch.teams.filter(Boolean)
        : [];
    const names = infoNames.length >= 2 ? infoNames : teamNames;
    return [names[0] || null, names[1] || null];
}

async function findExistingByProviderId(providerId) {
    return Match.findOne({ providerId }).lean();
}

/**
 * Claim a legacy/admin match that represents the same fixture
 * (same teams + date window, no providerId yet) to avoid duplicates.
 */
async function findLegacyFixture(teamAId, teamBId, matchDate, format) {
    if (!matchDate) return null;
    const windowMs = 36 * 60 * 60 * 1000;
    return Match.findOne({
        $and: [
            { providerId: null },
            {
                $or: [
                    { teamA: teamAId, teamB: teamBId },
                    { teamA: teamBId, teamB: teamAId },
                ],
            },
            { matchDate: { $gte: new Date(matchDate.getTime() - windowMs), $lte: new Date(matchDate.getTime() + windowMs) } },
            ...(format ? [{ format }] : []),
        ],
    }).lean();
}

function hasChanges(existing, update) {
    return Object.entries(update).some(
        ([key, value]) => JSON.stringify(existing?.[key]) !== JSON.stringify(value)
    );
}

async function syncOneMatch(providerMatch, teamIndex, summary) {
    const providerId = providerMatch?.id !== undefined && providerMatch?.id !== null
        ? String(providerMatch.id)
        : null;

    if (!providerId) {
        summary.skipped++;
        summary.reasons.push("provider match without id");
        return;
    }

    const [rawNameA, rawNameB] = collectProviderTeamNames(providerMatch);
    if (!rawNameA || !rawNameB) {
        summary.skipped++;
        summary.reasons.push(`${providerId}: missing team names`);
        return;
    }

    const existing = await findExistingByProviderId(providerId);

    let teamA = existing ? teamIndex.byId.get(String(existing.teamA)) : null;
    let teamB = existing ? teamIndex.byId.get(String(existing.teamB)) : null;
    let namesA = [rawNameA];
    let namesB = [rawNameB];

    if (!teamA || !teamB) {
        teamA = teamA || resolveTeamByName(teamIndex, rawNameA);
        teamB = teamB || resolveTeamByName(teamIndex, rawNameB);
    }

    if (!teamA || !teamB) {
        const unresolved = [!teamA ? rawNameA : null, !teamB ? rawNameB : null].filter(Boolean);
        for (const name of unresolved) summary.unresolvedTeams.add(normalizeName(name));
        summary.skipped++;
        return;
    }

    if (existing) {
        namesA = [rawNameA, teamIndex.byId.get(String(existing.teamA))?.name].filter(Boolean);
        namesB = [rawNameB, teamIndex.byId.get(String(existing.teamB))?.name].filter(Boolean);
    }

    const matchDate = parseProviderDate(providerMatch.date) || existing?.matchDate || null;
    const status = resolveMatchStatus(providerMatch, matchDate, existing?.status);
    if (!status) {
        summary.skipped++;
        summary.reasons.push(`${providerId}: could not resolve status`);
        return;
    }

    const providerFormat = FORMAT_MAP[normalizeName(providerMatch.matchType)];
    const format = providerFormat || existing?.format || (teamA.format === teamB.format ? teamA.format : null);
    if (!format) {
        summary.skipped++;
        summary.reasons.push(`${providerId}: could not resolve format`);
        return;
    }

    const update = { providerId, status, format };
    if (matchDate) update.matchDate = matchDate;

    const venue = typeof providerMatch.venue === "string" ? providerMatch.venue.trim() : "";
    update.venue = venue || existing?.venue || "TBC";

    const scoreSummary = buildScorecardSummary(providerMatch.score);
    if (scoreSummary) {
        update.scorecard = { ...(existing?.scorecard || {}), ...scoreSummary };
    }

    if (status === "completed") {
        const statusText = typeof providerMatch.status === "string" ? providerMatch.status.trim() : "";
        if (statusText) update.result = statusText;
        const winnerId = resolveWinnerId(providerMatch, teamA, teamB, namesA, namesB);
        if (winnerId) update.winner = winnerId;
    } else if (existing?.status === "completed") {
        // Status regressed away from completed — clear completion-only fields.
        update.winner = null;
        update.manOfTheMatch = null;
        if (!update.result) update.result = "";
    }

    if (!existing) {
        const legacy = await findLegacyFixture(teamA._id, teamB._id, matchDate, format);
        if (legacy) {
            if (hasChanges(legacy, update)) {
                await Match.updateOne({ _id: legacy._id }, { $set: update });
                summary.updated++;
            } else {
                summary.synced++;
            }
            return;
        }

        try {
            await Match.create({
                ...update,
                teamA: teamA._id,
                teamB: teamB._id,
                matchDate: matchDate || new Date(),
                result: update.result || "",
            });
            summary.created++;
        } catch (error) {
            // Unique providerId index hit by a concurrent writer — fall back to update.
            if (error?.code === 11000) {
                await Match.updateOne({ providerId }, { $set: update });
                summary.updated++;
            } else {
                throw error;
            }
        }
        return;
    }

    if (hasChanges(existing, update)) {
        await Match.updateOne({ _id: existing._id }, { $set: update });
        summary.updated++;
    } else {
        summary.synced++;
    }
}

/**
 * Defensive sweep: demote records whose scheduled date is long past but
 * that are still marked live/upcoming (frozen admin/demo leftovers and
 * provider records that disappeared from the feed).
 */
async function sweepStaleMatches(summary) {
    const now = Date.now();
    const liveSweep = await Match.updateMany(
        { status: "live", matchDate: { $lt: new Date(now - LIVE_STALE_MS) } },
        { $set: { status: "completed" } }
    );
    const upcomingSweep = await Match.updateMany(
        { status: "upcoming", matchDate: { $lt: new Date(now - UPCOMING_STALE_MS) } },
        { $set: { status: "completed" } }
    );
    summary.staleDemoted = (liveSweep.modifiedCount || 0) + (upcomingSweep.modifiedCount || 0);
}

/**
 * Sync every provider match into the Match collection.
 *
 * @param {Array<Object>} providerMatches – already-fetched CricAPI matches
 *   (ideally the normalized objects from cricketPolling's extractRelevantMatches)
 * @returns {Promise<Object>} sync summary
 */
export async function syncMatchesFromProvider(providerMatches) {
    const summary = {
        total: Array.isArray(providerMatches) ? providerMatches.length : 0,
        created: 0,
        updated: 0,
        synced: 0,
        skipped: 0,
        staleDemoted: 0,
        unresolvedTeams: new Set(),
        reasons: [],
    };

    if (!Array.isArray(providerMatches) || providerMatches.length === 0) {
        await sweepStaleMatches(summary);
        return finalizeSummary(summary);
    }

    const teamIndex = await loadTeamIndex();

    for (const providerMatch of providerMatches) {
        try {
            await syncOneMatch(providerMatch, teamIndex, summary);
        } catch (error) {
            summary.skipped++;
            summary.reasons.push(`${providerMatch?.id ?? "unknown"}: ${error.message}`);
        }
    }

    await sweepStaleMatches(summary);
    return finalizeSummary(summary);
}

function finalizeSummary(summary) {
    return {
        ...summary,
        unresolvedTeams: [...summary.unresolvedTeams],
    };
}

export { LIVE_STALE_MS, UPCOMING_STALE_MS, FORMAT_MAP };
