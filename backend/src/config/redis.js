const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
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
