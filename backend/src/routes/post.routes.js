const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const validation = require("../middleware/validation.middleware");
const {
  paginationSchema,
  createPostSchema,
  postIdSchema,
} = require("../validators/post.validator");
const router = express.Router();
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get paginated posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/", protect, validation(paginationSchema, "query"), getPosts);
router.post("/", protect, validation(createPostSchema), createPost);
router.put("/:id", protect, validation(postIdSchema, "params"), updatePost);
router.delete("/:id", protect, validation(postIdSchema, "params"), deletePost);

module.exports = router;

// Flow
// Request
// ↓
// Protect Middleware
//  ↓
// Validate Params (ObjectId)
//  ↓
// Validate Body (content)
//  ↓
// Controller
//  ↓
// Database
