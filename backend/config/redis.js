/**
 * Redis client configuration.
 * Redis is optional in development.
 */

import { createClient } from "redis";

const redisEnabled = process.env.REDIS_ENABLED === "true";

const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        reconnectStrategy: false
    }
});

redisClient.on("error", (err) => {
    console.log("Redis error:", err.message);
});

export default redisClient;