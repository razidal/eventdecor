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
  IconButton
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";

const drawerWidth = 240;

const UserRoute = () => {
  const [id, setId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true); // State to manage drawer open/close
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch user ID from cookies when the component mounts
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
      <Drawer
        variant="persistent"
        open={drawerOpen}
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Menu
          </Typography>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` },
          marginTop: "64px",
        }}
      >
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
