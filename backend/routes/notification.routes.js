/**
 * Notification routes.
 * Maps /api/notifications endpoints to notification controllers.
 * All routes require authentication.
 */
import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(userAuth);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;
