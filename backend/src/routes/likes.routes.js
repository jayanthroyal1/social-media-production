const express = require("express");
const protect = require("../middleware/auth.middleware");
const { toggleLike, getPostLikes } = require("../controllers/like.controller");

const router = express.Router();

router.post("/", protect, toggleLike);

router.get("/:postId", getPostLikes);

module.exports = router;
