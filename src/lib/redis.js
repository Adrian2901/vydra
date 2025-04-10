import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL); // Use environment variables for configuration

export default redis;
