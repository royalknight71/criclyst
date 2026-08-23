/**
 * Match routes.
 * Maps /api/matches endpoints to match controllers:
 * listing (with pagination/filtering), per-ID read, and
 * create/update/delete operations.
 */
import express from "express";
import {getAllMatches,getMatchById,createMatch,deleteMatch,updateMatch} from '../controllers/match.controller.js'

const router = express.Router()

router.get("/",getAllMatches)
router.get("/:id",getMatchById)
router.post("/",createMatch)
router.delete("/:id",deleteMatch)
router.patch("/:id",updateMatch)

export default router