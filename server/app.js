const express = require("express");
const authRoutes = require("./routes/authRoutes");
const app = express();
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const storyRoutes = require("./routes/storyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const groupRoutes = require("./routes/groupRoutes");
const groupMessageRoutes = require("./routes/groupMessageRoutes");
const destinationRoutes = require("./routes/destinationRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-messages", groupMessageRoutes);
app.use("/api/destinations", destinationRoutes);

app.get("/", (req, res) => {
  res.send("WanderConnect API Running 🚀");
});

module.exports = app;