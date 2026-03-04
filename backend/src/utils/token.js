const jwt = require("jsonwebtoken");
const { v4: uuidV4 } = require("uuid");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m", // for testing
  });
};

const generateRefreshToken = () => {
  return uuidV4();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
