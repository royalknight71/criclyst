/**
 * MongoDB connection configuration.
 * Establishes the Mongoose connection using the MONGO_URI environment variable.
 */
import mongoose from "mongoose";

/**
 * Connects to MongoDB via Mongoose.
 * Terminates the process with exit code 1 if the connection fails.
 * @returns {Promise<void>} Resolves when the connection is established.
 */
async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        dbName: "criclystDB",
    });
}

export default connectDB;