/**
 * Request logging middleware.
 * Records the start time of each request and, once the response finishes,
 * logs the timestamp, HTTP method, URL, and total duration in milliseconds.
 */
const logger=(req,res,next)=>{
    const timestamp=new Date().toLocaleString();
    
    const start=Date.now();
    

    res.on("finish",()=>{
        const duration=Date.now()-start;
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${duration}ms`);
    })
    next();
}

export default logger;