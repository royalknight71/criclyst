/**
 * Rate limiting middleware using a Redis sorted-set sliding window.
 * Tracks requests per client IP within a 15-minute window and blocks
 * clients exceeding the maximum request count with a 429 response.
 */
import redisClient from "../config/redis.js"

// Sliding window length in seconds (15 minutes)
const windowSize=15*60*1000
// Maximum allowed requests per window
const maxRequest=10000

/**
 * Applies per-IP rate limiting on each request.
 * Prunes expired entries from the sorted set, rejects the request with 429
 * if the limit is reached, otherwise records the current request (with a
 * random tiebreaker value for uniqueness) and refreshes the key TTL.
 */
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
        
        const key=req.ip
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