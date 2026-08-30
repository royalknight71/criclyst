/**
 * Favorite routes.
 * Maps /api/users/favorites endpoints to favorite controllers.
 * All routes are protected by userAuth.
 */
import express from 'express';
import {
    addPlayerFavorite,
    removePlayerFavorite,
    getPlayerFavorites,
    checkPlayerFavorite,
    addTeamFavorite,
    removeTeamFavorite,
    getTeamFavorites,
    checkTeamFavorite,
    addMatchFavorite,
    removeMatchFavorite,
    getMatchFavorites,
    checkMatchFavorite,
    getAllFavorites
} from '../controllers/favorite.controller.js';
import { userAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// All favorites routes require authentication
router.use(userAuth);

// Get all favorites (combined)
router.get("/", getAllFavorites);

// PLAYERS
router.get("/players", getPlayerFavorites);
router.get("/players/:id/check", checkPlayerFavorite);
router.post("/players/:id", addPlayerFavorite);
router.delete("/players/:id", removePlayerFavorite);

// TEAMS
router.get("/teams", getTeamFavorites);
router.get("/teams/:id/check", checkTeamFavorite);
router.post("/teams/:id", addTeamFavorite);
router.delete("/teams/:id", removeTeamFavorite);

// MATCHES
router.get("/matches", getMatchFavorites);
router.get("/matches/:id/check", checkMatchFavorite);
router.post("/matches/:id", addMatchFavorite);
router.delete("/matches/:id", removeMatchFavorite);

export default router;