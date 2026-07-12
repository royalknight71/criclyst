import express from 'express';
import playerRoutes from './routes/player.routes.js';
import userRoutes from './routes/user.routes.js';
import logger from './middleware/logger.middleware.js';
import cookieParser from 'cookie-parser';

const app=express();

app.use(cookieParser());

app.use(express.json());

app.use(logger);

app.use("/api/players",playerRoutes);

app.use("/api/users",userRoutes);

// app.get("/api/test",async(req,res)=>{
//     try{
//         await redisClient.set("name","Krish")
//         const value=await redisClient.get("name");

//         return res.status(200).json({
//             success: true,
//             data: value
//         });
//     }
//     catch(error){
//             return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// })

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to Criclyst API")
})



app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"ok",
        message: "Criclyst Backend Running"
    })
})

app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    })
})

export default app;