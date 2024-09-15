const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Video",
  },
  comment: {
    type: String,
  },
});

const comments = mongoose.model("Comments", commentSchema);

module.exports = comments;
