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

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export default socket;
