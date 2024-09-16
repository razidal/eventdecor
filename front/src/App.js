import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import VirtualEventDesigner from "./pages/VirtualEventDesigner/VirtualEventDesigner";
import { login } from "./redux/userSlice";
import Footer from "./components/footer/footer";
import { loadFavoritesFromCookies } from "./redux/favoritesSlice";
import "./App.css"; // Add your custom CSS file for background

function App() {
  const dispatch = useDispatch(); 
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get current route

  // Define dynamic backgrounds for each route
  const getBackgroundForRoute = (path) => {
    switch (path) {
      case "/":
        return "url('https://plus.unsplash.com/premium_photo-1683121484963-a491b935780b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
      case "/SignUp":
        return "url('https://images.unsplash.com/photo-1525663018617-37753d540108?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
      case "/SignIn":
        return "url('https://images.unsplash.com/photo-1525498128493-380d1990a112?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
      case "/Products":
        return "url('https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
      case "/Cart":
        return "url('https://images.unsplash.com/photo-1491006443886-dab2ec6d0bec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
      case "/VirtualEventDesigner":
        return "url('https://plus.unsplash.com/premium_photo-1713823799895-bddbbf670531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
      default:
        return "url('https://plus.unsplash.com/premium_photo-1677434181823-3bf32f0614ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8RWxlZ2FudCUyMGZsb3JhbCUyMGJhY2tncm91bmRzJTIwZm9yJTIwd2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D')";
    }
  };

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
    <div
      className="app-container"
      style={{ 
        backgroundImage: getBackgroundForRoute(location.pathname), 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh'
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route
            path="/Admin/*" 
            element={user && user.role === "Admin" ? <AdminRoute /> : <Navigate to="/SignIn" />}
          />
          <Route 
            path="/User/*" 
            element={user ? <UserRoute /> : <Navigate to="/SignIn" />}
          />
          <Route path="/Products" element={<Products />} />
          <Route
            path="/Cart"
            element={user ? <Cart /> : <Navigate to="/SignIn" />}
          />
          <Route
            path="/VirtualEventDesigner"
            element={<VirtualEventDesigner />}
          />
        </Routes>
        <Footer /> 
      </Router>
    </div>
  );
}

export default App;
