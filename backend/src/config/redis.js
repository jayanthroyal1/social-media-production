const { createClient } = require("redis");
const logger = require("../utils/logger");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("connect", () => {
  logger.info("✅ Redis Connected");
});

redisClient.on("error", (error) => {
  logger.info("Redis Error", error);
});

const connectRedis = async () => {
  await redisClient.connect();
};

module.exports = { redisClient, connectRedis };
