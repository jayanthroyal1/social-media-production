const express = require("express");
const {
  register,
  login,
  refreshTokenhandler,
  logout,
} = require("../controllers/auth.controller");
const validation = require("../middleware/validation.middleware");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../validators/auth.validator");
const { loginLimiter } = require("../middleware/rateLimit.middleware");
const router = express.Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", loginLimiter, validation(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", validation(refreshSchema), refreshTokenhandler);

module.exports = router;
