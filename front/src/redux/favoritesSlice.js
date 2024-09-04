import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Add an item to favorites
    addToFavorites: (state, action) => {
      const exists = state.favorites.some(
        (item) => item._id === action.payload._id
      );
      console.log(exists);
      if (!exists) {
        state.favorites.push(action.payload); // Ensure action.payload contains the image property
        Cookies.set("favorites", JSON.stringify(state.favorites), {
          expires: 7,
        });
      }
    },

    // Remove an item from favorites
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(
        (item) => item._id !== action.payload
      );
      // Update cookies with all item details after removing an item
      Cookies.set("favorites", JSON.stringify(state.favorites), {
        expires: 7,
      });
    },

    // Optionally, load favorites from cookies on app initialization
    loadFavoritesFromCookies: (state) => {
      const favoritesFromCookies = Cookies.get("favorites");
      try {
        if (favoritesFromCookies) {
          state.favorites = JSON.parse(favoritesFromCookies);
        }
      } catch (error) {
        console.error("Error loading favorites from cookies:", error);
        // Optionally reset the cookie if it's corrupted
        Cookies.set("favorites", JSON.stringify([]), { expires: 7 });
      }
    },
  },
});

export const { addToFavorites, removeFromFavorites, loadFavoritesFromCookies } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
