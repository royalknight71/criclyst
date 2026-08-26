/**
 * Authentication middleware.
 * Guards protected routes by verifying the JWT stored in the "token" cookie,
 * rejecting blacklisted (logged-out) tokens via Redis, loading the user
 * document, and attaching it to req.user for downstream handlers.
 */
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import redisClient from '../config/redis.js';

/**
 * Verifies the request's auth token and attaches the authenticated user
 * to req.user (password excluded).
 * Responds with 401 for missing, blacklisted, expired, or invalid tokens;
 * calls next() on success.
 */
export const userAuth=async (req,res,next)=>{
    try{
        const {token}=req.cookies

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Please login to continue"
            });
        }

        try{
            const isBlocked=await redisClient.exists(token)
            if (isBlocked) {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again."
                });
            }
        }
        catch(redisError){
            // Redis unavailable — allow the request through rather than
            // blocking all authenticated traffic.
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