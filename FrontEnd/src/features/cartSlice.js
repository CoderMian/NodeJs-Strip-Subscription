import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  // Toolkit process reducer and action in one file..........
  reducers: {
    setCartItems: (state, action) => {
      const newItem = action.payload;

      const ItemIndex = state.cartItems.findIndex(
        (item) => item._id === newItem._id
      );
      if (ItemIndex >= 0) {
        state.cartItems[ItemIndex].quantity += 1;
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }
    },
    setTotal: (state) => {
      state.cartItems.map((item) => {
        state.total += item.quantity * item.price;
      });
    },
  },
});

export const { setCartItems, setTotal } = cartSlice.actions;

// in the slice file. For example: `useSelector((state: RootState) => state.user.value)`
export const selectCart = (state) => state.cart.cartItems;
export const totalPrice = (state) => state.cart.total;
export default cartSlice.reducer;
