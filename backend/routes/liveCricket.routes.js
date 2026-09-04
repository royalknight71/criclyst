import express from "express";
import { testLiveCricket, triggerPoll, getLatestData, getMatchScorecard } from "../controllers/liveCricket.controller.js";

const router = express.Router();

router.get("/test", testLiveCricket);
router.post("/poll", triggerPoll);
router.get("/latest", getLatestData);
router.get("/match/:id/scorecard", getMatchScorecard);

export default router;
