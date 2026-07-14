import mongoose from "mongoose";

const teamSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
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
    format:{
        type:String,
        required:true,
        lowercase: true,
        enum:["odi","t20i",'test'],
        trim:true
    },
    captain:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    coach:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    ranking:{
        type:Number,
        min:1
    },
    founded:{
        type:Number,
        required:true,
        min:1800,
        max:new Date().getFullYear()
    },
    logo:{
        type:String,
        default:""
    },
    players:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player"
        }],
        default:[]
    },
    description:{
        type:String,
        default:"Cricket Team"
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const Team=mongoose.model('Team',teamSchema)

export default Team 