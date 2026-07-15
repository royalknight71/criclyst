import Team from "../models/team.model.js";
import mongoose from "mongoose";
import Player from "../models/player.model.js";

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players", "name role country");
    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeamsById = async (req, res) => {
  try {
    const id = req.params.id;
    const check = mongoose.Types.ObjectId.isValid(id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Invalid Team ID",
      });
    }
    const team = await Team.findById(id).populate(
      "players",
      "name role country",
    );
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTeam = async (req, res) => {
  try {
    const existingTeam = await Team.findOne({
      name: req.body.name,
    });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Team already exists",
      });
    }
    const players = req.body.players;
    
    if (players && !Array.isArray(players)) {
        return res.status(400).json({
            success: false,
            message: "Players must be an array"
        });
    }

    for (const id of players) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Player ID",
        });
      }
      const player = await Player.findById(id);

      if (!player) {
        return res.status(400).json({
          success: false,
          message: "One or more players not found",
        });
      }
    }

    //         let idCheck=true
    //         for(let i=0;i<players.length;i++)
    //         {
    //             let id=players[i]
    //             const idExists=await Player.findById(id)
    //             if(!idExists)
    //             {
    //                 idCheck=false;
    //                 break;
    //             }

    //         }
    //         if(!idCheck)
    //         {
    //             return res.status(400).json({
    //     "success": false,
    //     "message": "One or more players not found"
    // })
    //         }
    const team = await Team.create(req.body);
    return res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const check = mongoose.Types.ObjectId.isValid(id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Invalid Team ID",
      });
    }
    
    const players = req.body.players;

    if(players)
    {
    if(!Array.isArray(players)) {
        return res.status(400).json({
            success: false,
            message: "Players must be an array"
        });
    }

    for (const playerId of players) {
      if (!mongoose.Types.ObjectId.isValid(playerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Player ID",
        });
      }
      const player = await Player.findById(playerId);

      if (!player) {
        return res.status(400).json({
          success: false,
          message: "One or more players not found",
        });
      }
    }
}
    const team = await Team.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidations: true,
    });
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const check = mongoose.Types.ObjectId.isValid(id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Invalid Team ID",
      });
    }
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
