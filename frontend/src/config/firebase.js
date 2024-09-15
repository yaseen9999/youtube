import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAB_kitY_ijTuX2KK5BIoJ5L3l9Gy4hWqk",
  authDomain: "socialapp-6a7cd.firebaseapp.com",
  projectId: "socialapp-6a7cd",
  storageBucket: "socialapp-6a7cd.appspot.com",
  messagingSenderId: "687619765421",
  appId: "1:687619765421:web:24fb700d98a5a061620224",
  measurementId: "G-15LM9HTDD3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
