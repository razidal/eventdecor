import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isAuthenticating);

  return isLogin ? children : <Navigate to="/SignIn" />;
};

export default ProtectedRoute;
