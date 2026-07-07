import express from "express";
import Player from "../models/player.model.js";
// const player=[
//         {
//             id: 1,
//             name: "Hardik Pandya",
//             role: "All-Rounder"
//         },
//         {
//             id: 2,
//             name: "Jasprit Bumrah",
//             role: "Bowler"
//         },
//         {
//             "id": 18,
//             "name": "Virat Kohli",
//             "runs": 13848
//         },
//         {
//             "id": 45,
//             "name": "Rohit Sharma",
//             "runs": 11168
//         }
// ];

const createPlayer=async (req,res)=>{
    try{
        const player=await Player.create(req.body);
        return res.status(201).json({
            success: true,
            data: player
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getTopPlayers=async (req,res)=>{
    try{
        const ply = await Player.find()
                        .sort({ runs: -1 })
                        .limit(5);
        return res.status(200).json({
            success: true,
            data: ply
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// const getAllPlayers = (req,res)=>{
//     return res.json(player)
// }
// const getPlayerById=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const selectedPlayer=player.find(p=>p.id===id);

//     if(!selectedPlayer)
//     {
//         return res.status(404).json({
//             success: false,
//             message: "Player not found"
//         })
//     }
//     return res.status(200).json({
//         success: true,
//         data: selectedPlayer
//     })
// }

// const updatePlayer = (req,res)=>{
//     const id=parseInt(req.params.id);
//     const ply=player.find(p=>p.id===id);
//     if(!ply)
//     {
//         return res.status(404).json({
//             success: false,
//             message: "Player not found"
//         })
//     }
//     Object.assign(ply, req.body);
//     return res.status(200).json({
//         success: true,
//         message: "Player updated successfully"
//     })
// }


// const searchPlayers=(req,res)=>{
//     const naam=req.query.name;
//     const selectedPlayer=player.filter(p=>p.name.toLowerCase().includes(naam.toLowerCase()));

//     if(selectedPlayer.length===0)
//     {
//         return res.status(404).json({
//             success:false,
//             message:"Player not found"
//         })
//     }
//     return res.status(200).json(selectedPlayer)
// }

// const deletePlayer=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const index=player.findIndex(p=>p.id===id);
//     if(index===-1)
//     {
//         return res.status(404).json({
//             success: false,
//             message: "Player not found"
//         })
//     }
//     player.splice(index, 1);
//     return res.status(200).json({
//         success: true,
//         message: "Player deleted successfully"
//     })
//     }

// const createPlayer=(req,res)=>{
//      player.push(req.body);
//      return res.status(201).json({
//         success: true,
//         message: "Player added successfully",
//      })
// }

export { createPlayer,getTopPlayers};