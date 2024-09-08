// cartPersistenceMiddleware.js
import Cookies from "js-cookie";

const cartPersistenceMiddleware = (store) => (next) => (action) => { // This is a middleware factory, which takes the store as an argument and returns a middleware.
  const result = next(action);
  if (action.type.startsWith("cart/")) { // Check if the action is related to the cart slice
    const newState = store.getState().cart; // Get the new state of the cart slice
    Cookies.set("cart", JSON.stringify(newState.items), { expires: 7 }); // Save the cart items to a cookie with a 7-day expiration date
  }
  return result;
};

export default cartPersistenceMiddleware;
