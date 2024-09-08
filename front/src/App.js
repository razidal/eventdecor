import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import AdminRoute from "./components/Route/AdminRoute";
import UserRoute from "./components/Route/UserRoute";
import Management from "./pages/admin/management/Management";
import Products from "./pages/products/Products";
import Cart from "./pages/cart/Cart";
import Favorites from "./pages/favorite/Favorites";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import VirtualEventDesigner from "./pages/VirtualEventDesigner/VirtualEventDesigner";
import { login } from "./redux/userSlice";
import Footer from "./components/footer/footer";
import { loadFavoritesFromCookies } from "./redux/favoritesSlice";

function App() {
  const dispatch = useDispatch(); 
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites from cookies when the app initializes
    dispatch(loadFavoritesFromCookies());
  }, [dispatch]);

  useEffect(() => { // Load user data from cookies when the app initializes
    const savedUser = Cookies.get("user");
    if (savedUser) { // If user data exists in cookies, dispatch the login action to update the Redux store
      dispatch(login(JSON.parse(savedUser)));
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) { // Show a loading indicator while the app is initializing
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/SignUp" element={<SignUp />} /> {/* Sign up page */}
        <Route path="/SignIn" element={<SignIn />} /> {/* Sign in page */}
        <Route
          path="/Admin/*"   // Admin route, only accessible to users with the "Admin" role
          element={user && user.role === "Admin" ? <AdminRoute /> : <Navigate to="/SignIn" />}
        />
        
        <Route 
          path="/User/*" // User route, only accessible to authenticated users
          element={user ? <UserRoute /> : <Navigate to="/SignIn" />}
        />
        <Route path="/Products" element={<Products />} />
        <Route
          path="/Cart" // Cart page, only accessible to authenticated users
          element={user ? <Cart /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/VirtualEventDesigner" // Virtual event designer page, only accessible to authenticated users
          element={<VirtualEventDesigner />}
        />
      </Routes>
      <Footer /> 
    </Router>
  );
}

export default App;
