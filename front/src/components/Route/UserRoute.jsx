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
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
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
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {   // Apply styles to the drawer paper
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px",
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
        {menuItems.map((item, index) => ( // Map through the menu items and create ListItems
            <ListItem
              button
              key={item.text}
              component={item.action ? "div" : Link} // Use "div" if there's an action, otherwise Link
              to={item.path}
              onClick={item.action ? item.action : null} // Attach the action if it exists
              selected={location.pathname.includes(item.path)} // Highlight the selected item
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.light", // Apply a background color when selected
                  "&:hover": {
                    backgroundColor: "primary.light", // Keep the background color on hover
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
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust the main content width based on the drawer width

          marginLeft: ``,
          marginTop: "64px",
        }}
      >
        <Routes>
          <Route path="profile/" element={<Profile id={id} />} /> 
          <Route path="edit/" element={<Edit id={id} />} />
          <Route
            path="/"
            element={
              <Navigate
                to="profile
          /"
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default UserRoute;
