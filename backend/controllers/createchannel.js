const mongoose = require("mongoose");
const Channel = require("../models/channel");
const User = require("../models/user");
const fs = require("fs");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");

const uploadFileToFirebase = async (filePath, destination) => {
  try {
    const storageRef = ref(storage, destination);
    const fileBuffer = fs.readFileSync(filePath);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw error;
  }
};

exports.createchannel = async (req, res) => {
  try {
    const { userid, name, description } = req.body;
    const file = req.file;

    if (!name || !description || !file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const avatarUrl = await uploadFileToFirebase(
      file.path,
      `avatars/${file.filename}`
    );

    const newChannel = new Channel({
      userid: userid,
      name: name,
      description: description,
      avatar: avatarUrl,
    });

    await newChannel.save();
    fs.unlinkSync(file.path);
    let user = await User.findById(userid);
    if (user) {
      user.channelId = newChannel._id;
    }
    user.save();
    res
      .status(201)
      .json({ message: "Channel created successfully", channel: newChannel });
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ message: "Server error" });
  }
};
