import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";

const drawerWidth = 240;

const UserRoute = () => {
  const [id, setId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true); // State to manage drawer visibility
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("user");
    if (token) {
      setId(JSON.parse(token));
    }
  }, []);

  const handleLogout = () => {  // Handle logout action
    dispatch(logout()); 
    Cookies.remove("user"); // Remove user data from cookies
    Cookies.remove("cart"); // Remove cart data from cookies
    Cookies.remove("favorites"); // Remove favorites
    navigate("/"); // Redirect to home page
    window.location.reload(); // Reload the page to reflect the changes
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen); // Toggle the drawer open/close state
  };

  const menuItems = [
    { text: "Profile", icon: <PersonIcon />, path: "profile/" },
    { text: "Edit Profile", icon: <EditIcon />, path: "edit/" },
    { text: "Logout", icon: <LogoutIcon />, path: "/", action: handleLogout },
  ];

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Drawer
        variant="persistent"
        open={drawerOpen} // Control drawer visibility
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">User Menu</Typography>
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

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: drawerOpen ? `${drawerWidth}px` : "0", // Adjust main content width
          marginTop: "64px",
          transition: "margin-left 0.3s ease", // Smooth transition for drawer
        }}
      >
        <Routes>
          <Route path="profile/" element={<Profile id={id} />} />
          <Route path="edit/" element={<Edit id={id} />} />
          <Route path="/" element={<Navigate to="profile/" />} />
        </Routes>
      </Box>

      {/* Toggle Button (visible even when the drawer is closed) */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed", // Keep the button fixed
          top: "64px", // Align with the drawer
          left: drawerOpen ? `${drawerWidth + 10}px` : "10px", // Position relative to the drawer state
          transition: "left 0.3s ease", // Smooth transition for button position
          zIndex: 1300, // Ensure it stays on top
          backgroundColor: "white", // Optional: style the button background
          borderRadius: "50%",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.2)", // Optional: add shadow for better visibility
        }}
      >
        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
};

export default UserRoute;
