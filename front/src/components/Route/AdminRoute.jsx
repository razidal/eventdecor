import React, { useEffect } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import Edit from "../../pages/admin/management/edit/Edit";
import Header from "../header/Header";
import Profile from "../../pages/user/profile/Profile";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Users from "../../pages/users/Users"
import Management from "../../pages/admin/management/Management";
import TableAdmin from "../../pages/admin/management/TableAdmin";
import Cookies from "js-cookie";

// Define the AdminRoute component
const AdminRoute = () => { 
  const token = Cookies.get("user"); 

  return (
    <div>
      <Routes>
        <Route path="/Users" element={<Users/>}/> {/* Route for Users component */}
        <Route path="/Management" element={<Management />} /> {/* Route for Management component */}
        <Route path="/TableAdmin" element={<TableAdmin />} /> {/* Route for TableAdmin component */}
        <Route path="/edit" element={<Edit />} /> {/* Route for Edit component */}
      </Routes>
    </div>
  );
};

export default AdminRoute;
