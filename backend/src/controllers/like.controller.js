const { addNotificationJob } = require("../jobs/notification.job");
const Like = require("../models/Like");
const Post = require("../models/Post");
const AppError = require("../utils/AppError");

exports.toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return next(new AppError("Post not found", 404));
    }

    const exisitingLike = await Like.findOne({
      postId,
      userId: req.userId,
    });

    if (exisitingLike) {
      await exisitingLike.deleteOne();

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Post Unliked",
      });
    }

    await Like.create({
      postId,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      liked: true,
      message: "Post liked",
    });

    const post = await Post.findById(postId);

    await addNotificationJob({
      userId: post?.user,
      postId: post?._id,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPostLikes = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const count = await Like.countDocuments({ postId });

    res.json({
      success: true,
      likes: count,
    });
  } catch (err) {
    next(err);
  }
};
