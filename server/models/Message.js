const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  emoji: { type: String, required: true }
}, { _id: false });

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    // DELIVERY STATUS: sent → delivered → read
    delivered: { type: Boolean, default: false },
    read:      { type: Boolean, default: false },

    // REACTIONS: [{ userId, emoji }]
    reactions: { type: [reactionSchema], default: [] },

    // DELETE FOR ME / DELETE FOR EVERYONE
    // stores user IDs for whom this message is hidden
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // true = deleted for everyone, text replaced with placeholder
    deletedForEveryone: { type: Boolean, default: false },

    // REPLY TO MESSAGE
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    // EDIT MESSAGE
    edited: { type: Boolean, default: false },

    // NOTIFICATION: whether sender's notification has been created
    notified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);