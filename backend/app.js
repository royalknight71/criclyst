import express from 'express';
import playerRoutes from './routes/player.routes.js';
const app=express();

app.use("/api/players",playerRoutes);

app.get("/",(req,res)=>{
    res.send("Welcome to Criclyst API 🚀")
})

app.get("/api/health",(req,res)=>{
    res.json({status:"ok",
        message: "Criclyst Backend Running"
    })
})
export default app;