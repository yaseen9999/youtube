const Video = require("../models/video");
exports.quality = async (req, res) => {
  console.log("api call to quality video");
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const video = await Video.findById({ _id: id });
  console.log(video);
  res.status(200).json(video);
};
