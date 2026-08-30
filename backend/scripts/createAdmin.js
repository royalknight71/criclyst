/**
 * Admin bootstrap script.
 * Promotes an existing user to admin role using ADMIN_EMAIL environment variable.
 * Usage: ADMIN_EMAIL=admin@example.com node backend/scripts/createAdmin.js
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import connectDB from "../config/db.js";
import User from "../models/user.model.js";

async function createAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            console.error("Error: ADMIN_EMAIL environment variable is required");
            console.error("Usage: ADMIN_EMAIL=admin@example.com node backend/scripts/createAdmin.js");
            process.exit(1);
        }

        const normalizedEmail = adminEmail.toLowerCase().trim();

        await connectDB();
        console.log("Connected to DB");

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.error(`Error: User with email "${normalizedEmail}" not found`);
            console.error("Please register the user first, then run this script again.");
            process.exit(1);
        }

        if (user.role === "admin") {
            console.log(`User "${normalizedEmail}" is already an admin`);
            process.exit(0);
        }

        user.role = "admin";
        await user.save();

        console.log(`Successfully promoted "${normalizedEmail}" to admin role`);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    } finally {
        await import("mongoose").then(m => m.default.disconnect());
        console.log("Disconnected from DB");
    }
}

createAdmin();