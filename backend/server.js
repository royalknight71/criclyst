/**
 * Application entry point.
 * Loads environment variables, connects to MongoDB (and optionally Redis),
 * and starts the Express server on the configured PORT.
 */

import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";

const initializeConnection = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

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

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.log("Error", error);
        process.exit(1);
    }
};

initializeConnection();