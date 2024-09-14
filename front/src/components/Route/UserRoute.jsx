import React, { useState, useEffect } from "react";
import Edit from "../../pages/user/edit/Edit";
import Profile from "../../pages/user/profile/Profile";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import { Route, Routes, Navigate, Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const UserRoute = () => {
  const [id, setId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = Cookies.get("user");
    if (token) {
      setId(JSON.parse(token));
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("user");
    Cookies.remove("cart");
    Cookies.remove("favorites");
    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    { text: "Profile", icon: <PersonIcon />, path: "profile/" },
    { text: "Edit Profile", icon: <EditIcon />, path: "edit/" },
    { text: "Logout", icon: <LogoutIcon />, path: "/", action: handleLogout },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: `${drawerWidth}px` },
        }}
      >
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: { xs: "100%", sm: drawerWidth },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: drawerWidth },
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
            backgroundColor: "#f5f5f5",
            position: { xs: "relative", sm: "fixed" },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Menu
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              component={item.action ? "div" : Link}
              to={item.path}
              onClick={item.action ? item.action : null}
              selected={location.pathname.includes(item.path)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: `${drawerWidth}px` },
          mt: "64px", // Ensure the main content starts below the header
        }}
      >
        <Typography variant="h4" gutterBottom>
          User Dashboard
        </Typography>
        <Routes>
          <Route path="profile/" element={<Profile id={id} />} />
          <Route path="edit/" element={<Edit id={id} />} />
          <Route path="/" element={<Navigate to="profile/" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default UserRoute;
