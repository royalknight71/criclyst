import Player from "../models/player.model.js";
import mongoose from "mongoose";

export const createPlayer = async (req, res) => {
  try {
    const existingPlayer = await Player.findOne({
      name: req.body.name,
    });

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: "Player already exists",
      });
    }

    const player = await Player.create(req.body);
    return res.status(201).json({
      success: true,
      data: player,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTopPlayers = async (req, res) => {
  try {
    const ply = await Player.find().sort({ runs: -1 }).limit(5);
    return res.status(200).json({
      success: true,
      data: ply,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPlayers = async (req, res) => {
  try {
    // Read query parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sortBy = req.query.sortBy || "name";
    const order = req.query.order || "asc";
    const selectedFields = req.query.fields;

    // Build filter object
    const filter = { ...req.query };
    delete filter.page;
    delete filter.limit;
    delete filter.sortBy;
    delete filter.order;
    delete filter.fields;

    const search = req.query.search?.trim();

delete filter.search;
    const allowedFields = [
      "name",
      "country",
      "role",
      "runs",
      "wickets",
      "matches",
    ];

    // Handle advanced filtering
    const operatorMap = {
      gt: "$gt",
      gte: "$gte",
      lt: "$lt",
      lte: "$lte",
    };
    const numericFields = ["runs", "wickets", "matches"];
    let openBracketIndex = -1;
    let closeBracketIndex = -1;
    
    for (const key in filter) {
      openBracketIndex = key.indexOf("[");
      closeBracketIndex = key.indexOf("]");
      if (openBracketIndex === -1 && closeBracketIndex === -1) continue;

      const field = key.slice(0, openBracketIndex);
      const operator = key.slice(openBracketIndex + 1, closeBracketIndex);

      // Validate request
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
      const value = Number(filter[key]);

      //Validate Value
      if (isNaN(value)) {
        return res.status(400).json({
          success: false,
          message: "Invalid numeric value.",
        });
      }

      delete filter[key];

      filter[field] = {
        [operatorMap[operator]]: value,
      };
    }

    const isPresent = Object.keys(filter).every((key) =>
      allowedFields.includes(key),
    );
    if (!isPresent) {
      return res.status(400).json({
        success: false,
        message: "Invalid Filter Request",
      });
    }

    // Build MongoDB query
    let query = "";
    if (selectedFields) {
      const split = selectedFields.split(",").map(field => field.trim());;
      if (!split.every((field) => allowedFields.includes(field))) {
        return res.status(400).json({
          success: false,
          message: "Invalid field selection",
        });
      }
      query = split.join(" ");
    }

    //Validate Page
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Page or Limit",
      });
    }

    //Validate Order
    const validOrder = ["asc", "desc"];
    if (!validOrder.includes(order)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order",
      });
    }

    if (!allowedFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sorting Request",
      });
    }

    const startIndex = (page - 1) * limit;
    const sortValue = order === "asc" ? 1 : -1;

    // Execute query
    let mongoFilter = { ...filter };

if (search) {
  mongoFilter.$or = [
    {
      name: {
        $regex: search,
        $options: "i",
      },
    },
    {
      country: {
        $regex: search,
        $options: "i",
      },
    },
    {
      team: {
        $regex: search,
        $options: "i",
      },
    },
  ];
}
    let mongoQuery = Player.find(mongoFilter).sort({
  [sortBy]: sortValue,
});

    if (query) {
      mongoQuery = mongoQuery.select(query);
    }

    const players = await mongoQuery.skip(startIndex).limit(limit);

    // Prepare pagination
    const totalPlayers = await Player.countDocuments(filter);

    const totalPages = Math.ceil(totalPlayers / limit);

    const pagination = {};
    if (page > 1) {
      pagination.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (page < totalPages) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    //Send Response
    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPlayers,
      totalPages,
      pagination,
      data: players,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const countPlayers = async (req, res) => {
  try {
    const count = await Player.countDocuments();
    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchPlayers = async (req, res) => {
  try {
    const filter = {};
    const name = req.query.name;
    const country = req.query.country;
    const role = req.query.role;
    const team = req.query.team;
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }
    if (role) {
      filter.role = { $regex: role, $options: "i" };
    }
    if (team) {
      filter.team = { $regex: team, $options: "i" };
    }
    const players = await Player.find(filter);
    if (players.length === 0)
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    return res.status(200).json({
    success: true,
    data: players,
});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchPlayersById = async (req, res) => {
  try {
    const id = req.params.id;
    const check = mongoose.Types.ObjectId.isValid(id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Invalid Player ID",
      });
    }
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePlayersById = async (req, res) => {
  try {
    const id = req.params.id;

    const check = mongoose.Types.ObjectId.isValid(id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Invalid Player ID",
      });
    }

    const player = await Player.findByIdAndDelete(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePlayersById = async (req, res) => {
  try {
    const id = req.params.id;
    const check = mongoose.Types.ObjectId.isValid(id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Player not found",
      });
    }
    const player = await Player.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
