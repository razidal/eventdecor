import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import Cookies from "js-cookie";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/favoritesSlice";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogContentText, MenuItem, Select } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { addItem, removeItem } from "../../redux/cartSlice";

const Favorites = () => {
  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState();
  const [selectCategory, setSelectCategory] = React.useState("");
  const [priceRange, setPriceRange] = React.useState([0, 150]);
  const [open, setOpen] = React.useState(false);
  const [favoriteStatus, setFavoriteStatus] = React.useState({});
  const [getAllFavorites, setGetAllFavorites] = React.useState([]);
  const cartFromCookies = Cookies.get("favorites");
  console.log(cartFromCookies);
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const addToCart = () => {
    if (selectedProduct) {
      dispatch(
        addItem({
          id: selectedProduct._id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
        })
      );
    }
  };
  const handleAddToFavorites = async (product) => {
    try {
      const response = await axios.get(
        `https://backstore-iqcq.onrender.com/products/get/${product._id}`,{
          timeout: 5000,
        }
      );
      setGetAllFavorites((prev) => [...prev, response.data.product]);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = () => {
    setProducts(JSON.parse(cartFromCookies));
  };
  useEffect(() => {
    if (products.length > 0) {
      products.forEach((product) => {
        handleAddToFavorites(product);
      });
    }
  }, [products]);

  useEffect(() => {
    if (cartFromCookies) {
      getProducts();
    }
    console.log(products);
  }, [cartFromCookies]);

  useEffect(() => {
    // getProducts();
  }, []);

  return (
    <div>
      <Container>
        <h1>Favorites </h1>

        {getAllFavorites?.map((product, index) => {
          console.log(product._id);
          return (
            <Card key={product._id} sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={product.image}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amount: {product.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description: {product.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleAddToFavorites(product)}
                >
                  See Details
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Container>
    </div>
  );
};

export default Favorites;
