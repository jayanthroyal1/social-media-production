const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    //Links comment to post.
    postId: {
      // type: mongoose.Schema.Types.ObjectId means this field will store a MongoDB ObjectId that usually references another document’s _id.
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    // Tracks who wrote the comment.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  //   Adds --> createdAt & updatedAt -> We use createdAt for sorting comments.
  { timestamps: true },
);

// find comments of post sorted by newest. without this the scan will be slow
commentSchema.index({ postId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
