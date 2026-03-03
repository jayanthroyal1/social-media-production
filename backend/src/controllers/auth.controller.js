const bcrypt = require("bcrypt");
const User = require("../models/User");

//Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check User exisiting or not
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
    res.status(500).json({ message: err.message });
  }
};

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

    // 4. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 5. Success
    return res.status(200).json({
      message: "LoggedIn Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
