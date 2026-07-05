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
    return res.json(player)
})

router.post("/",(req,res)=>{
     player.push(req.body);
     return res.status(201).json({
        success: true,
        message: "Player added successfully",
     })
})

router.get("/top",(req,res)=>{
    return res.json(player)
})

router.get("/search",(req,res)=>{
    const naam=req.query.name;
    const selectedPlayer=player.filter(p=>p.name.toLowerCase().includes(naam.toLowerCase()));

    if(selectedPlayer.length===0)
    {
        return res.status(404).json({
            success: false,
            message: "Player not found"
        })
    }
    return res.status(200).json(selectedPlayer)
})

// router.put("/",(req,res)=>{
//     const id=(req.body.id);
//     const ply=player.find(p=>p.id===id);
//     if(!ply)
//     {
//         return res.status(404).json({
//             success: false,
//             message: "Player not found"
//         })
//     }
//     // if(req.body.name)
//     //     ply.name=req.body.name;
//     // if(req.body.role)
//     //     ply.role=req.body.role;
//     // if(req.body.runs)
//     //     ply.runs=req.body.runs;
//     Object.assign(ply, req.body);
//     res.status(200).json({
//         success: true,
//         message: "Player updated successfully"
//     })
// })

router.put("/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const ply=player.find(p=>p.id===id);
    if(!ply)
    {
        return res.status(404).json({
            success: false,
            message: "Player not found"
        })
    }
    Object.assign(ply, req.body);
    return res.status(200).json({
        success: true,
        message: "Player updated successfully"
    })
})

    router.delete("/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const index=player.findIndex(p=>p.id===id);
    if(index===-1)
    {
        return res.status(404).json({
            success: false,
            message: "Player not found"
        })
    }
    player.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: "Player deleted successfully"
    })
    })

router.get("/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const selectedPlayer=player.find(p=>p.id===id);

    if(!selectedPlayer)
    {
        return res.status(404).json({
            success: false,
            message: "Player not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: selectedPlayer
    })
})

export default router;