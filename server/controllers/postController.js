const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const createPost = async (req, res) => {
  try {
    const { caption, location, tags } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "wanderconnect/posts",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      imageUrl = uploadResult.secure_url;
    }

    const post = await Post.create({
      caption,
      image: imageUrl,
      location,
      tags,
      user: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);

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

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Only owner can delete
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
    });

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
  deletePost,
};