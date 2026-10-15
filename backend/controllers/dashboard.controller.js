/**
 * Dashboard controllers.
 * Aggregated read-only endpoints powering the dashboard: overall counts,
 * live/recent/upcoming matches, and top player leaderboards.
 */
import mongoose from "mongoose";
import Player from "../models/player.model.js";
import Team from "../models/team.model.js";
import Match from "../models/match.model.js";
import {
    getStatusSnapshot,
    buildStatusFilter,
    reconcileMatchDocs,
    buildProviderOnlyLiveDocs,
    getIdsWithState,
    RECENT_MATCHES_SORT,
} from "../services/matchQuery.service.js";

// Configurable section sizes (env override, sane defaults).
function getSectionLimit(envValue, fallback) {
    const raw = Number(envValue);
    return Number.isFinite(raw) && raw > 0 ? Math.min(raw, 50) : fallback;
}

/**
 * Returns aggregate counts for players, teams, and matches
 * (totals plus active/completed/live/upcoming breakdowns),
 * computed concurrently via Promise.all.
 */
export const getAllStats=async (req,res)=>{
    try{
        const { snapshotAvailable, stateMap } = getStatusSnapshot();
        const completedFilter = buildStatusFilter("completed", stateMap, snapshotAvailable);
        const upcomingFilter = buildStatusFilter("upcoming", stateMap, snapshotAvailable);
        // Displayed live set == provider-confirmed live ids (stored doc or
        // provider-only fallback doc), so the count uses the id set directly
        // and can never disagree with the live sections above.
        const liveMatchesCount = snapshotAvailable
            ? getIdsWithState(stateMap, "live").length
            : await Match.countDocuments(buildStatusFilter("live", stateMap, snapshotAvailable));

        const [totalPlayers,activePlayers,totalTeams,activeTeams,totalMatches,completedMatches,upcomingMatches]
        =await Promise.all([Player.countDocuments(),
            Player.countDocuments({
                isActive:true
            }),
            Team.countDocuments(),
            Team.countDocuments({
            isActive:true
        }),
        Match.countDocuments(),
        Match.countDocuments(completedFilter),
        Match.countDocuments(upcomingFilter)
        ])
        const liveMatches = liveMatchesCount;

        return res.status(200).json({
            success:true,
            data:{
                "totalPlayers":totalPlayers,
                "activePlayers":activePlayers,
                "totalTeams":totalTeams,
                "activeTeams":activeTeams,
                "totalMatches":totalMatches,
                "completedMatches":completedMatches,
                "liveMatches":liveMatches,
                "upcomingMatches":upcomingMatches
            }
        })
        
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

/**
 * Returns all live matches confirmed in-progress by the authoritative
 * provider snapshot, sorted by match date ascending.
 */
export const getLiveMatches=async (req,res)=>{
    try{
        const { snapshotAvailable, stateMap, meta, relevant } = getStatusSnapshot();
        const liveMatches=await Match.find(
            buildStatusFilter("live", stateMap, snapshotAvailable)
        ).sort({
            matchDate: 1
        }).populate("teamA", "name country captain").populate("teamB", "name country captain")
        .populate("tossWinner", "name country captain").lean()

        reconcileMatchDocs(liveMatches, stateMap, snapshotAvailable);

        // Provider-confirmed live matches with no stored Match document
        // (teams not in MongoDB yet) — appended as display-only docs so
        // Home's live section always matches /api/live-cricket/live.
        if (snapshotAvailable) {
            const confirmedLiveIds = getIdsWithState(stateMap, "live");
            if (confirmedLiveIds.length > 0) {
                const stored = await Match.find({
                    providerId: { $in: confirmedLiveIds },
                })
                    .select("providerId")
                    .lean();
                liveMatches.push(
                    ...buildProviderOnlyLiveDocs({
                        stateMap,
                        relevant,
                        existingDocs: stored,
                        snapshotAvailable,
                    })
                );
            }
        }

        const liveMatchesCount=liveMatches.length

        return res.status(200).json({
            success:true,
            "count":liveMatchesCount,
            meta,
            data:liveMatches
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

/**
 * Returns the most recent completed matches (newest completion first),
 * sorted by completedAt with matchDate as the legacy fallback.
 */
export const getRecentMatches=async (req,res)=>{
    try{
        const limit = getSectionLimit(process.env.DASHBOARD_RECENT_LIMIT, 5);
        const { snapshotAvailable, stateMap, meta } = getStatusSnapshot();
        const recentMatches=await Match.find(
            buildStatusFilter("completed", stateMap, snapshotAvailable)
        ).sort(RECENT_MATCHES_SORT).limit(limit).populate("teamA","name country captain coach").populate("teamB","name country captain coach")
        .populate("tossWinner","name country captain").populate("winner","name country captain").populate(
            "manOfTheMatch",
            "name country role"
        ).lean()

        reconcileMatchDocs(recentMatches, stateMap, snapshotAvailable);

        const recentMatchesCount=recentMatches.length
            return res.status(200).json({
            success:true,
            "count":recentMatchesCount,
            meta,
            data:recentMatches
        })

    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

/**
 * Returns the next upcoming fixtures (earliest first) that the provider
 * has not started, with both teams populated.
 */
export const getUpcomingMatches=async (req,res)=>{
    try{
        const limit = getSectionLimit(process.env.DASHBOARD_UPCOMING_LIMIT, 5);
        const { snapshotAvailable, stateMap, meta } = getStatusSnapshot();
        const upcomingMatches=await Match.find(
            buildStatusFilter("upcoming", stateMap, snapshotAvailable)
        ).sort({
            matchDate: 1
        }).limit(limit).populate("teamA", "name country captain").populate("teamB", "name country captain").lean()

        reconcileMatchDocs(upcomingMatches, stateMap, snapshotAvailable);

        const upcomingMatchesCount=upcomingMatches.length

        return res.status(200).json({
            success:true,
            "count":upcomingMatchesCount,
            meta,
            data:upcomingMatches
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

/**
 * Returns leaderboard data: the top 5 run scorers and top 5 wicket takers,
 * both tie-broken by fewer matches played, fetched concurrently.
 */
export const getTopPlayers=async (req,res)=>{
    try{
        const [topRunScorers,topWicketTakers]=await Promise.all([
            Player.find().select("name country role runs wickets matches image").sort({
                "runs":-1,
                matches: 1
            }).limit(5).lean(),
            Player.find().select("name country role runs wickets matches image") 
            .sort({"wickets":-1,
                matches: 1
            }).limit(5).lean()
        ])
        return res.status(200).json({
            success:true,
            data:{
                topRunScorers,
                topWicketTakers
            }
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}