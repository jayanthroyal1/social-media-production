const winston = require("winston");

const path = require("path");

const logDir = "logs";

// Define Log Format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}]-${level.toUpperCase()}::${message}`;
  }),
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    //Save all logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),

    //Save only error
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
});

// if not production --> also log to console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  );
}

module.exports = logger;
