const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const fs = require("fs");
const { storage } = require("../config/firebase");

exports.uploadToFirebase = async (filePath, firebasePath) => {
  const file = fs.readFileSync(filePath);
  const storageRef = ref(storage, firebasePath);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can add progress handling here if needed
      },
      (error) => {
        console.error(`Error uploading ${firebasePath}:`, error);
        reject(error);
      },
      async () => {
        try {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(fileUrl);
          resolve(fileUrl);
        } catch (error) {
          console.error(
            `Error getting download URL for ${firebasePath}:`,
            error
          );
          reject(error);
        }
      }
    );
  });
};
