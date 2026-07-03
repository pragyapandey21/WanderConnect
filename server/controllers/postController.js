const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { caption, image, location, tags } = req.body;

    const post = await Post.create({
      caption,
      image,
      location,
      tags,
      user: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Prevent duplicate likes
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        message: "Already liked",
      });
    }

    post.likes.push(req.user.id);

    await post.save();

    res.status(200).json({
      message: "Post liked successfully",
      likes: post.likes.length,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text,
    };

    post.comments.push(comment);

    await post.save();

    res.status(200).json({
      message: "Comment added successfully",
      comments: post.comments,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  likePost,
  commentPost,
};