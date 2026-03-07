require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 5000;

console.log("ACCESS:", process.env.JWT_ACCESS_SECRET);
console.log("REFRESH:", process.env.JWT_REFRESH_SECRET);

const startServer = async () => {
  try {
    await connectDB();
    // await connectRedis();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
