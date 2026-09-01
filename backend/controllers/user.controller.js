/**
 * User controllers.
 * Authentication and profile management handlers: registration with
 * password hashing, login with JWT issuance via cookie, logout with
 * Redis token blacklisting, and CRUD operations on the user's own profile.
 */
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';

/**
 * Builds the "token" auth cookie options.
 * - Production: SameSite=None + Secure so the httpOnly JWT cookie round-trips
 *   on cross-site XHR/fetch (frontend on criclyst.vercel.app -> backend on a
 *   different origin). SameSite=Lax would be silently dropped by browsers on
 *   cross-site API calls, causing 401 on every authenticated request.
 * - Development: frontend and API are same-site (localhost) and non-HTTPS, so
 *   keep SameSite=Lax and Secure off.
 */
function cookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/"
    };
}

/**
 * Registers a new user.
 * Validates required fields, email format, and password strength; rejects
 * duplicate emails; stores the password as a bcrypt hash. Returns the
 * created user without the password.
 */
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

/**
 * Authenticates a user and issues a JWT.
 * Verifies credentials via bcrypt comparison, signs a token (15-minute
 * expiry) containing the user ID and email, sets it as the "token" cookie,
 * and returns the user's public profile data.
 */
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
                                email: existingUser.email,
                                role: existingUser.role
                                },
                                process.env.JWT_SECRET,
                                {
                                expiresIn: 15*60
                            });
        res.cookie("token",token,{
            ...cookieOptions(),
            maxAge: 15 * 60 * 1000
        })
        res.status(200).json({
            success:true,
            message:"Login Successful",
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role
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

/**
 * Logs out the current user.
 * Verifies the JWT from the cookie, blacklists the token in Redis until
 * its original expiry (so it cannot be reused), and clears the cookie.
 */
export const logoutUser=async (req,res)=>{
    try{
        const {token}=req.cookies;
        if(!token)
            return res.status(401).json({ success: false, message: "Not authenticated" });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        try{
            await redisClient.set(token,"blocked")
            await redisClient.expireAt(token,payload.exp)
        }catch(redisError){
            // Redis unavailable — still allow logout to succeed
        }

        res.clearCookie("token", cookieOptions());
        return res.status(200).json({
            success: true,
            message: "Logout Successfully"
        })
    }
    catch(error){
        // Ensure cookie is cleared even on error
        res.clearCookie("token", cookieOptions());
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

/**
 * Returns the authenticated user's profile (ID, name, email, role).
 * Relies on req.user being set by the auth middleware.
 */
export const getProfile=async (req,res)=>{
    try{
        const data=req.user;
        return res.status(200).json({
            success:true,
            data:{
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
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

/**
 * Deletes the authenticated user's account.
 */
export const deleteProfile=async (req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        }); 
    }
    catch(error){
        return res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

/**
 * Updates the authenticated user's name and/or email.
 * Runs schema validators and returns the updated public profile.
 */
export const updateProfile=async (req,res)=>{
    try{
        const { name, email } = req.body;
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (existing) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
        }
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
                    email: user.email,
                    role: user.role
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