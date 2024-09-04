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
} from "@mui/material";
import styled from "styled-components";
import back from "./back.jpg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../redux/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/favoritesSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CustomCarousel from "./CustomCarousel.jsx";

const Banner = styled.div`
  background-color: #3f51b5;
  color: white;
  text-align: center;
  padding: 16px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background-image: url(${back});
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("https://backstore-iqcq.onrender.com/products/all", {
        timeout: 5000,
      });
      setProducts(response.data.decorations.slice(0, 3)); //only show 3 products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product) => {
    dispatch(
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
      })
    );
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

  return (
    <div>
      <Banner>
        <Typography variant="h3">
          🎉 Welcome to our Event Decoration! Enjoy our special offers!
          🎉
        </Typography>
      </Banner>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
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
                      color: favorites.some((fav) => fav._id === product._id)
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
      </Container>
    </div>
  );
};

export default Home;
