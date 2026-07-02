import express from 'express';
const app=express();

app.get("/",(req,res)=>{
    res.send("Welcome to Criclyst API 🚀")
})

app.get("/api/health",(req,res)=>{
    res.json({status:"ok",
        message: "Criclyst Backend Running"
    })
})
export default app;