// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import searchReducer from "./searchslice";
import uploadReducer from "./uploadslice";
import sidebarReducer from "./sidebarslice";

const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    upload: uploadReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
