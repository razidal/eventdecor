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

// Styled components for custom styling
const StyledAppBar = styled(AppBar)`
  background-color: #1976d2;
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

  const userCookies = Cookies.get("user"); // Get user data from cookies
  const userPermission = userCookies ? JSON.parse(userCookies).role : null; // Extract user permission from cookies

  useEffect(() => { // Check login status based on user cookies
    if (userCookies) {
      setIsLogin(true);
    }
  }, [userCookies]); // Run the effect whenever userCookies change

  const handleLogout = () => { // Handle logout action
    dispatch(logout());
    Cookies.remove("user"); // Remove user data from cookies
    Cookies.remove("cart"); // Remove cart data from cookies
    Cookies.remove("favorites"); // Remove favorites data from cookies
    setIsLogin(false); // Update login status
    navigate("/"); // Redirect to home page
    window.location.reload(); // Reload the page to reflect the changes
  };

  const toggleDrawer = (open) => (event) => { // Toggle drawer open/close
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) { // Ignore if the event is a keyboard event and the key is Tab or Shift
      return;
    }
    setIsDrawerOpen(open); // Set drawer open/close state
  };

  const handleMenuClickFavorite = (event) => { // Handle favorite menu click
    if (isPopoverOpen) { // If the popover is open, close it and reset the anchor element
      setIsPopoverOpen(false);
    } else {
      setAnchorElFavorite(event.currentTarget); // Set the anchor element to the current target
      setIsPopoverOpen(true);  // Open the popover
    }
  };

  const handleClick = (event) => { // Handle user menu click
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => { // Close the user menu
    setAnchorEl(null); 
  };

  const handleNavMenuOpen = (event) => { // Handle mobile menu open
    setAnchorElNav(event.currentTarget);  // Set the anchor element to the current target
  };

  const handleNavMenuClose = () => { // Close the mobile menu
    setAnchorElNav(null); // Reset the anchor element
  };
  
  const handleFavoriteToggle = (product) => { // Handle favorite toggle for a product
    const isAlreadyFavorite = favorites.some( // Check if the product is already in favorites
      (favorite) => favorite._id === product._id // Compare product IDs
    );
    if (isAlreadyFavorite) { // If the product is already in favorites, remove it
      dispatch(removeFromFavorites(product._id)); // Dispatch the removeFromFavorites action with the product ID
    } else { // If the product is not in favorites, add it
      dispatch(addToFavorites(product)); // Dispatch the addToFavorites action with the product object
    }
  };
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {!isMobile ? ( // If not on mobile, display the logo and name
              <>
                <StyledLink to="/">Home</StyledLink>
                <StyledLink to="/Products">Products</StyledLink>
                <StyledLink to="/VirtualEventDesigner">Event Visualizer</StyledLink>

                {userPermission === "Admin" && ( // If the user is an admin, display admin links
                  <>
                    <StyledLink to="/Admin/Management">Admin Panel</StyledLink>
                    <StyledLink to="/Admin/TableAdmin">Table Admin</StyledLink>
                    <StyledLink to="/Admin/Users">Users</StyledLink>
                  </>
                )}

                {userPermission === "user" && ( // If the user is a regular user, display user links
                  <>
                    <StyledLink to="/user/dashboard">Dashboard</StyledLink>
                    <StyledLink to="/user/orders">My Orders</StyledLink>
                  </>
                )}
              </>
            ) : ( 
              <> 
                <IconButton color="inherit" onClick={handleNavMenuOpen}> {/* Display the mobile menu button */} 
                  <MenuIcon /> 
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)} 
                  onClose={handleNavMenuClose}  // Close the mobile menu when an item is selected or the menu is closed
                >
                  <MenuItem onClick={handleNavMenuClose} component={Link} to="/"> {/* Display the mobile menu items */} 
                    Home
                  </MenuItem>
                  <MenuItem onClick={handleNavMenuClose} component={Link} to="/Products"> {/* Display the mobile menu items */}  
                    Products
                  </MenuItem>
                  <MenuItem onClick={handleNavMenuClose} component={Link} to="/VirtualEventDesigner"> {/* Display the mobile menu items */}  
                    Event Visualizer
                  </MenuItem>
                  {userPermission === "Admin" && ( // If the user is an admin, display admin links in the mobile menu
                    <>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/Admin/Management">
                        Admin Panel
                      </MenuItem>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/Admin/TableAdmin">
                        Table Admin
                      </MenuItem>
                      <MenuItem onClick={handleNavMenuClose} component={Link} to="/Admin/Users">
                        Users
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}
          </Typography>

          <StyledIconButton color="inherit" onClick={toggleDrawer(true)}> {/* Display the cart button */}  
            <ShoppingCartIcon color="white" />
            {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>} {/* Display the cart badge if there are items in the cart */}  
          </StyledIconButton>

          {isLogin ? ( // If the user is logged in, display the user menu and logout button
            <>
              <StyledIconButton
                aria-haspopup="true"
                onClick={handleMenuClickFavorite} // Open the favorite menu when clicked
              >
                <FavoriteIcon />
                {favorites.length > 0 && ( // Display the favorite badge if there are favorite items
                  <CartBadge>{favorites.length}</CartBadge> 
                )}
              </StyledIconButton> 
              <StyledPopover
                open={isPopoverOpen}
                anchorEl={anchorElFavorite}
                onClose={() => setIsPopoverOpen(false)} // Close the favorite menu when clicked outside of it
              >
                <Grid container spacing={2}>
                  {favorites.map((item, index) => ( // Map through the favorite items and display them in the favorite menu
                    <Grid item xs={12} key={index}>
                      <FavoriteCard>
                         <FavoriteImage
                            component="img"
                            image={item.imageUrl && item.imageUrl !== "null" ? item.imageUrl : "https://via.placeholder.com/80"} // Display the item image or a placeholder image if there is no image url
                            alt={item.name}
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: 'contain', //'contain' to avoid cropping, or 'cover' for a filled image
                            }}
                          />
                        <FavoriteContent>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            ${item.price}
                          </Typography>
                          <IconButton onClick={() => handleFavoriteToggle(item)}>
                            <FavoriteIcon
                              color={
                                favorites.some((fav) => fav._id === item._id) ? "error" : "disabled" // Change the favorite icon color based on whether the item is in favorites or not
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
          PaperProps={{
            sx: {
              width: isMobile ? '70vw' : '400px', // 80% width on mobile, 400px on larger screens
              maxWidth: '80vw', // Limits the maximum width to 80% on mobile
              height: '100vh', // Full height but not fullscreen
              overflowX: 'hidden', // Prevents horizontal scrolling
            }
          }}
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
              {cartItems.map((item, index) => ( // Map through the cart items and display them in the cart drawer
                <React.Fragment key={index}>
                  <CartItem>
                    <CartItemImage
                      src={item.image || "/api/placeholder/60/60"} // Display the item image or a placeholder image if there is no image url
                      alt={item.name}
                    />
                    <CartItemDetails>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </CartItemDetails>
                    <CartItemPrice>${item.price * item.quantity}</CartItemPrice> {/* Display the item price */} 
                  </CartItem>
                  {index < cartItems.length - 1 && <Divider />} {/* Display a divider between cart items */}  
                </React.Fragment>
              ))}
            </List>
            <Button
              variant="contained"
              to="/Cart"
              component={Link}
              sx={{ marginTop: 2, width:"100%" }}
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
