const Message      = require("../models/Message");
const Notification = require("../models/Notification");
const { getIO }    = require("../socket");

// ─── SEND MESSAGE ────────────────────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { receiver, text, replyTo } = req.body;

    const message = await Message.create({
      sender:  req.user.id,
      receiver,
      text,
      replyTo: replyTo || null
    });

    // Populate replyTo so frontend can render quoted message
    await message.populate("replyTo", "text sender");

    const io = getIO();

    // Emit to receiver's room
    io.to(receiver).emit("receive_message", message);

    // Mark as delivered if receiver is online (server checks onlineUsers)
    // The server.js onlineUsers map handles this via "deliver_message" ack
    io.to(receiver).emit("message_delivered", { messageId: message._id, receiverId: receiver });

    // Store notification in DB
    const notification = await Notification.create({
      recipient: receiver,
      sender:    req.user.id,
      message:   message._id,
      type:      "message"
    });

    // Real-time notification count to receiver
    const unreadCount = await Notification.countDocuments({ recipient: receiver, read: false });
    io.to(receiver).emit("notification_count", unreadCount);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET CONVERSATION ────────────────────────────────────────────────────────
const getConversation = async (req, res) => {
  try {
    const myId     = req.user.id;
    const otherId  = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: myId,    receiver: otherId },
        { sender: otherId, receiver: myId    }
      ],
      // Exclude messages deleted for the current user
      deletedFor: { $ne: myId }
    })
      .sort({ createdAt: 1 })
      .populate("replyTo", "text sender");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── MARK MESSAGES AS READ ───────────────────────────────────────────────────
// Called when user opens a chat. Marks all unread messages from `otherId` as read.
const markMessagesAsRead = async (req, res) => {
  try {
    const myId    = req.user.id;
    const otherId = req.params.id;

    await Message.updateMany(
      { sender: otherId, receiver: myId, read: false },
      { read: true, delivered: true }
    );

    // Also mark notifications from this sender as read
    await Notification.updateMany(
      { recipient: myId, sender: otherId, read: false },
      { read: true }
    );

    // Tell the original sender that their messages were seen
    // We pass both parties so frontend can do a targeted state update
    getIO().to(otherId).emit("messages_seen", { by: myId, conversationWith: myId });

    // Send updated notification count to the reader
    const unreadCount = await Notification.countDocuments({ recipient: myId, read: false });
    getIO().to(myId).emit("notification_count", unreadCount);

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── REACT TO MESSAGE ────────────────────────────────────────────────────────
const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const messageId = req.params.id;
    const userId    = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Toggle: remove if same emoji from same user, else upsert
    const existingIdx = message.reactions.findIndex(
      r => r.userId.toString() === userId
    );

    if (existingIdx !== -1 && message.reactions[existingIdx].emoji === emoji) {
      // Remove reaction
      message.reactions.splice(existingIdx, 1);
    } else if (existingIdx !== -1) {
      // Change emoji
      message.reactions[existingIdx].emoji = emoji;
    } else {
      // Add new reaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    // Notify both parties in real time
    const io = getIO();
    io.to(message.sender.toString()).emit("message_reaction", {
      messageId: message._id,
      reactions: message.reactions
    });
    io.to(message.receiver.toString()).emit("message_reaction", {
      messageId: message._id,
      reactions: message.reactions
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE MESSAGE ──────────────────────────────────────────────────────────
const deleteMessage = async (req, res) => {
  try {
    const { deleteFor } = req.body; // "me" | "everyone"
    const messageId     = req.params.id;
    const userId        = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (deleteFor === "everyone") {
      // Only sender can delete for everyone
      if (message.sender.toString() !== userId) {
        return res.status(403).json({ message: "Not authorised" });
      }
      message.deletedForEveryone = true;
      message.text = "";
      await message.save();

      const io = getIO();
      io.to(message.receiver.toString()).emit("message_deleted", {
        messageId: message._id,
        deletedForEveryone: true
      });
      io.to(message.sender.toString()).emit("message_deleted", {
        messageId: message._id,
        deletedForEveryone: true
      });
    } else {
      // Delete for me — add userId to deletedFor array
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EDIT MESSAGE ────────────────────────────────────────────────────────────
const editMessage = async (req, res) => {
  try {
    const { text }  = req.body;
    const messageId = req.params.id;
    const userId    = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "Not authorised" });
    }

    message.text   = text;
    message.edited = true;
    await message.save();

    const io = getIO();
    io.to(message.receiver.toString()).emit("message_edited", {
      messageId: message._id,
      text,
      edited: true
    });
    io.to(message.sender.toString()).emit("message_edited", {
      messageId: message._id,
      text,
      edited: true
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SEARCH MESSAGES ─────────────────────────────────────────────────────────
const searchMessages = async (req, res) => {
  try {
    const myId    = req.user.id;
    const otherId = req.params.id;
    const { q }   = req.query;

    if (!q) return res.json([]);

    const messages = await Message.find({
      $or: [
        { sender: myId,    receiver: otherId },
        { sender: otherId, receiver: myId    }
      ],
      text: { $regex: q, $options: "i" },
      deletedFor: { $ne: myId },
      deletedForEveryone: false
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET NOTIFICATIONS ───────────────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "name avatar")
      .populate("message", "text");

    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET CHAT LIST (conversations) ───────────────────────────────────────────
// Returns all users the current user has chatted with,
// with last message, time, unread count, and partner profile.
const getChatList = async (req, res) => {
  try {
    const myId = req.user.id;

    // Find all unique conversation partners
    const sent     = await Message.find({ sender: myId }).distinct("receiver");
    const received = await Message.find({ receiver: myId }).distinct("sender");

    const partnerIds = [...new Set([
      ...sent.map(id => id.toString()),
      ...received.map(id => id.toString())
    ])];

    // Load User model to get partner profile (name, avatar, lastSeen)
    const User = require("../models/User");

    const chatList = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const [lastMsg, unreadCount, partner] = await Promise.all([
          Message.findOne({
            $or: [
              { sender: myId,      receiver: partnerId },
              { sender: partnerId, receiver: myId }
            ],
            deletedFor:         { $ne: myId },
            deletedForEveryone: { $ne: true }
          })
            .sort({ createdAt: -1 })
            .lean(),

          Message.countDocuments({
            sender:   partnerId,
            receiver: myId,
            read:     false
          }),

          // Fetch partner profile directly — reliable regardless of who
          // is sender vs receiver in the last message
          User.findById(partnerId).select("name avatar lastSeen").lean()
        ]);

        return { partnerId, lastMsg, unreadCount, partner };
      })
    );

    // Sort by latest message timestamp descending
    chatList.sort((a, b) => {
      const aTime = a.lastMsg?.createdAt || 0;
      const bTime = b.lastMsg?.createdAt || 0;
      return new Date(bTime) - new Date(aTime);
    });

    res.json(chatList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  reactToMessage,
  deleteMessage,
  editMessage,
  searchMessages,
  getNotifications,
  getChatList
};