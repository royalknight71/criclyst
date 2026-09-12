/**
 * Application entry point.
 * Loads environment variables, connects to MongoDB, optionally initializes
 * Redis (for token blacklisting) and Redis Pub/Sub (for live-score event
 * distribution), then starts the Express server with Socket.IO and cricket
 * polling.
 */

import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";
import * as cricketPolling from "./services/cricketPolling.service.js";
import { initSocket } from "./config/socket.js";
import { initPubSub, shutdownPubSub } from "./services/redisPubSub.service.js";
import { startNotificationConsumer, stopNotificationConsumer } from "./services/notificationConsumer.service.js";

const initializeConnection = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        // --- Redis (legacy: token blacklisting, rate limiting) ---
        if (process.env.REDIS_ENABLED === "true") {
            try {
                await redisClient.connect();
                console.log("Connected to Redis");
            }
            catch (redisError) {
                console.warn(
                    "Redis unavailable — logout blacklisting disabled:",
                    redisError.message
                );
            }
        } else {
            console.log("Redis disabled in development");
        }

        // --- Redis Pub/Sub (live-score event distribution) ---
        const pubSubStatus = await initPubSub();
        if (pubSubStatus.publisher && pubSubStatus.subscriber) {
            console.log("Redis Pub/Sub layer active");
        } else {
            console.warn("Redis Pub/Sub unavailable — using in-process EventEmitter fallback");
        }

        const PORT = process.env.PORT || 3000;

        const httpServer = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            initSocket(httpServer);
            cricketPolling.start();
            startNotificationConsumer();
        });

process.on("SIGINT", async () => {
    cricketPolling.stop();
    stopNotificationConsumer();
    await shutdownPubSub();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    cricketPolling.stop();
    stopNotificationConsumer();
    await shutdownPubSub();
    process.exit(0);
});
    }
    catch (error) {
        console.log("Error", error);
        process.exit(1);
    }
};

initializeConnection();
