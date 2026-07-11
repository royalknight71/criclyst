import express from 'express';
import { createUser, loginUser,getProfile, deleteProfile, updateProfile, logoutUser } from '../controllers/user.controller.js';
import {userAuth} from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/register',createUser)

router.post("/login",loginUser)

router.post("/logout",userAuth,logoutUser)

router.get("/profile",userAuth,getProfile)

router.delete("/profile",userAuth,deleteProfile)

router.put("/profile",userAuth,updateProfile)

export default router;