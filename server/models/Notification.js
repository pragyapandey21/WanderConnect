const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message:   { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    type:      { type: String, enum: ["message", "reaction"], default: "message" },
    read:      { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);