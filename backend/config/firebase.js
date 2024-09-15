const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5oVNBSS4WTPDRaH7_KaWZl50jVdnfa-w",
  authDomain: "todo-4d547.firebaseapp.com",
  databaseURL: "https://todo-4d547-default-rtdb.firebaseio.com",
  projectId: "todo-4d547",
  storageBucket: "todo-4d547.appspot.com",
  messagingSenderId: "357878115988",
  appId: "1:357878115988:web:3bf0356aa148328c0e4e81",
  measurementId: "G-DMTBPZ0MPQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
