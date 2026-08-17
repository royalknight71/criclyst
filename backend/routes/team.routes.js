import express from "express";
import {getAllTeams,getTeamsById,createTeam,updateTeam,deleteTeam} from "../controllers/team.controller.js";
const router=express.Router();

router.get("/",getAllTeams)
router.get("/:id",getTeamsById)
router.post("/",createTeam)
router.patch("/:id",updateTeam)
router.delete("/:id",deleteTeam)

export default router