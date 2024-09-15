const User = require("../models/user");
exports.save = async (req, res, io) => {
  try {
    console.log("api call to save a  video");
    console.log(req.params);
    const { id } = req.params;
    console.log(id);
    const { userid } = req.body;
    console.log(userid);

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);

    user.watchlater.push(id);
    await user.save();
    req.io.emit("save", { message: "Save to watch later" });
  } catch (error) {
    console.log("error in saving video", error);
  }
};
