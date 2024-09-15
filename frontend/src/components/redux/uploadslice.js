import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    status: false,
  },
  reducers: {
    setUploadStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setUploadStatus } = uploadSlice.actions;

export default uploadSlice.reducer;
