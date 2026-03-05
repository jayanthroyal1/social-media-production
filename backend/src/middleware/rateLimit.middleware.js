const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Defines the time window. --> 15 mins
  max: 20, // max 10 logins attempts per IP
  message: {
    success: false,
    message: "Too Many login attempts. Try again later",
  },
  // add headers like. So it helps clients know their limits
  // RateLimit-Limit
  // RateLimit-Remaining
  // RateLimit-Reset
  standardHeaders: true,
  // Disables older header formats.
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  max: 5, // max 10 logins attempts per IP
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

module.exports = { apiLimiter, loginLimiter };
