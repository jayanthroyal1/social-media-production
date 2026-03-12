const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    //userId stores the ObjectId of a User document, enforces it as required, enables populate() with ref: "User", and speeds up queries using index: true.
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
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Compound index speeds both filter + sort.
// Creates a compound index so MongoDB can quickly fetch posts of a specific user sorted by newest first (userId ascending, createdAt descending)
postSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
