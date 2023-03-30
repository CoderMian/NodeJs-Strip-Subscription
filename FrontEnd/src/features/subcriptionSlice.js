import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  stripeSubscriptions: [],
};

export const subcriptionSlice = createSlice({
  name: "subcription",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  // Toolkit process reducer and action in one file..........
  reducers: {
    setAllSubcriptionStore: (state, action) => {
      state.stripeSubscriptions = action.payload;
    },
  },
});

export const { setAllSubcriptionStore } = subcriptionSlice.actions;

// in the slice file. For example: `useSelector((state: RootState) => state.mail.value)`
export const allSubData = (state) => state.subcriptions.stripeSubscriptions;
export default subcriptionSlice.reducer;
