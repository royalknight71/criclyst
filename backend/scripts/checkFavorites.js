import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

async function checkDB() {
    try {
        await connectDB();
        console.log("Connected to DB");
        const users = await User.find({}).select("favorites");
        users.forEach(u => console.log(u._id.toString(), JSON.stringify(u.favorites)));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await import("mongoose").then(m => m.default.disconnect());
        console.log("Disconnected from DB");
    }
}

checkDB();