import express from "express";
import {createPlayer,getTopPlayers,getAllPlayers,getPlayerById,countPlayers,updatePlayer,
    deletePlayer,searchPlayers,searchPlayersById,deletePlayersById,updatePlayersById} from "../controllers/player.controller.js";
const router=express.Router();

router.get("/",getAllPlayers);

router.post("/",createPlayer);

router.get("/top",getTopPlayers);
router.get("/count",countPlayers);
router.get("/search",searchPlayers);
router.get("/:id",searchPlayersById)
router.delete("/:id",deletePlayersById)
router.patch("/:id",updatePlayersById)
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

router.put("/:id",updatePlayer);

router.delete("/:id",deletePlayer)

router.get("/:id",getPlayerById);

export default router;