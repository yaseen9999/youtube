const Video = require("../models/video");
const comments = require("../models/comments");
const mongoose = require("mongoose");
exports.getcomments = async (req, res) => {
  try {
    console.log("api call fetching comments ");
    const { id } = req.params;
    console.log(id);
    const videoid = new mongoose.Types.ObjectId(id);
    const comment = await comments
      .find({ videoId: videoid })
      .populate("userid");
    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "Comments not found" });
    }
    console.log(comment);

    res.status(200).json(comment);
  } catch (error) {
    console.log(" error in adding comment ", error);
  }
};
