import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';


export const createUser=async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Name, Email and Password are required"
            });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Enter Correct Email"
            });
        }
        if(!validator.isStrongPassword(password)){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }


        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already exists"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword
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

export const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password are required"
            });
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Enter Correct Email"
            });
        }
        
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const isPasswordSame=await existingUser.comparePassword(password);
        if(!isPasswordSame){
            return res.status(401).json({
                success:false,
                message:"Invalid Password"
            });
        }

        //jwt token generation
        const token = jwt.sign({
                                id: existingUser._id,
                                email: existingUser.email
                                },
                                process.env.JWT_SECRET,
                                {
                                expiresIn: "1d"
                            });
        res.cookie("token",token)
        res.status(200).json({
            success:true,
            message:"Login Successful",
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email
                }
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const logoutUser=async (req,res)=>{
    try{
        //res.cookie("token",null,{expires:new Date(Date.now())})
        res.clearCookie("token");
        return res.status(200).send("Logout Successfully")
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getProfile=async (req,res)=>{
    try{
        const data=req.user;
        return res.status(200).json({
            success:true,
            data:{
                _id: data._id,
                name: data.name,
                email: data.email
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

export const deleteProfile=async (req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Player deleted successfully"
        }); 
    }
    catch(error){
        return res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

export const updateProfile=async (req,res)=>{
    try{
        const { name, email } = req.body;
        const user=await User.findByIdAndUpdate(req.user._id,{name,email},{
            new:true,
            runValidators:true
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success:true,
            user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
        })
    }
    catch(error)
    {
        return res.status(500).json({
        success: false,
        message: error.message
        });
    }
}