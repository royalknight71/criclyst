/**
 * Player synchronization service.
 *
 * Upserts players discovered in CricAPI scorecard payloads, using
 * providerId as the primary identity. It reuses scorecard data that the
 * existing on-demand scorecard endpoint already fetched, so it performs
 * no additional CricAPI calls of its own.
 *
 * Rules enforced here:
 * - Existing players are matched by providerId first, then by normalized
 *   name (claiming the providerId when found that way) — no duplicates.
 * - Manually curated fields (career stats, styles, curated team, role) are
 *   preserved; provider data never overwrites them and match-level
 *   scorecard numbers are never written into career statistics.
 * - Schema-required fields get safe defaults only when creating.
 * - Teams are resolved by normalized name and players are attached with
 *   $addToSet; teams are never auto-created.
 */

import Player from "../models/player.model.js";
import Team from "../models/team.model.js";
import { normalizeName } from "./matchSync.service.js";

// Provider role strings → our Player.role enum
const ROLE_MAP = {
    bat: "Batsman",
    batsman: "Batsman",
    bowl: "Bowler",
    bowler: "Bowler",
    allrounder: "All-Rounder",
    "all-rounder": "All-Rounder",
    ar: "All-Rounder",
    wk: "Wicket-Keeper",
    "wicket-keeper": "Wicket-Keeper",
    wicketkeeper: "Wicket-Keeper",
    keeper: "Wicket-Keeper",
};

const VALID_ROLES = new Set(["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"]);

/** Map an arbitrary provider role string onto our role enum (or null). */
export function normalizeRole(role) {
    if (!role) return null;
    const key = normalizeName(role).replace(/\s+/g, "");
    const mapped = ROLE_MAP[key] || ROLE_MAP[normalizeName(role)];
    return VALID_ROLES.has(mapped) ? mapped : null;
}

/** Infer a role purely from scorecard participation. */
export function inferRoleFromScorecard(sawBatting, sawBowling, providerRole) {
    const explicit = normalizeRole(providerRole);
    if (explicit) return explicit;
    if (sawBatting && sawBowling) return "All-Rounder";
    if (sawBowling) return "Bowler";
    return "Batsman";
}

async function loadTeamIndex() {
    const teams = await Team.find({}).select("name country format").lean();
    const byName = new Map();
    for (const team of teams) {
        const key = normalizeName(team.name);
        if (key && !byName.has(key)) byName.set(key, team);
        const countryKey = normalizeName(team.country);
        if (countryKey && !byName.has(countryKey)) byName.set(countryKey, team);
    }
    return byName;
}

function resolveInningTeamName(inningLabel, providerTeamNames) {
    const label = normalizeName(inningLabel);
    if (!label) return null;
    for (const name of providerTeamNames) {
        const key = normalizeName(name);
        if (key && label.includes(key)) return key;
    }
    return null;
}

function extractPlayerRecords(data) {
    const innings = Array.isArray(data?.scorecard) ? data.scorecard : [];
    const providerTeamNames = [
        ...(Array.isArray(data?.teams) ? data.teams : []),
        ...(Array.isArray(data?.teamInfo) ? data.teamInfo.map((t) => t?.name) : []),
    ].filter(Boolean);
    const uniqueTeamNames = [...new Set(providerTeamNames.map(normalizeName).filter(Boolean))];

    const records = new Map();

    const collect = (raw, { batting, bowling, teamHint, providerRole }) => {
        const providerId = raw?.id !== undefined && raw?.id !== null ? String(raw.id) : null;
        const nameKey = normalizeName(raw?.name);
        if (!providerId && !nameKey) return;

        const key = providerId ? `id:${providerId}` : `name:${nameKey}`;
        const record = records.get(key) || {
            providerId,
            name: nameKey,
            sawBatting: false,
            sawBowling: false,
            teamName: null,
            providerRole: null,
        };
        if (providerId) record.providerId = providerId;
        if (nameKey) record.name = nameKey;
        record.sawBatting = record.sawBatting || !!batting;
        record.sawBowling = record.sawBowling || !!bowling;
        if (!record.teamName && teamHint) record.teamName = teamHint;
        if (!record.providerRole && providerRole) record.providerRole = providerRole;
        records.set(key, record);
    };

    for (const inning of innings) {
        // The inning label names the batting side. Batters therefore belong to
        // that team, while the bowlers listed in the same inning belong to the
        // opposing side of this fixture.
        const battingTeamHint = resolveInningTeamName(inning?.inning, uniqueTeamNames);
        const bowlingTeamHint = battingTeamHint
            ? uniqueTeamNames.find((name) => name !== battingTeamHint) || null
            : null;
        for (const entry of inning?.batting || []) {
            collect(entry?.batsman, { batting: true, bowling: false, teamHint: battingTeamHint, providerRole: entry?.batsman?.position });
        }
        for (const entry of inning?.bowling || []) {
            collect(entry?.bowler, { batting: false, bowling: true, teamHint: bowlingTeamHint, providerRole: entry?.bowler?.position });
        }
    }

    // Playing XI, when the provider includes it
    for (const raw of Array.isArray(data?.playingXI) ? data.playingXI : []) {
        collect(raw, { batting: false, bowling: false, teamHint: null, providerRole: raw?.position });
    }

    return [...records.values()];
}

