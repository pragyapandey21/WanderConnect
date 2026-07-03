const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendGroupMessage,
  getGroupMessages,
} = require("../controllers/groupMessageController");

// Send message
router.post("/:groupId", protect, sendGroupMessage);

// Get all messages
router.get("/:groupId", protect, getGroupMessages);

module.exports = router;