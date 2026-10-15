/**
 * Match query service — shared read-path logic so every API consumer
 * (Home sections, Matches page, dashboard endpoints) applies the same
 * authoritative status rules.
 *
 * The latest successful CricAPI snapshot (held by cricketPolling) is the
 * source of truth for LIVE. MongoDB status is reconciled against it:
 *
 *   live      → provider-confirmed in-progress only
 *   upcoming  → stored upcoming, unless the provider confirms otherwise
 *   completed → stored completed, plus matches the provider has finished
 *               (or that vanished from the feed while marked live)
 *
 * When no successful provider snapshot exists the stored statuses are
 * served as-is, but responses carry meta.providerStatus="unavailable"
 * (or "stale") so the UI never presents them as confirmed real-time data.
 */
import {
    buildProviderStateMap,
    applyReconciledStatuses,
    buildMatchListMeta,
} from "../utils/matchStatus.js";
import { getAuthoritativeState } from "./cricketPolling.service.js";
import {
    buildScorecardSummary,
    parseProviderMatchDate,
    normalizeName,
    FORMAT_MAP,
    collectProviderTeamNames,
} from "./matchSync.service.js";

/** Recent-matches sort spec: completion time first, match date fallback. */
export const RECENT_MATCHES_SORT = Object.freeze({
    completedAt: -1,
    matchDate: -1,
});

/**
 * Snapshot + derived state map + freshness metadata for one request.
 */
export function getStatusSnapshot() {
    const state = getAuthoritativeState();
    return {
        snapshotAvailable: state.available,
        stateMap: buildProviderStateMap(state.relevant),
        relevant: state.relevant,
        meta: buildMatchListMeta(
            state.available
                ? {
                      lastError: state.lastError,
                      stale: state.stale,
                      fetchedAt: state.fetchedAt,
                      liveCount: state.liveMatches.length,
                  }
                : null
        ),
    };
}

/** Provider match ids confirmed in the given state (e.g. ["live"]). */
export function getIdsWithState(stateMap, state) {
    const out = [];
    if (!stateMap) return out;
    for (const [id, s] of stateMap) {
        if (s === state) out.push(id);
    }
    return out;
}

function idsWithStates(stateMap, states) {
    const out = [];
    for (const [id, state] of stateMap) {
        if (states.includes(state)) out.push(id);
    }
    return out;
}

/**
 * Mongo filter fragment implementing the reconciled status rules.
 *
 * @param {string} status - "", "live", "upcoming" or "completed"
 * @param {Map<string,string>} stateMap - provider id → confirmed state
 * @param {boolean} snapshotAvailable - whether a successful poll exists
 * @returns {Object} Mongo filter fragment ({} when status is empty)
 */
export function buildStatusFilter(status, stateMap, snapshotAvailable) {
    if (!status) return {};

    // No authoritative snapshot → fall back to the stored status and let
    // the response meta mark the data as unavailable/stale.
    if (!snapshotAvailable || !stateMap) {
        return { status };
    }

    if (status === "live") {
        // LIVE requires current provider confirmation. An empty $in list
        // correctly matches nothing when the provider reports zero live.
        return { providerId: { $in: idsWithStates(stateMap, ["live"]) } };
    }

    if (status === "completed") {
        const completedIds = idsWithStates(stateMap, ["completed"]);
        const allFeedIds = idsWithStates(stateMap, ["live", "upcoming", "completed"]);
        return {
            $or: [
                // Provider-confirmed completed (regardless of stored status).
                { providerId: { $in: completedIds } },
                // Not in the current feed: stored completed, or stored live
                // that the provider never confirmed / dropped → completed.
                {
                    $and: [
                        { providerId: { $nin: allFeedIds } },
                        { status: { $in: ["completed", "live"] } },
                    ],
                },
            ],
        };
    }

    if (status === "upcoming") {
        const upcomingIds = idsWithStates(stateMap, ["upcoming"]);
        const allFeedIds = idsWithStates(stateMap, ["live", "upcoming", "completed"]);
        return {
            $or: [
                { providerId: { $in: upcomingIds } },
                {
                    $and: [
                        { providerId: { $nin: allFeedIds } },
                        { status: "upcoming" },
                    ],
                },
            ],
        };
    }

    // Unknown status value — pass through; the Mongo enum yields no rows.
    return { status };
}

/**
 * Reconcile the display status of fetched documents in-place.
 */
export function reconcileMatchDocs(docs, stateMap, snapshotAvailable) {
    return applyReconciledStatuses(docs, stateMap, snapshotAvailable);
}

/**
 * Display-only fallback for provider-confirmed LIVE matches that have no
 * MongoDB Match document because one or both team records do not exist
 * yet (Match.teamA/teamB are required refs, so matchSync skips them and
 * teams are never auto-created).
 *
 * Guarantees:
 *  - Only matches the provider snapshot currently confirms as LIVE are
 *    emitted — status is never derived from anything else.
 *  - Nothing is fabricated: team names, venue, date, format and scores
 *    come from the provider payload as-is; missing fields stay empty/null.
 *  - The docs are never persisted: _id is null and providerOnly=true so
 *    the UI can render them without linking to a match center that could
 *    not exist.
 *
 * @param {Object} args
 * @param {Map<string,string>} args.stateMap - from buildProviderStateMap
 * @param {Array<Object>} args.relevant - normalized provider matches
 * @param {Array<Object>} args.existingDocs - stored docs (only providerId
 *   is read) whose provider ids must NOT be duplicated
 * @param {boolean} args.snapshotAvailable
 * @returns {Array<Object>} synthetic match-shaped objects (max one per
 *   provider match id)
 */
export function buildProviderOnlyLiveDocs({
    stateMap,
    relevant,
    existingDocs,
    snapshotAvailable,
}) {
    if (!snapshotAvailable || !stateMap) return [];

    const existingIds = new Set(
        (Array.isArray(existingDocs) ? existingDocs : [])
            .map((doc) => doc?.providerId)
            .filter((id) => id !== undefined && id !== null && id !== "")
            .map(String)
    );

    const out = [];
    const seen = new Set();
    for (const match of Array.isArray(relevant) ? relevant : []) {
        const rawId = match?.id ?? match?.providerId;
        if (rawId === undefined || rawId === null || rawId === "") continue;
        const id = String(rawId);
        if (seen.has(id)) continue;
        seen.add(id);

        if (stateMap.get(id) !== "live") continue;
        if (existingIds.has(id)) continue;

        const [nameA, nameB] = collectProviderTeamNames(match);
        if (!nameA || !nameB) continue; // never invent team names

        const matchType =
            typeof match.matchType === "string" ? match.matchType.trim() : "";
        out.push({
            _id: null,
            providerOnly: true,
            id,
            providerId: id,
            status: "live",
            matchState: "live",
            format:
                FORMAT_MAP[normalizeName(matchType)] ||
                (matchType ? matchType.toLowerCase() : null),
            venue: typeof match.venue === "string" ? match.venue.trim() : "",
            matchDate: parseProviderMatchDate(match, null),
            teamA: { _id: null, name: nameA, country: null },
            teamB: { _id: null, name: nameB, country: null },
            scorecard: buildScorecardSummary(match.score) || {},
            tossWinner: null,
            tossDecision: null,
            winner: null,
            result: "",
            completedAt: null,
        });
    }
    return out;
}
