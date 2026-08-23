/**
 * Redis client configuration.
 * Creates and exports a shared Redis client used for session blocking
 * (logout) and rate limiting. Connection details come from environment
 * variables and hardcoded socket settings.
 */
import {createClient } from "redis"

/** Shared Redis client instance for caching, token blacklisting, and rate limiting. */
const redisClient=createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'engine-nacreous-summer-96498.db.redis.io',
        port: 11015
    }
})
redisClient.on("error", (err) => {
    console.log(err);
});

export default redisClient;