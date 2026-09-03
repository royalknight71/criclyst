import express from "express";
import { testLiveCricket, triggerPoll, getLatestData } from "../controllers/liveCricket.controller.js";

const router = express.Router();

router.get("/test", testLiveCricket);
router.post("/poll", triggerPoll);
router.get("/latest", getLatestData);

export default router;
