const { Worker } = require("bullmq");

const ioRedisconnection = require("../config/redisBull");

// notificationQueue Queue Name from queue which contains
// job.id
// job.name
// job.data
// job.timestamp
// {
//  "name": "sendNotification",
//  "data": {
//    "userId": "123",
//    "postId": "456"
//  }
// }
const worker = new Worker(
  "notificationQueue",
  async (job) => {
    console.log("Proccessing Job:", job.name);

    const { userId, postId } = job.data;

    console.log(`sending notification to user ${userId} for post ${postId}`);
  },
  { ioRedisconnection },
);

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed: ${job.id} with the following Error:`, err);
});
