import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const createUser=async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }
        const hashpass=await bcrypt.hash(password,10);
        const user=await User.create({
            name:name,
            email:email,
            password:hashpass
        });
        return res.status(201).json({
            success:true,
                data: {
                    _id: user._id,
                    "name": user.name,
                    "email": user.email
                }
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}