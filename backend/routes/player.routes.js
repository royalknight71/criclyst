import express from "express";

const router=express.Router();

const player=[
        {
            id: 1,
            name: "Hardik Pandya",
            role: "All-Rounder"
        },
        {
            id: 2,
            name: "Jasprit Bumrah",
            role: "Bowler"
        },
        {
            "id": 18,
            "name": "Virat Kohli",
            "runs": 13848
        },
        {
            "id": 45,
            "name": "Rohit Sharma",
            "runs": 11168
        }
            ];

router.get("/",(req,res)=>{
    res.json(player)
})
router.get("/top",(req,res)=>{
    res.json(player)
})

router.get("/search",(req,res)=>{
    const naam=req.query.name;
    const selectedPlayer=player.filter(p=>p.name.toLowerCase().includes(naam.toLowerCase()));
    res.json(selectedPlayer)
})

router.get("/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const selectedPlayer=player.find(p=>p.id===id);
    res.json(selectedPlayer)
})

export default router;