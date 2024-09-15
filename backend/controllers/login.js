const bcrypt = require("bcrypt");
const User = require("../models/user");
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("request receive ", email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const ispasscorrect = await bcrypt.compare(password, user.password);
    if (ispasscorrect) {
      console.log("passcorrect");
    }
    if (!ispasscorrect) {
      console.log("passincorrect");
    }
    if (user || ispasscorrect) {
      // const secret = crypto.randomBytes(32).toString('hex');
      res.status(201).json({ userId: user._id });
    }
  } catch (err) {
    console.error(err);
  }
};
