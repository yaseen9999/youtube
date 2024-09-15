const mongoose = require("mongoose");
const Video = require("../models/video");
const Channel = require("../models/channel"); // Ensure this model is imported

exports.fetchvideo = async (req, res) => {
  try {
    console.log("API call to fetch video");
    console.log(req.params);

    const { id } = req.params;
    console.log(id);

    // Convert the id to an ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Find the video by ObjectId and populate the `channelId` field
    const video = await Video.findById(objectId).populate("channelId");
    console.log("Populated Video:", video);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    if (error instanceof mongoose.Error.CastError) {
      // Handle invalid ObjectId errors
      return res.status(400).json({ message: "Invalid video ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
