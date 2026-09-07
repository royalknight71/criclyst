/**
 * Redis Pub/Sub service for live-score event distribution.
 *
 * Provides:
 *   - publishLiveUpdates(matches) — publish live match data to Redis
 *   - subscribeToLiveUpdates(handler) — register a callback for incoming events
 *   - initPubSub() / shutdownPubSub() — lifecycle management
 *
 * Falls back to in-process EventEmitter when Redis is unavailable, so the
 * existing Socket.IO delivery continues working without interruption.
 */

import { EventEmitter } from "node:events";
import { createPubSubClients, connectWithTimeout, CHANNEL } from "../config/redis-pubsub.js";

let publisher = null;
let subscriber = null;
let redisAvailable = false;
let fallbackEmitter = new EventEmitter();
fallbackEmitter.setMaxListeners(20);

/**
 * Publish a live-score update to Redis.
 *
 * @param {Array<Object>} liveMatches — array of normalized live match objects
 */
export function publishLiveUpdates(liveMatches) {
  if (!Array.isArray(liveMatches)) return;

  const message = JSON.stringify({
    type: "SCORE_UPDATE",
    data: liveMatches,
    timestamp: new Date().toISOString(),
  });

  if (redisAvailable && publisher && publisher.isReady) {
    publisher.publish(CHANNEL, message).catch((err) => {
      console.error("[Redis:PubSub] Publish failed:", err.message);
    });
    return;
  }

  // Fallback: deliver via in-process EventEmitter
  fallbackEmitter.emit(CHANNEL, liveMatches);
}

/**
 * Register a handler that receives live-match updates.
 *
 * The handler receives the parsed array of live match objects.
 *
 * @param {(liveMatches: Array<Object>) => void} handler
 * @returns {Function} unsubscribe function
 */
export function subscribeToLiveUpdates(handler) {
  // Always subscribe to the fallback (covers Redis-down scenario)
  fallbackEmitter.on(CHANNEL, handler);

  // Also subscribe to Redis if available — but avoid double-delivery
  // by tracking which messages we've already delivered via fallback
  let lastRedisMessage = null;

  if (redisAvailable && subscriber && subscriber.isReady) {
    const redisHandler = (rawMessage) => {
      try {
        const parsed = JSON.parse(rawMessage);
        if (parsed.type === "SCORE_UPDATE" && Array.isArray(parsed.data)) {
          // Avoid duplicate delivery if fallback already emitted this batch
          if (lastRedisMessage !== rawMessage) {
            lastRedisMessage = rawMessage;
            handler(parsed.data);
          }
        }
      } catch (err) {
        console.error("[Redis:PubSub] Invalid message received:", err.message);
      }
    };

    subscriber.subscribe(CHANNEL, redisHandler, { pattern: false }).catch((err) => {
      console.error("[Redis:PubSub] Subscribe failed:", err.message);
    });

    return () => {
      fallbackEmitter.off(CHANNEL, handler);
      subscriber.unsubscribe(CHANNEL).catch(() => {});
    };
  }

  return () => {
    fallbackEmitter.off(CHANNEL, handler);
  };
}

/**
 * Initialize Redis Pub/Sub connections.
 *
 * @returns {{ publisher: boolean, subscriber: boolean }} connection status
 */
export async function initPubSub() {
  try {
    const clients = createPubSubClients();
    publisher = clients.publisher;
    subscriber = clients.subscriber;

    // Connect with timeout — don't block startup if Redis is unreachable
    const [pubOk, subOk] = await Promise.all([
      connectWithTimeout(publisher, "Publisher"),
      connectWithTimeout(subscriber, "Subscriber"),
    ]);

    if (!pubOk || !subOk) {
      console.warn("[Redis:PubSub] One or both connections failed — using fallback");
      // Hard stop: disable reconnect on both clients
      try {
        publisher.options.socket.reconnectStrategy = false;
        publisher.disconnect();
      } catch {}
      try {
        subscriber.options.socket.reconnectStrategy = false;
        subscriber.disconnect();
      } catch {}
      publisher = null;
      subscriber = null;
      redisAvailable = false;
      return { publisher: false, subscriber: false };
    }

    redisAvailable = true;

    // Subscribe to the channel
    await subscriber.subscribe(CHANNEL, (rawMessage) => {
      try {
        const parsed = JSON.parse(rawMessage);
        if (parsed.type === "SCORE_UPDATE" && Array.isArray(parsed.data)) {
          console.log(
            `[Redis:PubSub] Received SCORE_UPDATE — ${parsed.data.length} matches`
          );
          // Re-emit on fallbackEmitter so all subscribers (including Socket.IO) get it
          fallbackEmitter.emit(CHANNEL, parsed.data);
        }
      } catch (err) {
        console.error("[Redis:PubSub] Invalid message received:", err.message);
      }
    });

    console.log(`[Redis:PubSub] Subscribed to channel: ${CHANNEL}`);
    return { publisher: true, subscriber: true };
  } catch (err) {
    console.error("[Redis:PubSub] Initialization failed:", err.message);
    console.warn("[Redis:PubSub] Falling back to in-process EventEmitter");
    redisAvailable = false;
    publisher = null;
    subscriber = null;
    return { publisher: false, subscriber: false };
  }
}

/**
 * Gracefully shut down Redis connections.
 */
export async function shutdownPubSub() {
  try {
    if (subscriber) {
      await subscriber.unsubscribe(CHANNEL).catch(() => {});
      await subscriber.disconnect().catch(() => {});
      console.log("[Redis:PubSub] Subscriber disconnected");
    }
  } catch (err) {
    console.error("[Redis:PubSub] Subscriber shutdown error:", err.message);
  }

  try {
    if (publisher) {
      await publisher.disconnect().catch(() => {});
      console.log("[Redis:PubSub] Publisher disconnected");
    }
  } catch (err) {
    console.error("[Redis:PubSub] Publisher shutdown error:", err.message);
  }

  publisher = null;
  subscriber = null;
  redisAvailable = false;
}

/**
 * Check if Redis Pub/Sub is currently available.
 */
export function isRedisAvailable() {
  return redisAvailable;
}

/**
 * Get the fallback emitter (for in-process use when Redis is down).
 */
export function getFallbackEmitter() {
  return fallbackEmitter;
}
