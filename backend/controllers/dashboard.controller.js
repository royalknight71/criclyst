import mongoose from "mongoose";
import Player from "../models/player.model.js";
import Team from "../models/team.model.js";
import Match from "../models/match.model.js";

export const getAllStats=async (req,res)=>{
    try{
        const [totalPlayers,activePlayers,totalTeams,activeTeams,totalMatches,completedMatches,liveMatches,upcomingMatches]
        =await Promise.all([Player.countDocuments(),
            Player.countDocuments({
            isActive:true
        }),
        Team.countDocuments(),
        Team.countDocuments({
            isActive:true
        }),
        Match.countDocuments(),
        Match.countDocuments({
            status:"completed"
        }),
        Match.countDocuments({
            status:"live"
        }) ,
        Match.countDocuments({
            status:"upcoming"
        }) 
        ])

        return res.status(200).json({
            success:true,
            data:{
                "totalPlayers":totalPlayers,
                "activePlayers":activePlayers,
                "totalTeams":totalTeams,
                "activeTeams":activeTeams,
                "totalMatches":totalMatches,
                "completedMatches":completedMatches,
                "liveMatches":liveMatches,
                "upcomingMatches":upcomingMatches
            }
        })
        
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

export const getLiveMatches=async (req,res)=>{
    try{
        const liveMatches=await Match.find({
            status:"live"
        }).sort({
            matchDate: 1
        }).populate("teamA", "name country captain").populate("teamB", "name country captain")
        .populate("tossWinner", "name country captain").lean()

        const liveMatchesCount=liveMatches.length

        return res.status(200).json({
            success:true,
            "count":liveMatchesCount,
            data:liveMatches
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

export const getRecentMatches=async (req,res)=>{
    try{
        const recentMatches=await Match.find({
            status:"completed"
        }).sort({
            matchDate:-1
        }).limit(5).populate("teamA","name country captain coach").populate("teamB","name country captain coach")
        .populate("tossWinner","name country captain").populate("winner","name country captain").populate(
            "manOfTheMatch",
            "name country role"
        ).lean()

        const recentMatchesCount=recentMatches.length
            return res.status(200).json({
            success:true,
            "count":recentMatchesCount,
            data:recentMatches
        })

    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

export const getUpcomingMatches=async (req,res)=>{
    try{
        const upcomingMatches=await Match.find({
            status:"upcoming"
        }).sort({
            matchDate: 1
        }).limit(5).populate("teamA", "name country captain").populate("teamB", "name country captain").lean()

        const upcomingMatchesCount=upcomingMatches.length

        return res.status(200).json({
            success:true,
            "count":upcomingMatchesCount,
            data:upcomingMatches
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

export const getTopPlayers=async (req,res)=>{
    try{
        const [topRunScorers,topWicketTakers]=await Promise.all([
            Player.find().select("name country role runs wickets matches image").sort({
                "runs":-1,
                matches: 1
            }).limit(5).lean(),
            Player.find().select("name country role runs wickets matches image") 
            .sort({"wickets":-1,
                matches: 1
            }).limit(5).lean()
        ])
        return res.status(200).json({
            success:true,
            data:{
                topRunScorers,
                topWicketTakers
            }
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}