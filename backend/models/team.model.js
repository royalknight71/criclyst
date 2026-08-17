import mongoose from "mongoose";

const teamSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
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
    type:mongoose.Schema.Types.ObjectId,
    ref:"Player",
    required: true
},
    coach:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    ranking:{
            type:Number,
    required:true,
    min:1,
    max:20
    },
    founded:{
        type:Number,
        required:true,
        min:1800,
        max:new Date().getFullYear()
    },
    logo:{
        type:String,
        default:"",
        trim:true
    },
    players:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player"
        }],
        default:[]
    },
    homeGround:{
    type:String,
    trim:true,
    lowercase:true
},
    description:{
    type:String,
    default:"Cricket Team",
    maxlength:300
},
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

teamSchema.index(
    {
        country: 1,
        format: 1
    },
    {
        unique: true
    }
);

const Team=mongoose.model('Team',teamSchema)

export default Team 