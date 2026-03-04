const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const logger = require("./utils/logger");
const protect = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Access granted", userId: req.userId });
  logger.info(`Access granted for UserId: ${req.userId}`);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server running 🚀" });
});

app.use(errorHandler);

module.exports = app;
