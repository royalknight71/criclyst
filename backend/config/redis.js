import {createClient } from "redis"

const redisClient=createClient({
    username: 'default',
    password: 'n0Xe2Ra9tVReF9w9NJxQCQjqjCIEIAUI',
    socket: {
        host: 'engine-nacreous-summer-96498.db.redis.io',
        port: 11015
    }
})

redisClient.on("error", (err) => {
    console.log(err);
});

export default redisClient;