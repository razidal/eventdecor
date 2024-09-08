import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  isAuthenticating: false,
};

const userSlice = createSlice({ // Define a userSlice using createSlice
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => { // Define a login reducer
      state.user = action.payload; // Update the user state with the payload
      state.isAuthenticating = true;  // Set isAuthenticating to true
      Cookies.set("user", JSON.stringify(action.payload), {
        expires: 7, 
        path: "/", 
      }); // Set a 7-day expiration (adjust as needed)
    },
    logout: (state) => { // Define a logout reducer
      state.user = null;
      state.isAuthenticating = false;
      Cookies.remove("user"); // Remove the user cookie
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
