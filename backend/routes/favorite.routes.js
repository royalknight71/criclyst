/**
 * Favorite routes.
 * Maps /api/users/favorites endpoints to favorite controllers.
 * All routes are protected by userAuth.
 */
import express from 'express';
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from '../controllers/favorite.controller.js';
import { userAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// All favorites routes require authentication
router.use(userAuth);

router.get("/", getFavorites);

router.get("/:playerId/check", checkFavorite);

router.post("/:playerId", addFavorite);

router.delete("/:playerId", removeFavorite);

export default router;
