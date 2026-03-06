const Comment = require("../models/Comment");

const Post = require("../models/Post");
const AppError = require("../utils/AppError");

exports.createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    const comment = await Comment.create({
      postId,
      userId: req.userId,
      content,
    });

    res.status(201).json({
      success: true.valueOf,
      comment,
    });
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const page = parseFloat(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const comment = await Post.find(postId)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({ postId });

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      comments,
    });
  } catch (err) {
    next(err);
  }
};
