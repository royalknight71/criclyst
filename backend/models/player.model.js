import mongoose from "mongoose";

const playerSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index:true
    },
    country:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        index:true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ['Batsman','Bowler','All-Rounder','Wicket-Keeper'],
        index:true
    },
    battingStyle:{
        type:String,
        required:true,
        trim:true,
        enum:['Left-Hand Bat','Right-Hand Bat']
    },
    bowlingStyle:{
        type:String,
        required:true,
        trim:true,
        enum:['Right-arm Fast','Right-arm Medium','Right-arm Off Break','Left-arm Fast',
                'Left-arm Medium','Left-arm Orthodox','Left-arm Chinaman','Leg Break','None']
    },
    matches:{
        type:Number,
        required:true,
        min:1
    },
    runs: {
        type: Number,
        default: 0,
        min: 0
    },
    wickets: {
        type: Number,
        default: 0,
        min: 0
    },
    average:{
        type:Number,
        default:0,
    },
    strikeRate:{
        type:Number,
        default:20,
        min:20
    },
    highestScore:{
        type:Number,
        default:0,
        min:0
    },
    image:{
        type:String,
        default:""
    },
    jerseyNumber:{
        type:Number,
        min:0
    },
    team:{
        type:String,
        trim:true,
        lowercase: true,
        default:""
    },
    debutYear:{
        type:Number,
        min: 1877,
        max: new Date().getFullYear()
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps: true
})

const Player=mongoose.model('Player',playerSchema);

export default Player;