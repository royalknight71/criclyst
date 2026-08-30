/**
 * Match routes.
 * Maps /api/matches endpoints to match controllers:
 * listing (with pagination/filtering), per-ID read, and
 * create/update/delete operations.
 */
import express from "express";
import {getAllMatches,getMatchById,createMatch,deleteMatch,updateMatch} from '../controllers/match.controller.js'
import {userAuth} from '../middleware/auth.middleware.js'
import {adminAuth} from '../middleware/admin.middleware.js'

const router = express.Router()

router.get("/",getAllMatches)
router.get("/:id",getMatchById)

router.post("/",userAuth,adminAuth,createMatch)
router.delete("/:id",userAuth,adminAuth,deleteMatch)
router.patch("/:id",userAuth,adminAuth,updateMatch)

export default router