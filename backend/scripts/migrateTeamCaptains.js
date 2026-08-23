/**
 * One-off migration script: converts Team.captain values stored as player
 * name strings into Player ObjectId references.
 * Connects to MongoDB, iterates all teams via the raw collection (bypassing
 * the current schema's ObjectId cast), looks up each captain by trimmed,
 * lowercased name, and updates the reference in place.
 *
 * Run manually: node scripts/migrateTeamCaptains.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../models/team.model.js";
import Player from "../models/player.model.js";

dotenv.config({
  path: "./backend/.env"
});

/**
 * Performs the captain string-to-ObjectId migration and disconnects
 * from the database on completion; exits with code 1 on failure.
 */
const migrateCaptains = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected");

    // Use raw MongoDB collection because old captain
    // values are strings while current schema expects ObjectId.
    const teams = await Team.collection.find({}).toArray();

    for (const team of teams) {
      if (!team.captain) {
        console.log(`No captain found for ${team.name}`);
        continue;
      }

      if (typeof team.captain === "string") {
        const player = await Player.findOne({
          name: team.captain.trim().toLowerCase()
        });

        if (!player) {
          console.log(
            `Player not found for ${team.name}: ${team.captain}`
          );
          continue;
        }

        await Team.collection.updateOne(
          { _id: team._id },
          {
            $set: {
              captain: player._id
            }
          }
        );

        console.log(
          `${team.name} → ${player.name}`
        );
      }
    }

    console.log("Captain migration completed");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateCaptains();