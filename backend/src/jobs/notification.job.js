const notificationQueue = require("../queues/notification.queue");

const addNotificationJob = async (data) => {
  await notificationQueue.add("sendNotification", data);
};
// notificationQueue.add()
// Adds job to Redis.
// Arguments:
// job name
// job data
// options
module.exports = { addNotificationJob };
