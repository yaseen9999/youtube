import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userid: localStorage.getItem("userid"),
  },
  reducers: {
    setUserid: (state, action) => {
      state.userid = action.payload;
      localStorage.setItem("userid", action.payload);
    },
    clearUserid: (state) => {
      state.userid = null;
    },
  },
});

export const { setUserid, clearUserid } = userSlice.actions;

export default userSlice.reducer;
