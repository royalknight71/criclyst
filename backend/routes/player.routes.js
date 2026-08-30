/**
 * Player routes.
 * Maps /api/players endpoints to player controllers:
 * listing (with pagination/filter/search), creation, top players, count,
 * search, and per-ID read/update/delete operations.
 */
import { userAuth } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/admin.middleware.js";
import express from "express";
import {createPlayer,getTopPlayers,getAllPlayers,countPlayers,
    searchPlayers,searchPlayersById,deletePlayersById,updatePlayersById,getPlayerAnalytics,getHomeHighlights} from "../controllers/player.controller.js";
const router=express.Router();

router.get("/",getAllPlayers);

router.get("/top",getTopPlayers);
router.get("/highlights",getHomeHighlights);
router.get("/count",countPlayers);
router.get("/search",searchPlayers);
router.get("/analytics",getPlayerAnalytics);
router.get("/:id",searchPlayersById)

router.post("/", userAuth, adminAuth, createPlayer);
router.patch("/:id", userAuth, adminAuth, updatePlayersById);
router.delete("/:id", userAuth, adminAuth, deletePlayersById);

export default router;