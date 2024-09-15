import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "seacrh",
  initialState: {
    search: "",
  },
  reducers: {
    setsearchquery: (state, action) => {
      state.search = action.payload;
      localStorage.setItem("searchquery", action.payload);
    },
  },
});

export const { setsearchquery } = searchSlice.actions;

export default searchSlice.reducer;
