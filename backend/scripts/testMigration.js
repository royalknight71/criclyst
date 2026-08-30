import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

async function test() {
    await connectDB();
    
    // Create a user with legacy favorites format directly in MongoDB
    // We need to bypass Mongoose schema validation to insert legacy format
    const db = mongoose.connection.db;
    const userId = new mongoose.Types.ObjectId();
    
    await db.collection('users').insertOne({
        _id: userId,
        name: 'Legacy Test User',
        email: 'legacy' + Date.now() + '@test.com',
        password: 'hashedpassword',
        favorites: [new mongoose.Types.ObjectId('6a8efd3b58dda0752282fabf')], // Old format: array of player IDs
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    console.log('Created legacy user with raw insert:', userId);
    
    // Now read it back through Mongoose
    const userDoc = await User.findById(userId).select('favorites');
    console.log('Before migration (via Mongoose):', userDoc.favorites);
    
    // Test the migration logic
    const fav = userDoc.favorites;
    const isMigrated = fav && typeof fav === 'object' && !Array.isArray(fav) && 
        (fav.players !== undefined || fav.teams !== undefined || fav.matches !== undefined);
    
    console.log('Is migrated:', isMigrated);
    
    if (!isMigrated) {
        const legacyPlayers = Array.isArray(fav) ? fav : [];
        await User.findByIdAndUpdate(userDoc._id, {
            favorites: {
                players: legacyPlayers,
                teams: [],
                matches: []
            }
        });
        console.log('Migrated user');
    }
    
    const migratedUser = await User.findById(userDoc._id).select('favorites');
    console.log('After migration:', migratedUser.favorites);
    
    // Test getFavoritesArray logic
    function getFavoritesArray(favorites, entityType) {
        if (!favorites) return [];
        if (typeof favorites === 'object' && !Array.isArray(favorites) && favorites[entityType] !== undefined) {
            return favorites[entityType] || [];
        }
        if (entityType === 'players' && Array.isArray(favorites)) {
            return favorites;
        }
        return [];
    }
    
    const players = getFavoritesArray(migratedUser.favorites, 'players');
    console.log('Players array:', players);
    
    const teams = getFavoritesArray(migratedUser.favorites, 'teams');
    console.log('Teams array:', teams);
    
    const matches = getFavoritesArray(migratedUser.favorites, 'matches');
    console.log('Matches array:', matches);
    
    await mongoose.disconnect();
    console.log('Test completed successfully');
}

test().catch(console.error);