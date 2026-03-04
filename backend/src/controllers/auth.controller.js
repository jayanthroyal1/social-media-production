const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { redisClient } = require("../config/redis");
const logger = require("../utils/logger");

//Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check User exisiting or not  | 11000 = MongoDB duplicate key error.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User register successfully",
      user: {
        id: user._id, //_id sets default in mongoDB
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

//Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2. Find user and include password
    // why +password is ✔ I need the password this time. | ✔ Allow it ONLY for this query.”
    const user = await User.findOne({ email }).select("+password");

    // 3. If user not found
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("USER OBJECT:", user);
    console.log("USER ID:", user._id);

    // 4. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // Store refresh token in redis for 7 days
    await redisClient.set(`refresh:${refreshToken}`, user._id.toString(), {
      EX: 7 * 24 * 60 * 60,
    });

    logger.info(`User logged in: ${email}`);

    // 5. Success
    return res.status(200).json({
      message: "LoggedIn Successful",
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   role: user.role,
      // },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

//Refresh Token
exports.refreshTokenhandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // 1️⃣ Check if refresh token exists
    const userId = await redisClient.get(`refresh:${refreshToken}`);

    if (!userId) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    // 2️⃣ Delete old refresh token (rotation step)
    await redisClient.del(`refresh:${refreshToken}`);

    // To get user fetch from DB
    const user = await User.findById(userId);
    // 3️⃣ Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    // 4️⃣ Store new refresh token
    await redisClient.set(`refresh:${newRefreshToken}`, userId, {
      EX: 7 * 24 * 60 * 60,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    await redisClient.del(`refresh:${refreshToken}`);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
