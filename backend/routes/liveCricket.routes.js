import express from "express";
import { testLiveCricket } from "../controllers/liveCricket.controller.js";

const router = express.Router();

router.get("/test", testLiveCricket);

export default router;
