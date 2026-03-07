const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  createComment,
  getComments,
} = require("../controllers/comment.controller");

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add comment to post
 *     tags: [Comments]
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/", protect, createComment);
router.get("/:postId", getComments);

module.exports = router;
