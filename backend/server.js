/**
 * Application entry point.
 * Loads environment variables, connects to MongoDB (and optionally Redis),
 * and starts the Express server on the configured PORT.
 */
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
//import redisClient from "./config/redis.js";


/**
 * Establishes the database connection and starts the HTTP server.
 * Exits via the catch block (logging the error) if initialization fails.
 */
const initializeConnection=async ()=>{
  try{
    // await redisClient.connect()
    // console.log("Connected to Redis");

    // await connectDB()

    //await Promise.all([redisClient.connect(),connectDB()])
    await connectDB()
    console.log("Connected to DB");
    
    
    app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 3000');
})
  }
  catch(error){
    console.log("Error",error);
    
  }
}

initializeConnection()