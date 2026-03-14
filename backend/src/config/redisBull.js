const IORedis = require("ioredis");

const ioRedisconnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

module.exports = ioRedisconnection;
