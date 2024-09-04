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
import Footer from "./components/footer/footer"
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      dispatch(login(JSON.parse(savedUser)));
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/VirtualEventDesigner"
          element={<VirtualEventDesigner />}
        />
      </Routes>
      <Footer /> 
    </Router>
  );
}

export default App;
