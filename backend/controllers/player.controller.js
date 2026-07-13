import Player from "../models/player.model.js";
import mongoose from "mongoose";

export const createPlayer=async (req,res)=>{
    try{
        const existingPlayer = await Player.findOne({
            name: req.body.name
        });

        if(existingPlayer){
            return res.status(400).json({
                success:false,
                message:"Player already exists"
            });
        }

        const player = await Player.create(req.body);
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

export const getTopPlayers=async (req,res)=>{
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

export const getAllPlayers =async (req,res)=>{
    try{
        const players=await Player.find();
        return res.status(200).json({
            success: true,
            data: players
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getPlayerById = async (req,res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) 
            {
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }

        return res.status(200).json({
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

export const countPlayers = async(req,res)=>{
    try {
        const count=await Player.countDocuments();
        return res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
}}

export const updatePlayer=async (req,res)=>{
    try{
        const player=await Player.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
        })
        if(!player)
        {
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }
        return res.json({
            success:true,
            data:player
            });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
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


export const searchPlayers=async (req,res)=>{
    try{
        const filter={}
        const name=req.query.name
        const country=req.query.country
        const role=req.query.role
        const team=req.query.team
        if(name){
            filter.name={$regex:name,$options:"i"}
        }
        if(country){
            filter.country={$regex:country,$options:"i"} 
        }
        if(role){
            filter.role={$regex:role,$options:"i"}
        }
        if(team){
            filter.team={$regex:team,$options:"i"}
        }
        const players=await Player.find(filter)
        if(players.length===0)
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
            return res.status(200).json(player)
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const deletePlayer=async (req, res)=>{
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Player deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const searchPlayersById=async (req,res)=>{
    try{
        const id=req.params.id
        const check=mongoose.Types.ObjectId.isValid(id)
        if(!check){
            return res.status(400).json({
                success: false,
                message: "Invalid Player ID"
            });
        }
        const player=await Player.findById(id)

        if(!player){
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: player
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deletePlayersById=async (req,res)=>{
    try{
        const id=req.params.id;

        const check=mongoose.Types.ObjectId.isValid(id)
        if(!check){
            return res.status(400).json({
                success: false,
                message: "Invalid Player ID"
            });
        }

        const player=await Player.findByIdAndDelete(id)
        if(!player){
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Player deleted successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });        
    }
}
export const updatePlayersById=async (req,res)=>{
    try{
        const id=req.params.id
        const check=mongoose.Types.ObjectId.isValid(id)
        if(!check){
            return res.status(400).json({
                success: false,
                message: "Player not found"
            });
        }     
        const player=await Player.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        })
                if(!player){
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }
        return res.status(200).json({
            success:true,
            data:player
            })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });          
    }
}