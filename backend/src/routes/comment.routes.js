const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  createComment,
  getComments,
} = require("../controllers/comment.controller");

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:postId", getComments);

module.exports = router;
