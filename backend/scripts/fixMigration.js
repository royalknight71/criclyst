import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

async function fixMigration() {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Restore the lost player favorites
        const fixes = [
            { id: "6a8ef99158dda0752282fab3", players: ["6a8efd3b58dda0752282fabf","6a5490e35e0d33ade17b9c2c","6a5490e35e0d33ade17b9c2b"] },
            { id: "6a9271197dc15a5d501cbaf4", players: ["6a5490e35e0d33ade17b9c2c"] },
            { id: "6a93a670bced214bbd02c82b", players: ["6a8efd3b58dda0752282fabf"] },
            { id: "6a93b61dbd386bbcc9c40f7d", players: ["6a8efd3b58dda0752282fabf"] },
            { id: "6a93b648ce11b3d7b8a21846", players: ["6a8efd3b58dda0752282fabf"] },
            { id: "6a93b76f0b8589f73dd7112d", players: ["6a8efd3b58dda0752282fabf"] },
            { id: "6a93b9113d4e011b48de1983", players: ["6a8efd3b58dda0752282fabf"] },
        ];

        for (const fix of fixes) {
            await User.findByIdAndUpdate(fix.id, {
                favorites: {
                    players: fix.players,
                    teams: [],
                    matches: []
                }
            });
            console.log(`Fixed user ${fix.id} with ${fix.players.length} player favorites`);
        }

        console.log("Fix complete");

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await import("mongoose").then(m => m.default.disconnect());
        console.log("Disconnected from DB");
    }
}

fixMigration();