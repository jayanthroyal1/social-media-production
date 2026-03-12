const { Queue } = require("bullmq");
const ioRedisconnection = require("../config/redisBull");

// Queue Name = notificationQueue
const notificationQueue = new Queue("notificationQueue", { ioRedisconnection });

module.exports = notificationQueue;
