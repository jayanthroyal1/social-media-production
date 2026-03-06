const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    postId: {
      // mongoose.Schema.Types.ObjectId defines a field that stores-
      //-the unique MongoDB ID of another document, commonly used to link collections.
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Creates a compound unique index to ensure a user can like a specific post only once.
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
