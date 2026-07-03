const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  reactToMessage,
  deleteMessage,
  editMessage,
  searchMessages,
  getNotifications,
  getChatList
} = require("../controllers/messageController");

// Core messaging
router.post  ("/",          protect, sendMessage);
router.get   ("/chats",     protect, getChatList);          // chat list page
router.get   ("/notifications", protect, getNotifications); // notification badge
router.get   ("/:id",       protect, getConversation);
router.get   ("/:id/search",protect, searchMessages);
router.put   ("/read/:id",  protect, markMessagesAsRead);

// Message actions
router.post  ("/:id/react", protect, reactToMessage);
router.put   ("/:id/edit",  protect, editMessage);
router.delete("/:id",       protect, deleteMessage);

module.exports = router;