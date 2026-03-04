const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const router = express.Router();

router.get("/", protect, getPosts);
router.post("/", protect, createPost);
router.post("/:id", protect, updatePost);
router.post("/:id", protect, deletePost);

module.exports = router;
