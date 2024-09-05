import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Popover,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Drawer,
  List,
  ListItem,
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/favoritesSlice";

const StyledAppBar = styled(AppBar)`
  background-color: #3f51b5;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 0 15px;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    padding: 10px;
    width: 300px;
  }
`;

const StyledIconButton = styled(IconButton)`
  color: white;
  background-color: white;
  position: relative; /* Ensure positioning of badge relative to the icon */
`;

const FavoriteCard = styled(Card)`
  display: flex;
  color: white;
  height: 40;
  margin-bottom: 10px;
`;

const FavoriteImage = styled(CardMedia)`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const FavoriteContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 400px;
  }
`;

const CartBadge = styled(Box)`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CartItem = styled(ListItem)`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const CartItemImage = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 15px;
`;

const CartItemDetails = styled(Box)`
  flex-grow: 1;
`;

const CartItemPrice = styled(Typography)`
  font-weight: bold;
  padding-right: 20px;
`;

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorElFavorite, setAnchorElFavorite] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const userCookies = Cookies.get("user");
  const userPermission = userCookies ? JSON.parse(userCookies).role : null;

  useEffect(() => {
    if (userCookies) {
      setIsLogin(true);
    }
  }, [userCookies]);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("user");
    Cookies.remove("cart");
    Cookies.remove("favorites");
    setIsLogin(false);
    navigate("/");
    window.location.reload();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleMenuClickFavorite = (event) => {
    if (isPopoverOpen) {
      setIsPopoverOpen(false);
    } else {
      setAnchorElFavorite(event.currentTarget);
      setIsPopoverOpen(true);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavMenuOpen = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setAnchorElNav(null);
  };
  
  const handleFavoriteToggle = (product) => {
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite._id === product._id
    );
    if (isAlreadyFavorite) {
      dispatch(removeFromFavorites(product._id));
    } else {
      dispatch(addToFavorites(product));
    }
  };
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {!isMobile ? (
              <>
                <StyledLink to="/">Home</StyledLink>
                <StyledLink to="/Products">Products</StyledLink>
                <StyledLink to="/VirtualEventDesigner">Event Visualizer</StyledLink>

                {userPermission === "Admin" && (
                  <>
                    <StyledLink to="/Admin/Management">Admin Panel</StyledLink>
                    <StyledLink to="/Admin/TableAdmin">Table Admin</StyledLink>
                  </>
                )}

                {userPermission === "user" && (
                  <>
                    <StyledLink to="/user/dashboard">Dashboard</StyledLink>
                    <StyledLink to="/user/orders">My Orders</StyledLink>
                  </>
                )}
              </>
            ) : (
              <>
                <IconButton color="inherit" onClick={handleNavMenuOpen}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleNavMenuClose}
                >
                  <MenuItem onClick={handleNavMenuClose} component={Link} to="/">
                    Home
                  </MenuItem>
                  <MenuItem onClick={handleNavMenuClose} component={Link} to="/Products">
                    Products
                  </MenuItem>
                  <MenuItem onClick={handleNavMenuClose} component={Link} to="/VirtualEventDesigner">
                    Event Visualizer
                  </MenuItem>
                  {userPermission === "Admin" && (
                    <>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/Admin/Management">
                        Admin Panel
                      </MenuItem>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/Admin/TableAdmin">
                        Table Admin
                      </MenuItem>
                    </>
                  )}
                  {userPermission === "user" && (
                    <>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/user/dashboard">
                        Dashboard
                      </MenuItem>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/user/orders">
                        My Orders
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}
          </Typography>

          <StyledIconButton color="inherit" onClick={toggleDrawer(true)}>
            <ShoppingCartIcon color="white" />
            {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
          </StyledIconButton>

          {isLogin ? (
            <>
              <StyledIconButton
                aria-haspopup="true"
                onClick={handleMenuClickFavorite}
              >
                <FavoriteIcon />
                {favorites.length > 0 && (
                  <CartBadge>{favorites.length}</CartBadge>
                )}
              </StyledIconButton>
              <StyledPopover
                open={isPopoverOpen}
                anchorEl={anchorElFavorite}
                onClose={() => setIsPopoverOpen(false)}
              >
                <Grid container spacing={2}>
                  {favorites.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <FavoriteCard>
                          <FavoriteImage
                            src={item.imageUrl || "https://via.placeholder.com/80"}
                            alt={item.name}
                          />
                          <FavoriteContent>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              ${item.price}
                            </Typography>
                            <IconButton onClick={() => handleFavoriteToggle(item)}>
                              <FavoriteIcon
                                color={
                                  favorites.some((fav) => fav._id === item._id) ? "error" : "disabled"
                                }
                              />
                            </IconButton>
                          </FavoriteContent>
                        </FavoriteCard>
                    </Grid>
                  ))}
                </Grid>
              </StyledPopover>
              <StyledIconButton color="inherit" onClick={handleClick}>
                <PersonIcon />
              </StyledIconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="user/profile"
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="user/edit">
                  Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit">
                <StyledLink to="/SignIn">Sign In</StyledLink>
              </Button>
              <Button color="inherit">
                <StyledLink to="/SignUp">Sign Up</StyledLink>
              </Button>
            </>
          )}
        </Toolbar>
        <StyledDrawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 400, padding: 2 }}
            role="presentation"
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6">Shopping Cart</Typography>
            <List>
              {cartItems.map((item, index) => (
                <React.Fragment key={index}>
                  <CartItem>
                    <CartItemImage
                      src={item.image || "/api/placeholder/60/60"}
                      alt={item.name}
                    />
                    <CartItemDetails>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </CartItemDetails>
                    <CartItemPrice>${item.price * item.quantity}</CartItemPrice>
                  </CartItem>
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              variant="contained"
              to="/Cart"
              component={Link}
              sx={{ marginTop: 2, width: "100%" }}
              onClick={toggleDrawer(false)}
            >
              Proceed to Payment
            </Button>
          </Box>
        </StyledDrawer>
      </StyledAppBar>
    </Box>
  );
};

export default Header;
