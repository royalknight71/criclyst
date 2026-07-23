import mongoose from "mongoose";
import Match from "../models/match.model.js";
import Team from "../models/team.model.js";
import Player from "../models/player.model.js";
  const populateFields = [
      {
          field: "teamA",
          select: "name country format"
      },
      {
          field: "teamB",
          select: "name country format"
      },
      {
          field: "winner",
          select: "name country format"
      },
      {
          field: "tossWinner",
          select: "name country format"
      },
      {
          field: "manOfTheMatch",
          select: "name role"
      }
  ];


export const getAllMatches = async (req, res) => {
  try {
    //Query Request
    const page=req.query.page ? parseInt(req.query.page):1
    const limit=req.query.limit?parseInt(req.query.limit):5
    const sortBy=req.query.sortBy||"matchDate"
    const order=req.query.order||"desc"
    const selectedFields=req.query.fields

    const filter={...req.query}
    delete filter.page
    delete filter.limit
    delete filter.sortBy
    delete filter.order
    delete filter.fields

    const sortingFields = [
        "matchDate",
        "venue",
        "format",
        "status",
        "createdAt"
    ];

    const selectableFields = [
        "teamA",
        "teamB",
        "winner",
        "venue",
        "matchDate",
        "format",
        "status",
        "tossWinner",
        "tossDecision",
        "result",
        "scorecard",
        "manOfTheMatch",
        "createdAt",
        "updatedAt"
    ];

    const filterableFields=[
        "teamA",
        "teamB",
        "winner",
        "venue",
        "matchDate",
        "format",
        "status",
        "tossWinner",
        "tossDecision",
        "manOfTheMatch"
    ]

    //Validate sortBy
    if(!sortingFields.includes(sortBy))
    {
      return res.status(400).json({
        success: false,
        message: "Invalid Sorting Request",
      })        
    }

    const validOrders=["asc","desc"]
    //Validate order
    if(!validOrders.includes(order))
    {
      return res.status(400).json({
        success: false,
        message: "Invalid Order",
      });        
    }
    const sortValue=order==="asc"?1:-1

    //Validate Page & limit
    if(isNaN(page)||isNaN(limit)||page<=0||limit<=0)
    {
      return res.status(400).json({
        success: false,
        message: "Invalid Page or Limit",
      });
    }

    const isPresent=Object.keys(filter).every((key)=>
    filterableFields.includes(key))
    if(!isPresent)
    {
      return res.status(400).json({
        success: false,
        message: "Invalid Filter Request",
      });        
    }

    //Query selection
    let query=""
    let split=[]
    if(selectedFields)
    {
        split=selectedFields.split(",").map(field => field.trim());
        if(!split.every((field)=>selectableFields.includes(field)))
        {
        return res.status(400).json({
          success: false,
          message: "Invalid field selection",
        });            
        }
        query=split.join(" ")
    }

    //Basic Calulation on finding Page Details
    const startIndex=(page-1)*limit
    const totalMatches=await Match.countDocuments(filter)
    const totalPages=Math.ceil(totalMatches/limit)

    //Validate Page
    if(page > totalPages && totalMatches > 0)
    {
      return res.status(400).json({
        success: false,
        message: "Invalid Page Request",
      });        
    }

    //MongoDB Query
    let mongoQuery= Match.find(filter).sort({
        [sortBy]:sortValue
    })

    if(query){
        mongoQuery = mongoQuery.select(query);
    }
if (selectedFields) {
    for (const item of populateFields) {
        if (split.includes(item.field)) {
            mongoQuery = mongoQuery.populate(item.field, item.select);
        }
    }
} else {
    for (const item of populateFields) {
        mongoQuery = mongoQuery.populate(item.field, item.select);
    }
}
    // if (split.includes("teamA")) {
    //     mongoQuery = mongoQuery.populate("teamA", "name country format");
    // }

    // if (split.includes("teamB")) {
    //     mongoQuery = mongoQuery.populate("teamB", "name country format");
    // }

    // if (split.includes("winner")) {
    //     mongoQuery = mongoQuery.populate("winner", "name country format");
    // }

    // if (split.includes("tossWinner")) {
    //     mongoQuery = mongoQuery.populate("tossWinner", "name");
    // }

    // if (split.includes("manOfTheMatch")) {
    //     mongoQuery = mongoQuery.populate(
    //         "manOfTheMatch",
    //         "name role country"
    //     );
    // }
    const matches = await mongoQuery.skip(startIndex).limit(limit)

    //Pagination
    const pagination={}
    if(page>1)
    {
        pagination.previous={
            page:page-1,
            limit:limit
        }
    }
    if(page<totalPages)
    {
        pagination.next={
            page:page+1,
            limit:limit
        }
    }
    return res.status(200).json({
      success: true,
      page,
      limit,
      totalMatches,
      totalPages,
      pagination,
      data: matches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const id=req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
    {
            return res.status(400).json({
        success: false,
        message: "Invalid Match ID",
      });
    }
  let mongoQuery=Match.findById(id)
  for (const item of populateFields) {
      mongoQuery = mongoQuery.populate(item.field, item.select); 
  }
  const match=await mongoQuery
    if(!match)
    {
        return res.status(404).json({
        success: false,
        message: "Match Not Found",
      });
    }
  return res.status(200).json({
    success:true,
    data:match
  })
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
          message: "Completed Match must have winner and result.",
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
        message: "One or more teams not found.",
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
    const id=req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
    {
            return res.status(400).json({
        success: false,
        message: "Invalid Match ID",
      });
    }
    const match=await Match.findByIdAndDelete(id)
    if(!match)
    {
        return res.status(404).json({
        success: false,
        message: "Match Not Found",
      });
    }
    return res.status(200).json({
        success: true,
        message: "Match deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMatch = async (req, res) => {
  try {
      const id=req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
    {
            return res.status(400).json({
        success: false,
        message: "Invalid Match ID",
      });
    }
    const existingMatch=await Match.findById(id)
    if(!existingMatch)
    {
        return res.status(404).json({
        success: false,
        message: "Match Not Found",
      });
    }
    const teamA = req.body.teamA|| existingMatch.teamA;
    const teamB = req.body.teamB|| existingMatch.teamB;
   // const { status, winner, result, manOfTheMatch } = req.body;
   const status=req.body.status|| existingMatch.status;
   const winner=req.body.winner|| existingMatch.winner;
   const result=req.body.result ?? existingMatch.result;
   const manOfTheMatch=req.body.manOfTheMatch|| existingMatch.manOfTheMatch;
   const date=req.body.matchDate||existingMatch.matchDate
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
        new Date(date) < new Date()
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
          message: "Completed Match must have winner and result.",
        });       
      }
    }


    if(
        status === "completed" &&
        new Date(date) > new Date()
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
    if (teamA.toString === teamB.toString())
      return res.status(400).json({
        success: false,
        message: "Both Teams need to be different",
      });

    const teamAExists = await Team.findById(teamA);
    const teamBExists = await Team.findById(teamB);
    if (!teamAExists || !teamBExists) {
      return res.status(400).json({
        success: false,
        message: "One or more teams not found.",
      });
    }

      if (teamAExists.format !== teamBExists.format) {
      return res.status(400).json({
          success: false,
          message: "Both teams must have the same format."
      });
  }
  const format = req.body.format || existingMatch.format;
  if (teamAExists.format !== format) {
    return res.status(400).json({
        success: false,
        message: "Match format must match the teams' format."
    });
}

    const tossWinner = req.body.tossWinner || existingMatch.tossWinner;

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
    const match=await Match.findByIdAndUpdate(id,req.body,{
      new:true,
      runValidations:true
    })
    return res.status(200).json({
      success:true,
      data:match
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
