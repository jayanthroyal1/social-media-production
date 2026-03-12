const { redisClient } = require("../config/redis");
const logger = require("./logger");

const getCache = async (key) => {
  try {
    if (!redisClient) return null;
    const data = await redisClient.get(key);
    if (!data) return null;
    // Redis stores strings. So we convert back to object.
    return JSON.parse(data);
  } catch (err) {
    logger.error("Unable to getCache from redis", err.message);
  }
};

// TTL (Time To Live) - Cache expires after 60 seconds
const setCache = async (key, value, ttl = 60) => {
  try {
    if (!redisClient) return;
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.error("Unable to Set Cache from redis", err.message);
  }
};

module.exports = { getCache, setCache };
