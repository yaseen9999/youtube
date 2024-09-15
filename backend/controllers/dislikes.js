const Video = require("../models/video");
exports.dislikes = async (req, res) => {
  console.log("api call to dislike a  video");
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const video = await Video.findById({ _id: id });
  console.log(video);
  video.dislikes = video.dislikes + 1;

  await video.save();
  req.io.emit("dislikeupdate", { videoId: id, dislikes: video.dislikes });
  console.log("Updated Video:", video);

  res.status(200).json(video);
};
