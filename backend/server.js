import app from './app.js';
import connectDB from './config/db.js';
import dotenv from "dotenv";

dotenv.config();

connectDB()
.then(()=>{
  //  console.log('Database connected successfully');
    app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 3000');
})
})
.catch((error)=>{
    console.error('Database connection error:',error);
    process.exit(1);
})