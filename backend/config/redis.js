import {createClient } from "redis"

const redisClient=createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'engine-nacreous-summer-96498.db.redis.io',
        port: 11015
    }
})
redisClient.on("error", (err) => {
    console.log(err);
});

export default redisClient;