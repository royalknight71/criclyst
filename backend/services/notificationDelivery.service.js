/**
 * Notification delivery service.
 *
 * Handles Socket.IO emission of notifications to specific users.
 * Uses a "user:<userId>" room pattern so each user receives only
 * their own notifications across all connected tabs/devices.
 */

import { getIO } from "../config/socket.js";

function userRoom(userId) {
  return `user:${userId}`;
}

function deliverNotification(userId, notification) {
  const io = getIO();
  if (!io) return;
  io.to(userRoom(userId)).emit("notification:new", notification);
}

function deliverBulkNotifications(userId, notifications) {
  const io = getIO();
  if (!io) return;
  io.to(userRoom(userId)).emit("notification:batch", notifications);
}

function emitUnreadCount(userId, count) {
  const io = getIO();
  if (!io) return;
  io.to(userRoom(userId)).emit("notification:unread-count", { count });
}

export { deliverNotification, deliverBulkNotifications, emitUnreadCount, userRoom };
