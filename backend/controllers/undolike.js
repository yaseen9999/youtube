const Video = require("../models/video");
exports.notlike = async (req, res, io) => {
  console.log("api call to undo like a  video");
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const video = await Video.findById({ _id: id });
  console.log(video);
  video.likes = video.likes - 1;

  await video.save();
  req.io.emit("likeupdate", { videoId: id, likes: video.likes });
  console.log("Updated Video:", video);
  res.status(200).json(video);
};
