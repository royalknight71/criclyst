import mongoose from "mongoose";

const matchSchema=new mongoose.Schema({
    teamA:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Team",
        required:true,
    },
    teamB:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Team",
        required:true,
    },
    winner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
       default:null
    },
    venue:{
        type:String,
        required:true,
        trim:true
    },
    matchDate:{
        type:Date,
        required:true
    },
    format:{
        type:String,
        lowercase:true,
        enum:['t20i','odi','test'],
        required:true
    },
    status:{
        type:String,
        lowercase:true,
        enum:['upcoming','live','completed'],
        required:true
    },
    tossWinner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required:true
    },
    tossDecision:{
        type:String,
        lowercase:true,
        enum:['bat','bowl']
    },
    result:{
        type:String,
        default:""
    },
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
    manOfTheMatch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        default: null
    }
},{
    timestamps:true
})

const Match=mongoose.model('Match',matchSchema)

export default Match;