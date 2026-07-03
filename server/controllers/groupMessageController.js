const GroupMessage = require("../models/GroupMessage");
const Group = require("../models/Group");

// ===============================
// Send Group Message
// ===============================
const sendGroupMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { groupId } = req.params;

    if (!text) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // Check group exists
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // User must be a member
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({
        message: "You are not a member of this group",
      });
    }

    const message = await GroupMessage.create({
      group: groupId,
      sender: req.user.id,
      text,
      readBy: [req.user.id],
    });

    const populatedMessage = await GroupMessage.findById(message._id)
      .populate("sender", "username profilePic");
await Promise.all(
  messages.map(async (message) => {
    const alreadyRead = message.readBy.some(
      (id) => id.toString() === req.user.id
    );

    if (!alreadyRead) {
      message.readBy.push(req.user.id);
      await message.save();
    }
  })
);
    res.status(201).json(populatedMessage);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Group Messages
// ===============================
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // User must be a member
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({
        message: "You are not a member of this group",
      });
    }

    const messages = await GroupMessage.find({
      group: groupId,
    })
      .populate("sender", "username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendGroupMessage,
  getGroupMessages,
};