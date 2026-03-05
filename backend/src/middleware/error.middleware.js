const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log full error details
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    status: err.status,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
};

module.exports = errorHandler;
