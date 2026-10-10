/**
 * Shared Socket.IO client singleton.
 *
 * Creates a single persistent connection to the Criclyst backend
 * using the VITE_SOCKET_URL environment variable (or same-origin
 * in production). All components import this module rather than
 * creating their own connections.
 */

import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || window.location.origin;

console.log("[socket] Connecting to:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["polling", "websocket"],
});

socket.on("connect", () => {
  console.log("[socket] Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("[socket] Disconnected:", reason);
});

export default socket;
