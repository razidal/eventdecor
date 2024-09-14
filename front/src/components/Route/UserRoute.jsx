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
  Toolbar
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
import { useMediaQuery } from "@mui/material";

const drawerWidth = 240;

const UserRoute = () => { 
  const [id, setId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User Menu
        </Typography>
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
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure AppBar is on top
        }}
      >
         {isMobile && (
        <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          
          <Typography variant="h6" noWrap component="div">
            User Dashboard
          </Typography>
        </Toolbar>)}
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
            backgroundColor: "#f5f5f5",
            position: { xs: "relative", sm: "fixed" },
          },
        }}
      >
        {drawer}
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
            element={<Navigate to="profile/" />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default UserRoute;
