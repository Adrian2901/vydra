import Redis from "ioredis";
import mockRedis from "./mockRedis";

const useMockRedis = process.env.MOCK_DB === "true";

let redis;
if (useMockRedis) {
  // Use mock Redis for testing
  console.log("WARNING - Using mock Redis for testing");
  redis = mockRedis;
} else {
  // Initialize Redis client
  console.log("Connecting to Redis...");
  redis = new Redis(process.env.REDIS_URL); // Use environment variables for configuration
  // TODO: Add error handling for Redis connection
}

export default redis;
