/**
 * Favorite controllers.
 * User-specific player/team/match favorites (watchlist) handlers.
 * All handlers require authentication (req.user from userAuth).
 * Favorites are stored as references in User.favorites.{players,teams,matches}.
 */
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Player from "../models/player.model.js";
import Team from "../models/team.model.js";
import Match from "../models/match.model.js";

const ENTITY_MODELS = {
    players: Player,
    teams: Team,
    matches: Match
};

function getEntityName(entityType) {
    if (entityType === "matches") return "Match";
    return entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1);
}

async function validateEntity(entityType, entityId) {
    if (!mongoose.Types.ObjectId.isValid(entityId)) {
        return { valid: false, status: 400, message: `Invalid ${entityType} ID` };
    }
    const Model = ENTITY_MODELS[entityType];
    if (!Model) {
        return { valid: false, status: 400, message: "Invalid entity type" };
    }
    const exists = await Model.exists({ _id: entityId });
    if (!exists) {
        return { valid: false, status: 404, message: `${getEntityName(entityType)} not found` };
    }
    return { valid: true };
}

/**
 * Reads the favorites sub-array for a given entity type from the user document.
 * Returns a plain array of ObjectId strings. Handles edge cases where
 * the document might not yet have all sub-keys (e.g. older docs).
 */
function getFavoritesArray(favorites, entityType) {
    if (!favorites || typeof favorites !== "object") return [];
    const arr = favorites[entityType];
    if (!Array.isArray(arr)) return [];
    return arr;
}

/**
 * Generic add favorite handler.
 */
async function addFavoriteHandler(req, res, entityType) {
    try {
        const { id } = req.params;

        const validation = await validateEntity(entityType, id);
        if (!validation.valid) {
            return res.status(validation.status).json({
                success: false,
                message: validation.message
            });
        }

        const user = await User.findById(req.user._id).select("favorites");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const favoritesArray = getFavoritesArray(user.favorites, entityType);
        const alreadyFavorited = favoritesArray.some(
            (favId) => favId && favId.toString() === id
        );
        if (alreadyFavorited) {
            return res.status(409).json({
                success: false,
                message: `${getEntityName(entityType)} already in favorites`
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { [`favorites.${entityType}`]: id } },
            { new: true }
        ).populate(`favorites.${entityType}`);

        return res.status(200).json({
            success: true,
            message: `${getEntityName(entityType)} added to favorites`,
            data: updatedUser.favorites[entityType],
            isFavorited: true
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Generic remove favorite handler.
 */
async function removeFavoriteHandler(req, res, entityType) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${entityType.slice(0, -1)} ID`
            });
        }

        const user = await User.findById(req.user._id).select("favorites");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const favoritesArray = getFavoritesArray(user.favorites, entityType);
        const isFavorited = favoritesArray.some(
            (favId) => favId && favId.toString() === id
        );
        if (!isFavorited) {
            return res.status(404).json({
                success: false,
                message: `${getEntityName(entityType)} not in favorites`
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { [`favorites.${entityType}`]: id } },
            { new: true }
        ).populate(`favorites.${entityType}`);

        return res.status(200).json({
            success: true,
            message: `${getEntityName(entityType)} removed from favorites`,
            data: updatedUser.favorites[entityType],
            isFavorited: false
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Generic get favorites handler.
 */
async function getFavoritesHandler(req, res, entityType) {
    try {
        const user = await User.findById(req.user._id).populate(`favorites.${entityType}`);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const favorites = getFavoritesArray(user.favorites, entityType).filter(Boolean);

        return res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Generic check favorite handler.
 */
async function checkFavoriteHandler(req, res, entityType) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${entityType.slice(0, -1)} ID`
            });
        }

        const user = await User.findById(req.user._id).select("favorites");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const favoritesArray = getFavoritesArray(user.favorites, entityType);
        const isFavorited = favoritesArray.some(
            (favId) => favId && favId.toString() === id
        );

        return res.status(200).json({
            success: true,
            isFavorited,
            entityId: id
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const addPlayerFavorite = (req, res) => addFavoriteHandler(req, res, "players");
export const removePlayerFavorite = (req, res) => removeFavoriteHandler(req, res, "players");
export const getPlayerFavorites = (req, res) => getFavoritesHandler(req, res, "players");
export const checkPlayerFavorite = (req, res) => checkFavoriteHandler(req, res, "players");

export const addTeamFavorite = (req, res) => addFavoriteHandler(req, res, "teams");
export const removeTeamFavorite = (req, res) => removeFavoriteHandler(req, res, "teams");
export const getTeamFavorites = (req, res) => getFavoritesHandler(req, res, "teams");
export const checkTeamFavorite = (req, res) => checkFavoriteHandler(req, res, "teams");

export const addMatchFavorite = (req, res) => addFavoriteHandler(req, res, "matches");
export const removeMatchFavorite = (req, res) => removeFavoriteHandler(req, res, "matches");
export const getMatchFavorites = (req, res) => getFavoritesHandler(req, res, "matches");
export const checkMatchFavorite = (req, res) => checkFavoriteHandler(req, res, "matches");

export const getAllFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("favorites.players")
            .populate("favorites.teams")
            .populate("favorites.matches");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: {
                players: getFavoritesArray(user.favorites, "players").filter(Boolean),
                teams: getFavoritesArray(user.favorites, "teams").filter(Boolean),
                matches: getFavoritesArray(user.favorites, "matches").filter(Boolean)
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
