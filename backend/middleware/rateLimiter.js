import redisClient from "../config/redis.js"


const rateLimiter=async (req,res,next)=>{
    try{
        const ip=req.ip
        console.log(ip);
        
        const cnt=await redisClient.incr(ip)

        if(cnt>60)
        {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }
            

        if(cnt==1)
            await redisClient.expire(ip, 3600);

        console.log(cnt);
        
        next()
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
export default rateLimiter