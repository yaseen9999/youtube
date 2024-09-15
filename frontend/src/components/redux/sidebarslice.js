import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    status: false,
  },
  reducers: {
    setsidebarstatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setsidebarstatus } = sidebarSlice.actions;

export default sidebarSlice.reducer;
