const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createStory,
  getStories
} = require("../controllers/storyController");

router.post("/", protect, createStory);

router.get("/", protect, getStories);

module.exports = router;