import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  allProduct: [],
  isAdd: false,
  selectedProduct: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  // Toolkit process reducer and action in one file..........
  reducers: {
    setAllProductStore: (state, action) => {
      state.allProduct = action.payload;
    },
    openAddProduct: (state) => {
      state.isAdd = true;
    },
    closeAddProduct: (state) => {
      state.isAdd = false;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      console.log("selected product from redux:", action.payload);
    },
  },
});

export const {
  setAllProductStore,
  openAddProduct,
  closeAddProduct,
  setSelectedProduct,
} = productSlice.actions;

// in the slice file. For example: `useSelector((state: RootState) => state.mail.value)`
export const allProductMongoose = (state) => state.product.allProduct;
export const openAddUpdate = (state) => state.product.isAdd;
export const updateProduct = (state) => state.product.selectedProduct;
export default productSlice.reducer;
