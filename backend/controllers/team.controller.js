import Team from "../models/team.model.js";
import mongoose from "mongoose";
import Player from "../models/player.model.js";

export const getAllTeams = async (req, res) => {
  try {
    //Query Request
    const page=req.query.page ? parseInt(req.query.page):1
    const limit=req.query.limit?parseInt(req.query.limit):5
    const sortBy=req.query.sortBy||"name"
    const order=req.query.order||"asc"
    const selectedFields=req.query.fields

    const filter={...req.query}
    delete filter.page
    delete filter.limit
    delete filter.sortBy
    delete filter.order
    delete filter.fields

    const sortingFields=[
        "name",
        "country",
        "format",
        "ranking",
        "founded"
    ]

        const selectableFields=[
        "name",
        "country",
        "format",
        "ranking",
        "founded",
        "captain",
        "coach",
        "players",
        "description"
    ]

    const filterableFields=[
        "name",
        "country",
        "format",
        "ranking",
        "founded",
        "captain",
        "coach",
        "isActive"
    ]

    // Handle advanced filtering
    const operatorMap = {
      gt: "$gt",
      gte: "$gte",
      lt: "$lt",
      lte: "$lte",
    };
    const numericFields = ["ranking","founded"];
    let openBracketIndex = -1;
    let closeBracketIndex = -1;
    for (const key in filter) {
        openBracketIndex=key.indexOf('[')
        closeBracketIndex=key.indexOf(']')
        if(openBracketIndex===-1&&closeBracketIndex===-1)
            continue;

        const field=key.slice(0,openBracketIndex)
        const operator=key.slice(openBracketIndex+1,closeBracketIndex)

      if (!numericFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: "Advanced filtering is allowed only on numeric fields.",
        });
      }

      //Validate Operators
      if (!(operator in operatorMap)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Operator",
        });
      }
      const value=Number(filter[key])
      if(isNaN(value))
        {
            return res.status(400).json({
            success: false,
            message: "Invalid numeric value.",
            });
        }     
        
        delete filter[key]

        filter[field]={
            [operatorMap[operator]]:value
        }
        
        
    }

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
        split=selectedFields.split(",")
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
    const totalTeams=await Team.countDocuments(filter)
    const totalPages=Math.ceil(totalTeams/limit)

    //Validate Page
    if(page > totalPages && totalTeams > 0)
    {
      return res.status(400).json({
        success: false,
        message: "Invalid Page Request",
      });        
    }

    //MongoDB Query
    let mongoQuery= Team.find(filter).sort({
        [sortBy]:sortValue
    })

    if(query){
        mongoQuery = mongoQuery.select(query);
    }
    if(split.includes("players"))
    {
        mongoQuery = mongoQuery.populate(
            "players",
            "name role country"
        );
    }
    const teams = await mongoQuery.skip(startIndex).limit(limit)

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
      totalTeams,
      totalPages,
      pagination,
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
          country: req.body.country,
        format: req.body.format
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
