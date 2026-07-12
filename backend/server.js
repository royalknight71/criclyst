import app from './app.js';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import redisClient from './config/redis.js';

dotenv.config();

const initializeConnection=async ()=>{
  try{
    // await redisClient.connect()
    // console.log("Connected to Redis");

    // await connectDB()

    await Promise.all([redisClient.connect(),connectDB()])
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