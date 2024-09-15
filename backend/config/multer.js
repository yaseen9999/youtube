const multer = require("multer");
const path = require("path");
exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination for storing uploaded files
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    // Set the filename to be unique by appending a timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
