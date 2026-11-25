import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const item = state.items.find((product) => product._id === action.payload._id);
      if (item) item.quantity = (item.quantity || 1) + 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((product) => product._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((product) => product._id === action.payload.id);
      if (!item) return;
      if (action.payload.quantity < 1) {
        state.items = state.items.filter((product) => product._id !== action.payload.id);
      } else {
        item.quantity = action.payload.quantity;
      }
    },
  }
});

export const { setCart, addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
