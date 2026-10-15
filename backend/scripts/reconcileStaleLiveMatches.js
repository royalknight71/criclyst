/**
 * One-time reconciliation: demote stored "live" matches whose scheduled
 * date is more than 48 hours past and that carry no confirmed result.
 *
 * This mirrors the read-time rule "live requires current provider
 * confirmation" for databases that accumulated stale live records while
 * provider polling was failing (e.g. quota exhaustion). It never deletes
 * records and never fabricates results — it only flips the status and
 * stamps completedAt (matchDate when available).
 *
 * Genuinely live matches are never affected: no in-progress match has a
 * scheduled date more than 48 hours in the past except multi-day tests,
 * which are re-confirmed by every successful provider poll (see
 * matchSync.service feed-absence sweep).
 *
 * Run: node backend/scripts/reconcileStaleLiveMatches.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import Match from "../models/match.model.js";

const STALE_LIVE_MS = 48 * 60 * 60 * 1000;

async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        dbName: "criclystDB",
    });

    const cutoff = new Date(Date.now() - STALE_LIVE_MS);
    const staleLive = await Match.find({
        status: "live",
        matchDate: { $lt: cutoff },
    })
        .select("matchDate providerId result")
        .lean();

    console.log(
        `[reconcileStaleLiveMatches] ${staleLive.length} stale live record(s) older than 48h`
    );
    for (const match of staleLive) {
        console.log(
            `  - ${match.providerId || "(no providerId)"} matchDate=${match.matchDate?.toISOString?.()} result="${match.result || ""}"`
        );
    }

    const result = await Match.updateMany(
        { status: "live", matchDate: { $lt: cutoff } },
        [
            {
                $set: {
                    status: "completed",
                    completedAt: {
                        $ifNull: ["$completedAt", { $ifNull: ["$matchDate", "$$NOW"] }],
                    },
                },
            },
        ],
        { updatePipeline: true }
    );

    console.log(
        `[reconcileStaleLiveMatches] matched=${result.matchedCount} modified=${result.modifiedCount}`
    );
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error("[reconcileStaleLiveMatches] Failed:", error.message);
    process.exit(1);
});
