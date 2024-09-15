const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  resolutions: [
    {
      resolution: String,
      playlistUrl: String,
    },
  ],
  tags: [{ type: String }], // Each tag should be a string

  masterPlaylistUrl: String,
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    default: null,
  },
  uploadDate: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
