/**
 * Migration script for favorites.
 * Migrates existing player favorites from the old `favorites` array
 * to the new `favorites.players` array.
 * 
 * Usage: node backend/scripts/migrateFavorites.js
 */
import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

function isNewStructure(fav) {
    if (!fav || typeof fav !== 'object') return false;
    if (Array.isArray(fav)) return false;
    // Check if it's a MongooseDocument wrapping an array (legacy)
    // If JSON.stringify shows an array, it's legacy
    try {
        const str = JSON.stringify(fav);
        if (str.startsWith('[')) return false; // It's an array
    } catch {
        // Ignore JSON.stringify errors
    }
    // Check for actual new structure properties (not just schema paths)
    // Use hasOwnProperty to avoid Mongoose getters
    return Object.prototype.hasOwnProperty.call(fav, 'players') || 
           Object.prototype.hasOwnProperty.call(fav, 'teams') || 
           Object.prototype.hasOwnProperty.call(fav, 'matches');
}

function isLegacyArray(fav) {
    if (Array.isArray(fav)) return true;
    if (!fav || typeof fav !== 'object') return false;
    // Check for MongooseArray or array-like Document
    if (typeof fav.length === 'number' && !isNewStructure(fav)) return true;
    // Check if it has numeric indices (array-like)
    if ('0' in fav && !isNewStructure(fav)) return true;
    // Check if JSON representation is an array (MongooseDocument wrapping array)
    try {
        const str = JSON.stringify(fav);
        if (str.startsWith('[') && !isNewStructure(fav)) return true;
    } catch {
        // Ignore JSON.stringify errors
    }
    return false;
}

function extractLegacyArray(fav) {
    if (!fav) return [];
    if (Array.isArray(fav)) return fav;
    // Try toObject first (MongooseDocument)
    if (typeof fav.toObject === 'function') {
        try {
            const obj = fav.toObject({ transform: false, depopulate: true });
            if (Array.isArray(obj)) {
                return obj;
            } else if (obj && typeof obj === 'object') {
                // Might be an object with numeric keys
                return Object.values(obj);
            }
        } catch {
            // Ignore toObject errors
        }
    }
    // Fallback to JSON parse
    try {
        const parsed = JSON.parse(JSON.stringify(fav));
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // Ignore JSON parse errors
    }
    // Last resort
    return Array.from(fav || []);
}

async function migrateFavorites() {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Find all users - we'll check each one for legacy format
        const users = await User.find({}).select("favorites");

        console.log(`Found ${users.length} total users`);

        let migratedCount = 0;
        let skippedCount = 0;
        for (const user of users) {
            const fav = user.favorites;

            // Already has new structure
            if (isNewStructure(fav)) {
                skippedCount++;
                continue;
            }

            // Has legacy array format (or null/undefined)
            if (isLegacyArray(fav) || fav === null || fav === undefined) {
                const oldFavorites = extractLegacyArray(fav);
                await User.findByIdAndUpdate(user._id, {
                    favorites: {
                        players: oldFavorites,
                        teams: [],
                        matches: []
                    }
                });
                migratedCount++;
                console.log(`Migrated user ${user._id} (${oldFavorites.length} player favorites)`);
                continue;
            }

            // Unknown format - log and skip
            console.log(`User ${user._id} has unknown favorites format, skipping`);
            skippedCount++;
        }

        console.log(`Migration complete. Migrated: ${migratedCount}, Skipped: ${skippedCount}`);

    } catch (error) {
        console.error("Migration error:", error.message);
        process.exit(1);
    } finally {
        await import("mongoose").then(m => m.default.disconnect());
        console.log("Disconnected from DB");
    }
}

migrateFavorites();