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
const AdminRoute = () => {
  const token = Cookies.get("user");

  return (
    <div>
      <Routes>
        <Route path="/Users" element={<Users/>}/> 
        <Route path="/Management" element={<Management />} />
        <Route path="/TableAdmin" element={<TableAdmin />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </div>
  );
};

export default AdminRoute;
