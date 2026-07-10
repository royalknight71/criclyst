import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

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

userSchema.methods.comparePassword=async function(password){
    return bcrypt.compare(password,this.password)
}

const User=mongoose.model('User',userSchema);

export default User;