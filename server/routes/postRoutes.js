const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  getMyPosts,
  likePost,
  commentPost,
} = require("../controllers/postController");
router.post("/", protect, createPost);

router.get("/", getPosts);
router.get("/my-posts", protect, getMyPosts);

router.put("/:id/like", protect, likePost);

router.post("/:id/comment", protect, commentPost);

module.exports = router;