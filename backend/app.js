import express from 'express';
import playerRoutes from './routes/player.routes.js';
import topPlayerRoutes from './routes/topPlayer.routes.js';
import logger from './middleware/logger.middleware.js';
const app=express();


app.use(logger);

app.use("/api/players",playerRoutes);


app.get("/",(req,res)=>{
    res.send("Welcome to Criclyst API")
})


app.get("/api/health",(req,res)=>{
    res.json({status:"ok",
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