const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  followUser,
  unfollowUser,
  searchUsers,
  editProfile,
  uploadProfilePic,
  getTravelers,
  getUserById,
  getMyProfile,
} = require("../controllers/userController");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.put("/reset-password/:id", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.findByIdAndUpdate(req.params.id, {
      password: hashedPassword,
    });

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id/follow", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);
router.get("/search", protect, searchUsers);
router.put("/profile", protect, editProfile);
router.get("/travelers/:destination", getTravelers);

router.put(
  "/profilePic",
  protect,
  upload.single("image"),
  uploadProfilePic
);
router.get("/profile/me", protect, getMyProfile);
router.get("/:id", protect, getUserById);

module.exports = router;