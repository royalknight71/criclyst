/**
 * Favorite controllers.
 * User-specific player favorites (watchlist) handlers.
 * All handlers require authentication (req.user from userAuth).
 * Favorites are stored as Player ObjectId references in User.favorites.
 */
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Player from "../models/player.model.js";

/**
 * Adds a player to the current user's favorites.
 * Validates playerId, checks existence, prevents duplicates via $addToSet.
 */
export const addFavorite = async (req, res) => {
    try {
        const { playerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Player ID"
            });
        }

        const playerExists = await Player.exists({ _id: playerId });
        if (!playerExists) {
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }

        const user = await User.findById(req.user._id).select("favorites");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const alreadyFavorited = user.favorites.some(
            (id) => id.toString() === playerId
        );
        if (alreadyFavorited) {
            return res.status(409).json({
                success: false,
                message: "Player already in favorites"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favorites: playerId } },
            { new: true }
        ).populate("favorites");

        return res.status(200).json({
            success: true,
            message: "Player added to favorites",
            data: updatedUser.favorites,
            isFavorited: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Removes a player from the current user's favorites.
 */
export const removeFavorite = async (req, res) => {
    try {
        const { playerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Player ID"
            });
        }

        const user = await User.findById(req.user._id).select("favorites");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isFavorited = user.favorites.some(
            (id) => id.toString() === playerId
        );
        if (!isFavorited) {
            return res.status(404).json({
                success: false,
                message: "Player not in favorites"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favorites: playerId } },
            { new: true }
        ).populate("favorites");

        return res.status(200).json({
            success: true,
            message: "Player removed from favorites",
            data: updatedUser.favorites,
            isFavorited: false
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Gets current user's favorite players (populated).
 * Filters out nulls from deleted players.
 */
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("favorites");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Filter out stale references (player deleted)
        const favorites = user.favorites.filter(Boolean);

        return res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Checks whether a specific player is favorited by current user.
 */
export const checkFavorite = async (req, res) => {
    try {
        const { playerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Player ID"
            });
        }

        const user = await User.findById(req.user._id).select("favorites");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isFavorited = user.favorites.some(
            (id) => id.toString() === playerId
        );

        return res.status(200).json({
            success: true,
            isFavorited,
            playerId
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
