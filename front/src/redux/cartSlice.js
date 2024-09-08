import { createSlice, configureStore } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Helper function to calculate total amount
const calculateTotalAmount = (items) => { // Calculate total amount based on items
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Attempt to initialize cart from cookies or set to initial state
const initialState = {
  items: Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [], // Initialize items from cookies or empty array
  totalAmount: 0,
};

// Initialize totalAmount based on items
initialState.totalAmount = calculateTotalAmount(initialState.items); // Calculate total amount based on items
const cartSlice = createSlice({ // Create cart slice 
  name: "cart",
  initialState,
  reducers: {
    // Action to add an item to the cart
    addItem: (state, action) => {
      const existingIndex = state.items.findIndex( // Check if item already exists in cart
        (item) => item.id === action.payload.id // Compare item IDs
      );
      if (existingIndex >= 0) { // If item already exists, increase quantity
        state.items[existingIndex].quantity += 1;
      } else { // If item does not exist, add it to the cart
        state.items.push({ ...action.payload, quantity: 1 }); 
      }

      state.totalAmount = calculateTotalAmount(state.items); // Update total amount
    },

    // Action to edit an item's quantity in the cart
    editItem: (state, action) => {
      const index = state.items.findIndex( // Find the index of the item in the cart
        (item) => item.id === action.payload.id
      );
      if (index !== -1) { // If item exists, update quantity
        state.items[index].quantity = action.payload.quantity;
        state.totalAmount = calculateTotalAmount(state.items);
      }
    },

    // Action to remove an item from the cart
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload); // Filter out the item to be removed
      state.totalAmount = calculateTotalAmount(state.items);
    },

    // Action to clear the cart
    clearCart: (state) => { 
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

// Middleware for syncing cart state with cookies
export const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("cart/")) {  // If action is related to cart
    const nextState = store.getState();  // Get the next state of the store
    Cookies.set("cart", JSON.stringify(nextState.cart.items)); // Update cart in cookies
  }
  return result;
};
// Export actions for use in components
export const { addItem, removeItem, editItem, clearCart } = cartSlice.actions;

// Export the reducer as default export
export default cartSlice.reducer;
