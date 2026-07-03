const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      expires: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Story", storySchema);