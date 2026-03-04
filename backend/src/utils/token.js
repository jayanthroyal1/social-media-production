const jwt = require("jsonwebtoken");
const { v4: uuidV4 } = require("uuid");
const AppError = require("./AppError");

const generateAccessToken = (user) => {
  if (!user) {
    return new AppError("No User", 400);
  }
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
    },
  );
};

const generateRefreshToken = () => {
  return uuidV4();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
