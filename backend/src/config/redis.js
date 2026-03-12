const { createClient } = require("redis");
const logger = require("../utils/logger");

let redisClient = null;

// do not start redis during tests
if (process.env.NODE_ENV !== "test") {
  redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  redisClient.on("error", (err) => {
    logger.error(`Redis Error: ${err}`);
  });

  redisClient
    .connect()
    .then(() => logger.info("Redis Connected"))
    .catch((err) => logger.error(`Redis Connection Failed: ${err}`));
}

module.exports = { redisClient };
