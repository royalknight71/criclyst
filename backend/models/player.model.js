/**
 * Player model definition.
 * Represents a cricket player with identity details, playing style
 * enumerations, and career statistics used across analytics endpoints.
 */
import mongoose from "mongoose";

const playerSchema=new mongoose.Schema({
    // Unique lowercased player name (indexed for lookups)
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index:true
    },
    // Country the player represents (indexed)
    country:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        index:true
    },
    // Primary playing role (indexed)
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ['Batsman','Bowler','All-Rounder','Wicket-Keeper'],
        index:true
    },
    // Batting handedness/style
    battingStyle:{
        type:String,
        required:true,
        trim:true,
        enum:['Left-Hand Bat','Right-Hand Bat']
    },
    // Bowling style/arm; "None" for pure batters and keepers
    bowlingStyle:{
        type:String,
        required:true,
        trim:true,
        enum:['Right-arm Fast','Right-arm Medium','Right-arm Leg break','Right-arm Off break','Left-arm Fast',
                'Left-arm Medium','Left-arm Orthodox','Left-arm Chinaman','Leg Break','None']
    },
    // Career statistics used for sorting/filtering in listings
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
    // Optional URL/path to the player's photo
    image:{
        type:String,
        default:""
    },
    jerseyNumber:{
        type:Number,
        min:0
    },
    // Denormalized team name (lowercased string, not a reference)
    team:{
        type:String,
        trim:true,
        lowercase: true,
        default:""
    },
    // Year of international debut (bounded to 1877..current year)
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

/** Mongoose model for cricket players. */
const Player=mongoose.model('Player',playerSchema);

export default Player;