const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createGroup,
  getGroupsByDestination,
  getGroupById,
  joinGroup,
  leaveGroup,
  deleteGroup,
} = require("../controllers/groupController");
// Create Trip Group
router.post("/", protect, createGroup);

// Get Groups of a Destination
router.get("/group/:id", protect, getGroupById);
router.get("/:destination", getGroupsByDestination);
router.put("/:id/join", protect, joinGroup);
router.put("/:id/leave", protect, leaveGroup);
router.delete("/:id", protect, deleteGroup);

module.exports = router;