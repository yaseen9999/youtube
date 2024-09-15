const User = require("../models/user");
const Channel = require("../models/channel");
const mongoose = require("mongoose");
exports.subscribe = async (req, res) => {
  console.log("api call to subccribe a channel");
  console.log(req.params);
  const { id, userid } = req.body;
  console.log(id, userid);
  try {
    const result = await Channel.aggregate([
      {
        $match: {
          videos: new mongoose.Types.ObjectId(id), // Match channel that contains this videoId in the videos array
        },
      },
    ]);
    console.log(result);
    const channelId = result[0]._id;
    if (result) {
      const updatedChannel = await Channel.findByIdAndUpdate(
        channelId,
        { $inc: { subscribers: 1 } },
        { new: true } // Return the updated document
      );
      console.log(updatedChannel);
      const newsubscriber = updatedChannel.subscribers;
      req.io.emit("updatedsubscribers", {
        updatedsubscriber: newsubscriber,
        videoId: id,
      });
    }
    const user = await User.findById(userid);
    console.log(user);
    if (user && user.subscribedChannels !== channelId) {
      user.subscribedChannels.push(channelId);
    } else console.log("already subscribed");
    user.save();
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Channel not found for this video." });
    }
  } catch (error) {
    console.error("Error during subscription:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
