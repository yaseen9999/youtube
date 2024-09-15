const Video = require("../models/video");
const comments = require("../models/comments");
exports.addcomment = async (req, res) => {
  try {
    console.log("api call for adding comment to  video");
    const { id } = req.params;
    console.log(id);
    const { userid, newcomment } = req.body;
    console.log(userid, newcomment);

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    console.log(video);
    const comment = new comments({
      userid,
      videoId: id,
      comment: newcomment,
    });
    const savedComment = await comment.save();
    console.log("Comment saved:", savedComment);
    if (!savedComment._id) {
      throw new Error("Comment _id not found after saving");
    }
    video.comments.push(savedComment._id);
    video.save();
    res.status(200).json(comment);
  } catch (error) {
    console.log(" error in adding comment ", error);
  }
};
