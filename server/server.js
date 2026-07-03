const dotenv = require("dotenv");
const app    = require("./app");
const connectDB = require("./config/db");
const Group = require("./models/Group");
const GroupMessage = require("./models/GroupMessage");

const http = require("http");
const { Server } = require("socket.io");
const { setIO }  = require("./socket");
const { ExpressPeerServer } = require("./peerServer");

dotenv.config();
connectDB();

const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

const peerServer = ExpressPeerServer(server, { debug: true });

setIO(io);
app.use("/peerjs", peerServer);

// ── Online users map: userId → socketId ──────────────────────────────────────
// Exported so messageController can check if a user is online for delivery ack.
const onlineUsers = {};
module.exports.onlineUsers = onlineUsers;

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ── JOIN ────────────────────────────────────────────────────────────────────
  socket.on("join", (userId) => {
    socket.join(userId);
    onlineUsers[userId] = socket.id;
    console.log(`${userId} joined room`);

    // Broadcast updated online list to everyone
    io.emit("online_users", Object.keys(onlineUsers));
  });

  // ── TYPING ─────────────────────────────────────────────────────────────────
  socket.on("typing", ({ sender, receiver }) => {
    io.to(receiver).emit("typing", sender);
  });

  socket.on("stop_typing", ({ receiver }) => {
    io.to(receiver).emit("stop_typing");
  });

  // ── SEEN (kept for compatibility — controller now emits this server-side) ──
  // Client no longer needs to emit messages_seen manually;
  // the PUT /api/messages/read/:id HTTP call triggers it from the controller.
  // This handler is kept so older clients don't break.
  socket.on("messages_seen", ({ sender }) => {
    io.to(sender).emit("messages_seen", { by: sender, conversationWith: sender });
  });

  // ── DELIVERY ACK ────────────────────────────────────────────────────────────
  // Receiver emits this when they get a message and their tab is open.
  socket.on("message_delivered_ack", async ({ messageId, senderId }) => {
    try {
      const Message = require("./models/Message");
      await Message.findByIdAndUpdate(messageId, { delivered: true });
      io.to(senderId).emit("message_delivered", { messageId, delivered: true });
    } catch (e) {
      console.error("delivery ack error", e.message);
    }
  });

  // ── CALLS ──────────────────────────────────────────────────────────────────
  socket.on("call-user", ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit("incoming-call", { signal: signalData, from });
  });

  socket.on("accept-call", ({ to, signal }) => {
    io.to(to).emit("call-accepted", signal);
  });

  socket.on("end-call", ({ to }) => {
    io.to(to).emit("call-ended");
  });
  // ── JOIN GROUP ───────────────────────────────────────────
socket.on("join-group", async (groupId) => {
  try {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  } catch (error) {
    console.log(error.message);
  }
});
// ── GROUP TYPING ─────────────────────────────────────────
socket.on("group-typing", ({ groupId, username }) => {
  console.log(`${username} is typing in ${groupId}`);
  socket.to(groupId).emit("group-typing", username);
});

socket.on("group-stop-typing", ({ groupId }) => {
  socket.to(groupId).emit("group-stop-typing");
});

// ── SEND GROUP MESSAGE ───────────────────────────────────
socket.on("send-group-message", async (data) => {
  try {
    const { groupId, senderId, text } = data;

    const group = await Group.findById(groupId);

    if (!group) return;

    const message = await GroupMessage.create({
      group: groupId,
      sender: senderId,
      text,
      readBy: [senderId],
    });

    const populatedMessage = await GroupMessage.findById(message._id)
      .populate("sender", "username profilePic");

    io.to(groupId).emit("receive-group-message", populatedMessage);

  } catch (error) {
    console.log(error.message);
  }
});

  // ── DISCONNECT ─────────────────────────────────────────────────────────────
  socket.on("disconnect", async () => {
    let disconnectedUserId = null;

    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        disconnectedUserId = userId;
        delete onlineUsers[userId];
        break;
      }
    }

    // Persist lastSeen timestamp to DB
    if (disconnectedUserId) {
      try {
        // Update lastSeen on User model (requires lastSeen field on your User schema)
        const User = require("./models/User");
        await User.findByIdAndUpdate(disconnectedUserId, { lastSeen: new Date() });
        // Broadcast lastSeen update so other clients can display "Last seen at …"
        io.emit("user_last_seen", { userId: disconnectedUserId, lastSeen: new Date() });
      } catch (e) {
        // If User model doesn't have lastSeen yet, this silently skips
        console.warn("lastSeen update skipped:", e.message);
      }
    }

    io.emit("online_users", Object.keys(onlineUsers));
    console.log("Socket disconnected:", socket.id);
  });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});