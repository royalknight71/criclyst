/**
 * Socket.IO setup module.
 * Attaches Socket.IO to the existing HTTP server, handles client connections,
 * match-room join/leave, and broadcasts live-score updates received from
 * the Redis Pub/Sub layer.
 *
 * Event names:
 *   Server → Client:
 *     "live:matches"  — initial full dataset on connect
 *     "live:update"   — incremental update when polling detects changes
 *   Client → Server:
 *     "join:match"    — join a match room (payload: { matchId })
 *     "leave:match"   — leave a match room (payload: { matchId })
 */

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { getLatest, getLastError } from "../services/cricketPolling.service.js";
import {
  subscribeToLiveUpdates,
  subscribeToStatusUpdates,
} from "../services/redisPubSub.service.js";
import { userRoom } from "../services/notificationDelivery.service.js";
import Notification from "../models/notification.model.js";

const CORS_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://criclyst.vercel.app",
];

let io = null;

function matchRoom(matchId) {
  return `match:${matchId}`;
}

function isValidMatchId(id) {
  return typeof id === "string" && id.trim().length > 0 && id.length <= 128;
}

/**
 * Find a single match from the latest live matches data by its id.
 */
function findMatchById(matchId, matches) {
  if (!Array.isArray(matches)) return null;
  return matches.find((m) => m.id === matchId) || null;
}

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  });

  // Authenticate socket connections via JWT cookie
io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || "";

    const token = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.split("=")
        .slice(1)
        .join("=")

    // No token → anonymous connection is allowed
    if (!token) {
        socket.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(
            decodeURIComponent(token),
            process.env.JWT_SECRET
        );

        socket.user = decoded;
        socket.userId = decoded.id;
        return next();
    } catch (error) {
        // Invalid/stale token should not kill public live scores.
        socket.user = null;
        console.warn("[socket] Invalid JWT — continuing as anonymous");
        return next();
    }
});

  io.on("connection", (socket) => {
    console.log(`[socket] Client connected: ${socket.id}`);

    // Join user-specific room for notifications
    if (socket.userId) {
      const room = userRoom(socket.userId);
      socket.join(room);
      console.log(`[socket] ${socket.id} joined user room ${room}`);

      // Send initial unread count
      Notification.countDocuments({ userId: socket.userId, read: false })
        .then((count) => {
          socket.emit("notification:unread-count", { count });
        })
        .catch(() => {});
    }

    // --- Initial data sync (no API call, uses in-memory latest) ---
    const latest = getLatest();
    const lastErr = getLastError();
    const hasData = latest !== null;
    const liveMatches = hasData && Array.isArray(latest.liveMatches) ? latest.liveMatches : [];

    socket.emit("live:matches", {
      matches: liveMatches,
      available: hasData,
      liveCount: liveMatches.length,
      totalFetched: hasData && Array.isArray(latest.relevant) ? latest.relevant.length : 0,
      lastError: lastErr,
      fetchedAt: latest?.fetchedAt || null,
    });

    // --- Join a match room ---
    socket.on("join:match", (payload) => {
      if (!payload || typeof payload !== "object") return;
      const { matchId } = payload;
      if (!isValidMatchId(matchId)) {
        socket.emit("error", { message: "Invalid matchId" });
        return;
      }
      const room = matchRoom(matchId);
      socket.join(room);
      console.log(`[socket] ${socket.id} joined ${room}`);

      // Send current data for this match if available
      if (latest && latest.liveMatches) {
        const match = findMatchById(matchId, latest.liveMatches);
        if (match) {
          socket.emit("live:update", [match]);
        }
      }
    });

    // --- Leave a match room ---
    socket.on("leave:match", (payload) => {
      if (!payload || typeof payload !== "object") return;
      const { matchId } = payload;
      if (!isValidMatchId(matchId)) return;
      const room = matchRoom(matchId);
      socket.leave(room);
      console.log(`[socket] ${socket.id} left ${room}`);
    });

    // --- Disconnect ---
    socket.on("disconnect", (reason) => {
      console.log(`[socket] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  // --- Live update listener (via Redis Pub/Sub or in-process fallback) ---
  subscribeToLiveUpdates((allMatches) => {
    if (!io) return;

    // Filter to only genuinely live matches for the live-score broadcast
    const liveMatches = Array.isArray(allMatches)
      ? allMatches.filter((m) => m && (m.matchState === "live" || (m.matchStarted === true && m.matchEnded !== true)))
      : [];

    // Global broadcast — only genuinely live matches
    io.emit("live:update", liveMatches);

    // Per-match room broadcast (only send the relevant match to each room)
    for (const match of liveMatches) {
      if (match && match.id) {
        const room = matchRoom(match.id);
        io.to(room).emit("live:update", [match]);
      }
    }
  });
  // --- Polling status/error updates ---
  subscribeToStatusUpdates((status) => {
    if (!io) return;

    io.emit("live:status", {
      lastError: status?.lastError ?? null,
      timestamp: status?.timestamp || new Date().toISOString(),
    });
  });
  console.log("[socket] Socket.IO initialized");
  return io;
}

function getIO() {
  return io;
}

export { initSocket, getIO };
