import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../redux/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/favoritesSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CustomCarousel from "./CustomCarousel.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [loading, setLoading] = useState(true); // Loading state
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => { // fetch products from the backend
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get("https://backstore-iqcq.onrender.com/products/all", {
        timeout: 5000,
      });
      setProducts(response.data.decorations.slice(0, 3)); //only show 3 products
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching products:", error);
    }finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const addToCart = (product) => { // add product to the cart
    dispatch( 
      addItem({ // dispatch the addItem action with the product details
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
      })
    );
    setSnackbarMessage(`${product.name} added to cart!`); //show customer message
    setSnackbarOpen(true); 
  };

  const handleFavoriteToggle = (product) => { // toggle favorite status of a product
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite._id === product._id 
    ); 
    if (isAlreadyFavorite) { // if the product is already in favorites, remove it
      dispatch(removeFromFavorites(product._id));
      setSnackbarMessage(`${product.name} removed from favorites!`); //show customer message
    } else {
      dispatch(addToFavorites(product)); // otherwise, add it to favorites
      setSnackbarMessage(`${product.name} added to favorites!`); 
    }
    setSnackbarOpen(true);
  };

  return (
    <div>
      <CustomCarousel/>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Featured Products 
        </Typography>
        {loading ? ( // Show loading spinner while fetching data
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <CircularProgress />
            </div>
          ) : (
        <Grid container spacing={4}>
          {products.map((product) => ( // map through the products and display them
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="150"
                  image={product.imageUrl}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                  </Typography>
                  <IconButton
                    onClick={() => handleFavoriteToggle(product)} 
                    sx={{ 
                      color: favorites.some((fav) => fav._id === product._id) // check if the product is in favorites and change the icon color accordingly
                        ? "error.main"
                        : "inherit",
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
          )}
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500} // Snackbar duration
        onClose={() => setSnackbarOpen(false)} // Handle snackbar close
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)} // Handle snackbar close
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </div>
  );
};

export default Home;
