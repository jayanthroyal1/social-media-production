const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  refreshTokenhandler,
  logout,
} = require("../controllers/auth.controller");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  max: 10, // max 10 logins attempts per IP
  message: "Too Many login attempts. Try again later",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshTokenhandler);

module.exports = router;
