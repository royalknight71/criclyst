import mongoose from "mongoose";

const playerSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ['Batsman','Bowler','All-Rounder','Wicket-Keeper']
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
},{
    timestamps: true
})

const Player=mongoose.model('Player',playerSchema);

export default Player;