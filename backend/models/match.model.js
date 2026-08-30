/**
 * Match model definition.
 * Represents a cricket fixture between two teams, including toss details,
 * result, live scorecard data, and the Man of the Match award.
 */
import mongoose from "mongoose";

const matchSchema=new mongoose.Schema({
    // First participating team
    teamA:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Team",
        required:true,
    },
    // Second participating team
    teamB:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Team",
        required:true,
    },
    // Winning team; null until the match is completed
    winner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
       default:null
    },
    // Stadium/ground where the match is played
    venue:{
        type:String,
        required:true,
        trim:true
    },
    // Scheduled or actual date of the match
    matchDate:{
        type:Date,
        required:true
    },
    // Cricket format of the match
    format:{
        type:String,
        lowercase:true,
        enum:['t20i','odi','test'],
        required:true
    },
    // Lifecycle state of the match
    status:{
        type:String,
        lowercase:true,
        enum:['upcoming','live','completed'],
        required:true
    },
    // Team that won the toss
    tossWinner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    // Decision made by the toss winner (bat or bowl)
    tossDecision:{
        type:String,
        lowercase:true,
        enum:['bat','bowl'],
        default: null
    },
    // Free-text result summary (e.g., "India won by 5 runs")
    result:{
        type:String,
        default:""
    },
   // Live/completed scorecard summary for both teams
   scorecard: {
    teamAScore: {
        type: String,
        default: ""
    },
    teamBScore: {
        type: String,
        default: ""
    },
    overs: {
        type: String,
        default: ""
    },
    currentRunRate: {
        type: Number,
        default: 0
    },
    target: {
        type: Number,
        default: 0
    }
},
    // Player awarded Man of the Match; null until awarded
    manOfTheMatch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        default: null
    }
},{
    timestamps:true
})

/** Mongoose model for cricket matches. */
const Match=mongoose.model('Match',matchSchema)

export default Match;