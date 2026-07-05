import express from 'express';

const router=express.Router();

router.get("/",(req,res)=>{
    res.json(
        [
  {
    "id": 18,
    "name": "Virat Kohli",
    "runs": 13848
  },
  {
    "id": 45,
    "name": "Rohit Sharma",
    "runs": 11168
  }
])})


export default router;