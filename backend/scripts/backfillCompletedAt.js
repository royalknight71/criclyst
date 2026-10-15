/**
 * One-time backfill: set completedAt on existing completed Match records
 * that predate the completedAt field.
 *
 * completedAt = matchDate (provider match date) when available, otherwise
 * updatedAt (the time the completion was last observed). This is a safe,
 * additive migration — it never deletes or rewrites other fields, and it
 * never overwrites an existing completedAt.
 *
 * Run: node backend/scripts/backfillCompletedAt.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import Match from "../models/match.model.js";

async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        dbName: "criclystDB",
    });

    const result = await Match.updateMany(
        { status: "completed", completedAt: null },
        [
            {
                $set: {
                    completedAt: { $ifNull: ["$matchDate", "$updatedAt"] },
                },
            },
        ],
        { updatePipeline: true }
    );

    console.log(
        `[backfillCompletedAt] matched=${result.matchedCount} modified=${result.modifiedCount}`
    );
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error("[backfillCompletedAt] Failed:", error.message);
    process.exit(1);
});
