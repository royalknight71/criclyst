/**
 * Socket.IO setup module.
 * Attaches Socket.IO to the existing HTTP server, handles client connections,
 * match-room join/leave, and broadcasts polling updates to connected clients.
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
import { getLatest, pollingEmitter } from "../services/cricketPolling.service.js";

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
 * Find a single match from the latest relevant data by its id.
 */
function findMatchById(matchId, relevant) {
  if (!Array.isArray(relevant)) return null;
  return relevant.find((m) => m.id === matchId) || null;
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

  io.on("connection", (socket) => {
    console.log(`[socket] Client connected: ${socket.id}`);

    // --- Initial data sync (no API call, uses in-memory latest) ---
    const latest = getLatest();
    const hasData = latest && Array.isArray(latest.relevant) && latest.relevant.length > 0;
    socket.emit("live:matches", {
      matches: hasData ? latest.relevant : [],
      available: latest !== null,
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
      if (latest && latest.relevant) {
        const match = findMatchById(matchId, latest.relevant);
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

  // --- Polling update listener ---
  pollingEmitter.on("live:update", (relevantMatches) => {
    if (!io) return;

    // Global broadcast
    io.emit("live:update", relevantMatches);

    // Per-match room broadcast (only send the relevant match to each room)
    if (Array.isArray(relevantMatches)) {
      for (const match of relevantMatches) {
        if (match && match.id) {
          const room = matchRoom(match.id);
          io.to(room).emit("live:update", [match]);
        }
      }
    }
  });

  console.log("[socket] Socket.IO initialized");
  return io;
}

function getIO() {
  return io;
}

export { initSocket, getIO };
