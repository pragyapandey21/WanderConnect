const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "India",
    },

    image: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    categories: [
      {
        type: String,
      },
    ],
    heroImage: {
  type: String,
  default: "",
},

shortDescription: {
  type: String,
  default: "",
},

bestTimeToVisit: {
  type: String,
  default: "",
},

estimatedBudget: {
  type: String,
  default: "",
},

rating: {
  type: Number,
  default: 4.5,
},
travelers: {
  type: Number,
  default: 0,
},

open: {
  type: Number,
  default: 0,
},

hotels: {
  type: Number,
  default: 0,
},

events: {
  type: Number,
  default: 0,
},
mapTop: {
  type: Number,
  required: true,
},

mapLeft: {
  type: Number,
  required: true,
},

pinColor: {
  type: String,
  default: "#a855f7",
},
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Destination", destinationSchema);