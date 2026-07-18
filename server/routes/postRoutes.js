const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPosts,
  getMyPosts,
  likePost,
  commentPost,
  deletePost,
} = require("../controllers/postController");
router.post("/", protect, upload.single("image"), createPost);

router.get("/", getPosts);
router.get("/my-posts", protect, getMyPosts);

router.put("/:id/like", protect, likePost);

router.post("/:id/comment", protect, commentPost);
router.delete("/:id", protect, deletePost);

module.exports = router;