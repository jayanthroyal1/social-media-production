const { createClient } = require("redis");

console.log(
  "Redis URL:",
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
);
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (error) => {
  console.log("Redis Error", error);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.log("Redis inital Connection failed", err);
  }
};

module.exports = { redisClient, connectRedis };
