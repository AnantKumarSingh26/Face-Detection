const Redis = require("ioredis").default;

const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
})

redis.on("connect",()=>{
    console.log('Server is connected to REDIS')
})

redis.on("error",(err)=>{
    console.log('Error in REDIS connection',err)
})

module.exports = redis;