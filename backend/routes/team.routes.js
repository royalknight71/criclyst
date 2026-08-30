/**
 * Team routes.
 * Maps /api/teams endpoints to team controllers:
 * listing (with pagination/filter/search), count, search, per-ID read,
 * and create/update/delete operations.
 */
import { userAuth } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/admin.middleware.js";
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

router.get("/count", countTeams);
router.get("/search", searchTeams);

router.get("/:id", getTeamsById);
router.post("/", userAuth, adminAuth, createTeam);
router.patch("/:id", userAuth, adminAuth, updateTeam);
router.delete("/:id", userAuth, adminAuth, deleteTeam);

export default router;
