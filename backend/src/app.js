const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
// ----------------------------------------------------------------------
const authRoutes = require("./routes/auth.routes");
const logger = require("./utils/logger");
const protect = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");
const authorize = require("./middleware/authorize.middleware");
const postRoutes = require("./routes/post.routes");
const { apiLimiter } = require("./middleware/rateLimit.middleware");
// const apiCors = require("./middleware/cors.middleware");
const commentRoutes = require("./routes/comment.routes");
const likeRoutes = require("./routes/likes.routes");
const swaggerSpec = require("./config/swagger");

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  logger.info(`Api Request method: ${req.method} and from: ${req.originalUrl}`);
  next();
});

// Now every API route is protected.
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("api/likes", likeRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Access granted", userId: req.userId });
  logger.info(`Access granted for UserId: ${req.userId}`);
});

app.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server running 🚀" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
