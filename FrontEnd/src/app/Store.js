import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice";
import userReducer from "../features/userSlice";
import subscriptionReducer from "../features/subcriptionSlice";
import cartSliceReducer from "../features/cartSlice";
export const Store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    subcriptions: subscriptionReducer,
    cart: cartSliceReducer,
  },
});
