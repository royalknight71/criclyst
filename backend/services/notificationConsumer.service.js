/**
 * Notification consumer service.
 *
 * Subscribes to the existing Redis Pub/Sub "cricket:live" channel,
 * detects meaningful events via notificationEventDetection, finds
 * affected users via MatchSubscription, persists notifications to
 * MongoDB, and delivers them via Socket.IO user rooms.
 *
 * Independent from the existing Socket.IO live-score consumer.
 * Does NOT make any additional CricAPI calls.
 */

import { subscribeToLiveUpdates, isRedisAvailable } from "./redisPubSub.service.js";
import { detectEvents } from "./notificationEventDetection.service.js";
import Notification from "../models/notification.model.js";
import MatchSubscription from "../models/matchSubscription.model.js";
import { deliverNotification, deliverBulkNotifications } from "./notificationDelivery.service.js";

let unsubscribe = null;

async function processMatchEvents(match) {
  try {
    const events = detectEvents(match);
    if (events.length === 0) return;

    const matchId = match.id;

    // Find all users subscribed to this match
    const subscriptions = await MatchSubscription.find({ cricApiMatchId: matchId }).select("userId").lean();
    if (subscriptions.length === 0) return;

    const userIds = subscriptions.map((s) => s.userId.toString());

    for (const event of events) {
      // Deduplication: check if a notification with this dedup key already exists recently
      const existing = await Notification.findOne({
        userId: { $in: userIds },
        cricApiMatchId: matchId,
        eventType: event.eventType,
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // 1 hour window
      }).select("_id").lean();

      if (existing) continue;

      // Create notifications for each subscribed user
      const notificationDocs = userIds.map((userId) => ({
        userId,
        cricApiMatchId: matchId,
        eventType: event.eventType,
        title: event.title,
        message: event.message,
        metadata: event.metadata,
      }));

      const saved = await Notification.insertMany(notificationDocs, { ordered: false }).catch(() => []);

      // Deliver via Socket.IO to each user
      for (const doc of saved) {
        deliverNotification(doc.userId.toString(), {
          _id: doc._id,
          cricApiMatchId: doc.cricApiMatchId,
          eventType: doc.eventType,
          title: doc.title,
          message: doc.message,
          metadata: doc.metadata,
          read: doc.read,
          createdAt: doc.createdAt,
        });
      }
    }
  } catch (err) {
    console.error("[NotificationConsumer] Error processing match events:", err.message);
  }
}

function startNotificationConsumer() {
  if (unsubscribe) return;

  unsubscribe = subscribeToLiveUpdates((liveMatches) => {
    if (!Array.isArray(liveMatches)) return;

    for (const match of liveMatches) {
      processMatchEvents(match).catch((err) => {
        console.error("[NotificationConsumer] Unhandled error:", err.message);
      });
    }
  });

  console.log("[NotificationConsumer] Started — listening to live updates");
}

function stopNotificationConsumer() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  console.log("[NotificationConsumer] Stopped");
}

export { startNotificationConsumer, stopNotificationConsumer };
