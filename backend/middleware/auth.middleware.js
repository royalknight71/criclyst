import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const userAuth=async (req,res,next)=>{
    try{
        const {token}=req.cookies
        console.log(req.cookies);
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Please login to continue"
            });
        }
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        const {id}=payload
        const user = await User
        .findById(id)
        .select("-password");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Unavailable"
            });
        }
        req.user=user;
        next();
    }
    catch(error){
        if(error.name==="TokenExpiredError"){
            return res.status(401).json({
            success:false,
            message:"Session expired. Please login again."
            })
        }

        if(error.name==="JsonWebTokenError"){
            return res.status(401).json({
            success:false,
            message:"Invalid authentication token"
            })
            }

            return res.status(500).json({
            success:false,
            message:"Internal Server Error"
            })
    }
}