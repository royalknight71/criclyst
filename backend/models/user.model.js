import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength:2
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        unique:true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength:8
    }
},{
    timestamps: true
})

const User=mongoose.model('User',userSchema);

export default User;