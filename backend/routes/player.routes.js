/**
 * Player routes.
 * Maps /api/players endpoints to player controllers:
 * listing (with pagination/filter/search), creation, top players, count,
 * search, and per-ID read/update/delete operations.
 */
import express from "express";
import {createPlayer,getTopPlayers,getAllPlayers,countPlayers,
    searchPlayers,searchPlayersById,deletePlayersById,updatePlayersById} from "../controllers/player.controller.js";
const router=express.Router();

router.get("/",getAllPlayers);

router.post("/",createPlayer);

router.get("/top",getTopPlayers);
router.get("/count",countPlayers);
router.get("/search",searchPlayers);
router.get("/:id",searchPlayersById)

router.delete("/:id",deletePlayersById)
router.patch("/:id",updatePlayersById)


export default router;