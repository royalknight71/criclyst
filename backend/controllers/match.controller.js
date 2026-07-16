import mongoose from "mongoose";
import Match from "../models/match.model.js";
import Team from "../models/team.model.js";
import Player from "../models/player.model.js";

export const getAllMatches = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMatchById = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createMatch = async (req, res) => {
  try {
    const teamA = req.body.teamA;
    const teamB = req.body.teamB;
    const { status, winner, result, manOfTheMatch } = req.body;
    if(status==="upcoming")
    {
      if(winner||manOfTheMatch||result)
      {
        return res.status(400).json({
          success: false,
          message: "Upcoming matches cannot have winner, result or Man of the Match.",
        });       
      }
    }
    if(
        status === "upcoming" &&
        new Date(req.body.matchDate) < new Date()
    ) 
    {
        return res.status(400).json({
            success: false,
            message: "Upcoming match date cannot be in the past."
        });
    }
    if(status==="completed")
    {
      if(!winner||!result)
      {
        return res.status(400).json({
          success: false,
          message: "Completed Match should have winner, result or Man of the Match.",
        });       
      }
    }

    
    if(
        status === "completed" &&
        new Date(req.body.matchDate) > new Date()
    ) 
    {
        return res.status(400).json({
            success: false,
            message: "Completed match date cannot be in the future."
        });
    }
    if (status === "live") {
    if (winner || manOfTheMatch) {
        return res.status(400).json({
            success: false,
            message: "Live matches cannot have winner or Man of the Match."
        });
    }
}
    if (
      !mongoose.Types.ObjectId.isValid(teamA) ||
      !mongoose.Types.ObjectId.isValid(teamB)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Team ID",
      });
    }
    if (teamA === teamB)
      return res.status(400).json({
        success: false,
        message: "Both Teams need to be different",
      });

    const teamAExists = await Team.findById(teamA);
    const teamBExists = await Team.findById(teamB);
    if (!teamAExists || !teamBExists) {
      return res.status(400).json({
        success: false,
        message: "Team does not exists",
      });
    }

      if (teamAExists.format !== teamBExists.format) {
      return res.status(400).json({
          success: false,
          message: "Both teams must have the same format."
      });
  }
  if (teamAExists.format !== req.body.format) {
    return res.status(400).json({
        success: false,
        message: "Match format must match the teams' format."
    });
}

    const tossWinner = req.body.tossWinner;

    if (!mongoose.Types.ObjectId.isValid(tossWinner)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Toss Winner Id",
      });
    }
    const tossWinnerExists = await Team.findById(tossWinner);
    if (!tossWinnerExists) {
      return res.status(400).json({
        success: false,
        message: "Toss Winner Does Not Exists",
      });
    }
    if (
      tossWinner.toString() !== teamA.toString() &&
      tossWinner.toString() !== teamB.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Toss Winner should be Team A or Team B",
      });
    }
  //  const winner = req.body.winner;
    if (winner) {
      if (!mongoose.Types.ObjectId.isValid(winner)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Winner Id",
        });
      }
      const winnerExists = await Team.findById(winner);
      if (!winnerExists) {
        return res.status(400).json({
          success: false,
          message: "Winner Does Not Exists",
        });
      }
      if (
        winner.toString() !== teamA.toString() &&
        winner.toString() !== teamB.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Winner should be Team A or Team B",
        });
      }
    }
  //  const manOfTheMatch = req.body.manOfTheMatch;
    if (manOfTheMatch) {
      if (!mongoose.Types.ObjectId.isValid(manOfTheMatch)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Man Of The Match Id",
        });
      }
      const manOfTheMatchExists = await Player.findById(manOfTheMatch);
      if (!manOfTheMatchExists) {
        return res.status(400).json({
          success: false,
          message: "Player Does Not Exists",
        });
      }
      const allPlayers = [...teamAExists.players, ...teamBExists.players];

      const validPlayer = allPlayers.some(
        (id) => id.toString() === manOfTheMatch.toString(),
      );

      if (!validPlayer) {
        return res.status(400).json({
          success: false,
          message: "Man of the Match should belong to Team A or Team B",
        });
      }
    }
    const match = await Match.create(req.body);
    return res.status(201).json({
      success: true,
      data: match,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMatch = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMatch = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
