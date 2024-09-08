import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import favprutesReducer from "./favoritesSlice";
import cartPersistenceMiddleware from "./cartPersistenceMiddleware";

const store = configureStore({ // configureStore is a function that takes an object as an argument
  reducer: {
    cart: cartReducer,
    user: userReducer,
    favorites: favprutesReducer,
  },
  middleware: (getDefaultMiddleware) => // getDefaultMiddleware is a function that returns an array of middleware
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
});

export default store;
