const { redisClient } = require("../config/redis");
const Post = require("../models/Post");
const AppError = require("../utils/AppError");
const { setCache, getCache } = require("../utils/cache");
const logger = require("../utils/logger");

exports.getPosts = async (req, res, next) => {
  try {
    // Query parameters come as strings.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Standard pagination formula.
    // If page = 1:
    // skip = 0
    // If page = 2:
    // skip = 10
    const skip = (page - 1) * limit;

    const cacheKey = `posts:page${page}:limit:${limit}`;
    // 🔹 1. Check Cache
    // Always check cache first.
    // Why?
    // Redis is memory-based → microseconds response time.
    // MongoDB is disk-based → milliseconds.
    // const cachedData = await redisClient.get(cacheKey);
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      logger.info("Serving from cache");
      return res.json({
        source: "cache",
        data: cachedData,
      });
    }
    // 🔹 2. Fetch from DB
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // orders posts by latest first (descending by creation time).
      .skip(skip)
      .limit(limit)
      .lean(); //returns plain JavaScript objects instead of Mongoose documents, making the query faster and lighter.
    // Lower memory usage (lean)

    const total = await Post.countDocuments();

    const response = {
      total,
      page,
      // why celi is 25/10 = 2.5 → ceil → 3 pages.
      totalPages: Math.ceil(total / limit),
      posts,
    };
    // 🔹 3. Store in cache for 60 seconds
    // await redisClient.set(cacheKey, JSON.stringify(response), {
    //   expiration: 60,
    // });
    await setCache(cacheKey, posts, 120);
    logger.info("Serving from DB");
    res.json({
      source: "database",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    // 1️⃣ Validate input
    if (!content) {
      return new AppError("Content is required", 400);
    }
    // 2️⃣ Create post linked to logged-in user
    const post = await Post.create({
      userId: req.userId,
      content,
    });
    // 3️⃣ Invalidate cache
    const keys = await redisClient.keys("posts:*");
    if (keys.length) {
      // Because GET posts is cached. If we don’t clear cache: User won’t see newly created post
      await redisClient.del(keys);
    }

    res.status(201).json({
      message: "Post created Successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return new AppError("Post not found", 404);
    }

    // Ownership check
    if (
      // MongoDB ObjectId !== string.Without converting:Comparison fails.
      post.userId.toString() !== req.userId &&
      (req.userRole !== "admin" || req.userRole !== "super-admin")
    ) {
      return new AppError("Not Authorized", 403);
    }

    post.content = content || post.content;
    // Why not use findByIdAndUpdate() ? --> We could. But:-
    // We need ownership check first.findByIdAndUpdate skips validation logic sometimes.
    //  Using .findById() + .save() gives full control
    await post.save();

    // Clear Cache
    const keys = await redisClient.keys("posts:*");

    if (keys.length) {
      await redisClient.del(keys);
    }

    res.json({ message: "Post Updated", post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return new AppError("Post not found", 404);
    }

    if (
      post.userId.toString() !== req.userId &&
      (req.userRole !== "admin" || req.userRole !== "super-admin")
    ) {
      return new AppError("Not Authorize", 404);
    }
    // 🧠 Why deleteOne() instead of findByIdAndDelete()?
    // Because we already fetched the post for ownership validation. Better to reuse document instance.
    await post.deleteOne();
    // Invalidate cache
    const keys = await redisClient.keys("posts:*");
    if (keys.length) {
      await redisClient.del(keys);
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};
