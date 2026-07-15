import express from "express";
import {getAllMatches,getMatchById,createMatch,deleteMatch,updateMatch} from '../controllers/match.controller.js'

const router = express.Router()

router.get("/",getAllMatches)
router.get("/:id",getMatchById)
router.post("/",createMatch)
router.delete("/:id",deleteMatch)
router.patch("/:id",updateMatch)

export default router