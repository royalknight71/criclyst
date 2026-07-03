import express from "express";

const router=express.Router();

router.get("/",(req,res)=>{
    res.json([
        {
            id: 1,
            name: "Virat Kohli",
            role: "Batsman"
        },
        {
            id: 2,
            name: "Jasprit Bumrah",
            role: "Bowler"
        }
    ])
})

export default router;