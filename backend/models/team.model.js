/**
 * Team model definition.
 * Represents a national cricket team for a specific format, including its
 * captain, squad, ranking, and metadata. Enforces one team per country/format
 * via a compound unique index.
 */
import mongoose from "mongoose";

const teamSchema=new mongoose.Schema({
    // Unique lowercased team name (indexed for lookups)
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        index:true
    },
    // Country the team represents (indexed)
    country:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        index:true        
    },
    // Cricket format the team plays (odi, t20i, or test)
    format:{
        type:String,
        required:true,
        lowercase: true,
        enum:["odi","t20i",'test'],
        trim:true
    },
    // Reference to the Player document acting as captain
    captain:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Player",
    required: true
},
    // Name of the team's coach (lowercased)
    coach:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    // ICC-style ranking position between 1 and 20
    ranking:{
            type:Number,
    required:true,
    min:1,
    max:20
    },
    // Year the team was founded (bounded to 1800..current year)
    founded:{
        type:Number,
        required:true,
        min:1800,
        max:new Date().getFullYear()
    },
    // Optional URL/path to the team logo
    logo:{
        type:String,
        default:"",
        trim:true
    },
    // Squad of Player references
    players:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player"
        }],
        default:[]
    },
    // Optional home stadium/ground name
    homeGround:{
    type:String,
    trim:true,
    lowercase:true
},
    // Short free-text description of the team
    description:{
    type:String,
    default:"Cricket Team",
    maxlength:300
},
    // Soft-active flag used by dashboard stats
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

// Prevent duplicate teams for the same country and format combination
teamSchema.index(
    {
        country: 1,
        format: 1
    },
    {
        unique: true
    }
);

/** Mongoose model for cricket teams. */
const Team=mongoose.model('Team',teamSchema)

export default Team 