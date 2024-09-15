const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subscribers: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

const channel = mongoose.model("Channel", channelSchema);

module.exports = channel;
