import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loginUser: {
    name: null,
    email: null,
    phone: null,
    token: null,
    customerId: null,
    image: null,
    video: null,
    isVerified: false,
    isLogin: false,
    subscriptionStatus: null,
  },
  forgetPassword: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  // Toolkit process reducer and action in one file..........
  reducers: {
    signin: (state, action) => {
      state.loginUser = action.payload;
    },
    signout: (state) => {
      // state.loginUser = action.payload;
      state.loginUser = {
        name: null,
        email: null,
        phone: null,
        token: null,
        customerId: null,
        image: null,
        video: null,
        isVerified: false,
        isLogin: false,
      };
    },
    toogleForget: (state) => {
      state.forgetPassword = state.forgetPassword ? false : true;
    },
  },
});

export const { signin, signout, setname, toogleForget } = userSlice.actions;

// in the slice file. For example: `useSelector((state: RootState) => state.user.value)`
export const selectUser = (state) => state.user.loginUser;
export const showHidePopup = (state) => state.user.forgetPassword;
export default userSlice.reducer;
