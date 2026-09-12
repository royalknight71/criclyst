/**
 * Match subscription routes.
 * Maps /api/match-subscriptions endpoints to subscription controllers.
 * All routes require authentication.
 */
import express from "express";
import {
  subscribeToMatch,
  unsubscribeFromMatch,
  checkSubscription,
  getSubscriptions,
} from "../controllers/matchSubscription.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(userAuth);

router.get("/", getSubscriptions);
router.get("/:matchId/check", checkSubscription);
router.post("/:matchId", subscribeToMatch);
router.delete("/:matchId", unsubscribeFromMatch);

export default router;
