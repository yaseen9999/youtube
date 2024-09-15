const User = require("../models/user");
const bcrypt = require("bcrypt");

// Sign Up Controller
exports.signup = async (req, res) => {
  try {
    console.log("api call for sign up");

    const { firstName, lastName, email, password, profilePicture } = req.body;
    console.log(firstName, lastName, email, password, profilePicture);

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    //   // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new User({
      profilePicture,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    //   // Save user to the database
    await newuser.save();

    //   res.status(201).json({ msg: 'User registered successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
