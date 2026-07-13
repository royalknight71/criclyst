import redisClient from "../config/redis.js"

const windowSize=3600
const maxRequest=60

const rateLimiter=async (req,res,next)=>{
    try{
        // const ip=req.ip
        // console.log(ip);
        
        // const cnt=await redisClient.incr(ip)

        // if(cnt>60)
        // {
        //     return res.status(429).json({
        //         success: false,
        //         message: "Too many requests. Please try again later."
        //     });
        // }
            

        // if(cnt==1)
        //     await redisClient.expire(ip, 3600);

        // console.log(cnt);
        
        const key=`$req.ip`
        const currentTime=Date.now()/1000
        const windowTime=currentTime-windowSize

        await redisClient.zRemRangeByScore(key,0,windowTime)

        const numberOfRequest=await redisClient.zCard(key)
        if(numberOfRequest>=maxRequest)
        {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }

        await redisClient.zAdd(key,[{score:currentTime,value:`${currentTime}:${Math.random()}`}])

        await redisClient.expire(key,windowSize)

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