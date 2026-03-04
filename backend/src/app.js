const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const logger = require("./utils/logger");
const protect = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  max: 20, // max 10 logins attempts per IP
  message: "Too Many login attempts. Try again later",
});

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Api Request method: ${req.method} and from: ${req.originalUrl}`);
  next();
});

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
