/**
 * Redis Pub/Sub module for the live-score event distribution layer.
 *
 * Creates dedicated publisher and subscriber connections (required by Redis
 * because a client in subscriber mode can only use Pub/Sub commands).
 *
 * Configuration:
 *   REDIS_URL  — full Redis URL (preferred), e.g. redis://localhost:6379
 *   REDIS_HOST — hostname (fallback if REDIS_URL not set)
 *   REDIS_PORT — port (fallback if REDIS_URL not set)
 *   REDIS_PASSWORD — password (used with both URL and host/port modes)
 *
 * The module is optional: if Redis is unavailable the caller receives null
 * clients and the system falls back to in-process EventEmitter delivery.
 */

import { createClient } from "redis";

const CHANNEL = "cricket:live";
const CONNECT_TIMEOUT_MS = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

function resolveConfig() {
  const url = process.env.REDIS_URL;
  if (url) {
    return { url };
  }

  const host = process.env.REDIS_HOST || "127.0.0.1";
  const port = Number(process.env.REDIS_PORT) || 6379;
  const password = process.env.REDIS_PASSWORD || undefined;

  return {
    socket: { host, port },
    ...(password ? { password } : {}),
  };
}

/**
 * Create a Redis client with bounded reconnect and standard event logging.
 */
function createRedisClient(label, overrides = {}) {
  const baseConfig = resolveConfig();
  const config = {
    ...baseConfig,
    socket: {
      ...(baseConfig.socket || {}),
      reconnectStrategy: (retries) => {
        if (retries >= MAX_RECONNECT_ATTEMPTS) {
          console.error(`[Redis:${label}] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached — giving up`);
          return new Error(`Max reconnect attempts reached`);
        }
        const delay = Math.min(retries * 200, 2000);
        console.log(`[Redis:${label}] Reconnecting in ${delay}ms (attempt ${retries + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        return delay;
      },
      ...(overrides.socket || {}),
    },
    ...overrides,
  };

  const client = createClient(config);

  client.on("error", (err) => {
    console.error(`[Redis:${label}] Error:`, err.message);
  });

  client.on("connect", () => {
    console.log(`[Redis:${label}] Connecting...`);
  });

  client.on("ready", () => {
    console.log(`[Redis:${label}] Connected`);
  });

  client.on("reconnecting", () => {
    console.log(`[Redis:${label}] Reconnecting...`);
  });

  return client;
}

/**
 * Initialize publisher and subscriber clients.
 *
 * Returns { publisher, subscriber } — each may be null if connection fails.
 * The caller is responsible for connecting and disconnecting.
 */
function createPubSubClients() {
  const publisher = createRedisClient("Publisher");

  // duplicate() copies connection options; override subscriber event handlers
  const subscriber = publisher.duplicate();

  // Re-bind subscriber-specific log labels
  subscriber.removeAllListeners("error");
  subscriber.on("error", (err) => {
    console.error("[Redis:Subscriber] Error:", err.message);
  });

  subscriber.removeAllListeners("connect");
  subscriber.on("connect", () => {
    console.log("[Redis:Subscriber] Connecting...");
  });

  subscriber.removeAllListeners("ready");
  subscriber.on("ready", () => {
    console.log("[Redis:Subscriber] Connected");
  });

  subscriber.removeAllListeners("reconnecting");
  subscriber.on("reconnecting", () => {
    console.log("[Redis:Subscriber] Reconnecting...");
  });

  return { publisher, subscriber };
}

/**
 * Connect a client with a timeout.
 * Resolves to `true` on success, `false` on failure/timeout.
 */
function connectWithTimeout(client, label) {
  return new Promise((resolve) => {
    let settled = false;

    const onReady = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(true);
    };

    const onFail = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      // Hard stop: disable reconnect and disconnect
      try {
        client.options.socket.reconnectStrategy = false;
        client.disconnect();
      } catch {}
      resolve(false);
    };

    const timer = setTimeout(() => {
      console.error(`[Redis:${label}] Connection timed out after ${CONNECT_TIMEOUT_MS}ms`);
      onFail();
    }, CONNECT_TIMEOUT_MS);

    client.once("ready", onReady);
    client.once("error", onFail);

    client.connect().catch(() => {
      onFail();
    });
  });
}

export { createPubSubClients, createRedisClient, connectWithTimeout, CHANNEL };
