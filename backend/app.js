/**
 * Express application setup for the Criclyst API.
 * Configures global middleware (cookies, CORS, JSON parsing, request logging)
 * and mounts all resource routers under the /api namespace.
 */
import express from 'express';
import playerRoutes from './routes/player.routes.js';
import userRoutes from './routes/user.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import teamRoute from './routes/team.routes.js';
import matchRoute from './routes/match.routes.js'
import dashboardRoute from './routes/dashboard.routes.js'
import logger from './middleware/logger.middleware.js';
import cookieParser from 'cookie-parser';
import rateLimiter from './middleware/rateLimiter.js';
import cors from "cors";

const app=express();
app.use(cookieParser());
//app.use(rateLimiter)
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://criclyst.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());
app.use(logger);

app.use("/api/users/favorites", favoriteRoutes);
app.use("/api/users",userRoutes);

app.use("/api/players",playerRoutes);

app.use("/api/teams",teamRoute)

app.use("/api/matches",matchRoute)

app.use("/api/dashboard",dashboardRoute)

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