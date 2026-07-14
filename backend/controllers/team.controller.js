import Team from "../models/team.model";
import mongoose from "mongoose";

export const getAllTeams=async (req,res)=>{
    try{
        const teams=await Team.find()
        return res.status(200).json({
            success:true,
            data:teams
        })
    }
    catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });        
    }
}

export const getTeamsById=async (req,res)=>{
    try{
        const id=req.params.id
        const check = mongoose.Types.ObjectId.isValid(id);
        if (!check) {
        return res.status(400).json({
            success: false,
            message: "Invalid Team ID",
        });
        }
        const team=await Team.findById(id)
        if(!team)
        {
            return res.status(404).json({
                success:false,
                message:"Team Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            data:team
        })
    }
    catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });        
    }
}

export const createTeam=async (req,res)=>{
    try{
        const existingTeam=await Team.findOne({
            name:req.body.name
        })
        if(existingTeam)
        {
            return res.status(400).json({
                success: false,
                message: "Team already exists",
            });            
        }
        const team=await Team.create(req.body)
        return res.status(201).json({
            success:true,
            data:team
        })
    }
    catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });        
    }
}

export const updateTeam=async (req,res)=>{
    try{
        const id=req.params.id
        const check = mongoose.Types.ObjectId.isValid(id);
        if (!check) {
        return res.status(400).json({
            success: false,
            message: "Invalid Team ID",
        });
        }        
        const team=await Team.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidations:true
        })
        if (!team) {
        return res.status(404).json({
            success: false,
            message: "Team not found",
        });
        }
        return res.status(200).json({
        success: true,
        data: team,
        });        

    }
    catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });        
    }
}

export const deleteTeam=async (req,res)=>{
    try{
        const id=req.params.id
        const check = mongoose.Types.ObjectId.isValid(id);
        if (!check) {
        return res.status(400).json({
            success: false,
            message: "Invalid Team ID",
        });
        }
        const team=await Team.findByIdAndDelete(id)
        if(!team)
        {
            return res.status(404).json({
                success:false,
                message:"Team Not Found"
            })
        }
    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });

    }
    catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });        
    }
}