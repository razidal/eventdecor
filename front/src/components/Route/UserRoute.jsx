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
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";


const drawerWidth = 240;

const UserRoute = () => { 
  const [id, setId] = useState("");
  const location = useLocation();
  const navigate=useNavigate()
  const dispatch=useDispatch()
  useEffect(() => { // Fetch user ID from cookies when the component mounts
    const token = Cookies.get("user"); // Replace 'userToken' with your actual cookie name
    if (token) { // If the token exists, parse it and set the user ID
      setId(JSON.parse(token)); // Assuming the token is a JSON string containing the user ID
    }
  }, []);
  const handleLogout = () => { // Handle logout action
    dispatch(logout()); 
    Cookies.remove("user");
    Cookies.remove("cart"); 
    Cookies.remove("favorites");
    navigate("/");
    window.location.reload();
    }
  const menuItems = [ // Define your menu items
    { text: "Profile", icon: <PersonIcon />, path: "profile/" },
    { text: "Edit Profile", icon: <EditIcon />, path: "edit/" },
    { text: "Logout", icon: <LogoutIcon />, path: "/" ,action: handleLogout }, // Attach the logout action
  ];

  return ( 
    <Box sx={{ display: "flex" }}>
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "flex", sm: "none" }, // Show only on small screens
        width: "100%",
        top: 0,
        left: 0
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setOpen(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">User Menu</Typography>
      </Toolbar>
    </AppBar>

    <Drawer
      variant="temporary" // Use temporary drawer for mobile
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        display: { xs: "block", sm: "none" }, // Show only on small screens
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: "64px", // Adjust if you have a fixed header
          height: "calc(100% - 64px)",
          backgroundColor: "#f5f5f5",
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

    <Drawer
      variant="permanent" // Use permanent drawer for larger screens
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: "64px",
          height: "calc(100% - 64px)",
          backgroundColor: "#f5f5f5",
          position: "fixed",
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
        marginLeft: { xs: 0, sm: `${drawerWidth}px` },
        marginTop: "64px",
      }}
    >
      <Routes>
        <Route path="profile/" element={<Profile id={id} />} />
        <Route path="edit/" element={<Edit id={id} />} />
        <Route
          path="/"
          element={
            <Navigate to="profile/" />
          }
        />
      </Routes>
    </Box>
  </Box>
  );
};

export default UserRoute;
