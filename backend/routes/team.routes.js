/**
 * Team routes.
 * Maps /api/teams endpoints to team controllers:
 * listing (with pagination/filter/search), count, search, per-ID read,
 * and create/update/delete operations.
 */
import express from "express";
import {
  getAllTeams,
  getTeamsById,
  createTeam,
  updateTeam,
  deleteTeam,
  countTeams,
  searchTeams,
} from "../controllers/team.controller.js";
const router = express.Router();

router.get("/", getAllTeams);
router.post("/", createTeam);

router.get("/count", countTeams);
router.get("/search", searchTeams);

router.get("/:id", getTeamsById);
router.patch("/:id", updateTeam);
router.delete("/:id", deleteTeam);

export default router;
