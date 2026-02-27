// src/config/redis.js
// const Redis = require("ioredis");
// const logger = require("../utils/logger");

// let redisClient = null;

// const getRedisClient = () => {
//     if (!redisClient) {
//         redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
//             maxRetriesPerRequest: 3,
//             enableReadyCheck: true,
//             lazyConnect: true,
//             retryStrategy(times) {
//                 const delay = Math.min(times * 50, 2000);
//                 return delay;
//             },
//         });

//         redisClient.on("connect", () => logger.info("Redis connected."));
//         redisClient.on("ready", () => logger.info("Redis ready."));
//         redisClient.on("error", (err) => logger.error(`Redis error: ${err.message}`));
//         redisClient.on("close", () => logger.warn("Redis connection closed."));
//         redisClient.on("reconnecting", () => logger.warn("Redis reconnecting..."));
//     }
//     return redisClient;
// };

// module.exports = { getRedisClient };

// Redis disabled — stub export so imports don't crash
const getRedisClient = () => null;
module.exports = { getRedisClient };
