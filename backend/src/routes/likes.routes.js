const express = require("express");
const protect = require("../middleware/auth.middleware");
const { toggleLike, getPostLikes } = require("../controllers/like.controller");

const router = express.Router();

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: Like toggled
 */

router.post("/", protect, toggleLike);
router.get("/:postId", getPostLikes);

module.exports = router;