/**
 * Upsert every player found in a scorecard payload.
 *
 * @param {Object} payload – full CricAPI scorecard response ({ status, data })
 *   or the inner data object itself
 * @returns {Promise<Object>} sync summary
 */
export async function syncPlayersFromScorecard(payload) {
    const summary = {
        total: 0,
        created: 0,
        updated: 0,
        synced: 0,
        skipped: 0,
        unresolvedTeams: new Set(),
    };

    const data = payload?.scorecard ? payload : payload?.data;
    const records = extractPlayerRecords(data);
    summary.total = records.length;    if (records.length === 0) {
        return finalizeSummary(summary);
    }

    const teamIndex = await loadTeamIndex();

    for (const record of records) {
        try {
            await upsertPlayer(record, teamIndex, summary);
        } catch (error) {
            summary.skipped++;
            console.warn(`[playerSync] Failed to sync player "${record.name || record.providerId}": ${error.message}`);
        }
    }

    return finalizeSummary(summary);
}

async function upsertPlayer(record, teamIndex, summary) {
    const team = record.teamName ? teamIndex.get(record.teamName) : null;
    if (record.teamName && !team) summary.unresolvedTeams.add(record.teamName);

    let player = null;
    let claimedProviderId = false;
    let created = false;

    // providerId is the primary identity; name is the fallback claim path.
    if (record.providerId) {
        player = await Player.findOne({ providerId: record.providerId });
    }
    if (!player && record.name) {
        player = await Player.findOne({ name: record.name });
        if (player && record.providerId && !player.providerId) claimedProviderId = true;
    }

    if (!player) {
        if (!record.name) {
            summary.skipped++;
            return;
        }
        try {
            player = await Player.create({
                name: record.name,
                providerId: record.providerId || null,
                country: team?.country || record.teamName || "unknown",
                role: inferRoleFromScorecard(record.sawBatting, record.sawBowling, record.providerRole),
                // Schema-required styles: safe defaults only, curated later by admins.
                battingStyle: "Right-Hand Bat",
                bowlingStyle: record.sawBowling ? "Right-arm Medium" : "None",
                matches: 1,
                team: record.teamName || "",
            });
            created = true;
        } catch (error) {
            // Unique-name index hit by a concurrent writer — continue as an update.
            if (error?.code !== 11000) throw error;
            player = await Player.findOne({ name: record.name });
            if (!player) {
                summary.skipped++;
                return;
            }
            if (record.providerId && !player.providerId) claimedProviderId = true;
        }
    }

    if (created) {
        summary.created++;
    } else {
        // Preserve curated fields; only fill gaps the provider can help with.
        // Career statistics and styles are never written by this sync.
        const set = {};
        if (claimedProviderId) set.providerId = record.providerId;
        if (!player.team && record.teamName) set.team = record.teamName;

        if (Object.keys(set).length > 0) {
            Object.assign(player, set);
            await player.save();
            summary.updated++;
        } else {
            summary.synced++;
        }
    }

    if (team && player?._id) {
        await Team.updateOne({ _id: team._id }, { $addToSet: { players: player._id } });
    }
}

function finalizeSummary(summary) {
    return { ...summary, unresolvedTeams: [...summary.unresolvedTeams] };
}
