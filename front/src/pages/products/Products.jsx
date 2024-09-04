import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Paper,
  Box,
  Chip,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/favoritesSlice";
import { addItem } from "../../redux/cartSlice";
import styled from "styled-components";

const ImageWrapper = styled("div")({
  overflow: "hidden",
  position: "relative",
  paddingTop: "56.25%", // 16:9 Aspect Ratio
});

const StyledCardMedia = styled(CardMedia)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false); // New state for image dialog
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [theme, setTheme] = useState("");
  const [occasion, setOccasion] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(""); 

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesRes, themesRes, occasionsRes] = await Promise.all([
          axios.get("https://backstore-iqcq.onrender.com/products/categories"),
          axios.get("https://backstore-iqcq.onrender.com/products/themes"),
          axios.get("https://backstore-iqcq.onrender.com/products/occasions"),
        ]);
        setCategories(categoriesRes.data);
        setThemes(themesRes.data);
        setOccasions(occasionsRes.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "https://backstore-iqcq.onrender.com/products/all"
      );
      setProducts(response.data.decorations);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleClose = () => setOpen(false);

  const handleImageClick = (imageUrl) => {
    setSelectedProduct(imageUrl);
    setImageDialogOpen(true);
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
    setSnackbarMessage(`${product.name} added to cart!`); //show customer message
    setSnackbarOpen(true); 
  };

  const handleFavoriteToggle = (product) => {
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite._id === product._id
    );
    if (isAlreadyFavorite) {
      dispatch(removeFromFavorites(product._id));
      setSnackbarMessage(`${product.name} removed from favorites!`);
    } else {
      dispatch(addToFavorites(product));
      setSnackbarMessage(`${product.name} added to favorites!`);
    }
    setSnackbarOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
    setCurrentPage(1);
  };

  const handleOccasionChange = (event) => {
    setOccasion(event.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCategory("");
    setTheme("");
    setOccasion("");
    setPriceRange([0, 150]);
    setSearch("");
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      (category === "" || product.category === category) &&
      (theme === "" || product.theme === theme) &&
      (occasion === "" || product.occasion === occasion)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (event, value) => setCurrentPage(value);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Party Decorations
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Filters</Typography>
          <Box>
            <Button
              variant="text"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 1, color: "primary.main", textTransform: "none" }}
            >
              {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
            </Button>
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ color: "primary.main", textTransform: "none" }}
            >
              CLEAR FILTERS
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={theme}
                  onChange={handleThemeChange}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {themes.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Occasion</InputLabel>
                <Select
                  value={occasion}
                  onChange={handleOccasionChange}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {occasions.map((occ) => (
                    <MenuItem key={occ} value={occ}>
                      {occ}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={150}
                sx={{
                  "& .MuiSlider-thumb": {
                    height: 24,
                    width: 24,
                    backgroundColor: "#fff",
                    border: "2px solid currentColor",
                  },
                  "& .MuiSlider-track": {
                    height: 4,
                  },
                  "& .MuiSlider-rail": {
                    height: 4,
                    opacity: 0.5,
                    backgroundColor: "#bfbfbf",
                  },
                }}
              />
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {category && (
              <Chip
                label={`Category: ${category}`}
                onDelete={() => setCategory("")}
              />
            )}
            {theme && (
              <Chip label={`Theme: ${theme}`} onDelete={() => setTheme("")} />
            )}
            {occasion && (
              <Chip
                label={`Occasion: ${occasion}`}
                onDelete={() => setOccasion("")}
              />
            )}
            {search && (
              <Chip
                label={`Search: ${search}`}
                onDelete={() => setSearch("")}
              />
            )}
            <Chip label={`Price: $${priceRange[0]} - $${priceRange[1]}`} />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {currentItems.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <ImageWrapper>
                <StyledCardMedia
                  component="img"
                  image={product.imageUrl}
                  alt={product.name}
                  onClick={() => handleImageClick(product.imageUrl)} // Handle image click
                />
              </ImageWrapper>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.price}
                </Typography>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{ mt: 1, mr: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  In Stock: {product.stockQuantity}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleFavoriteToggle(product)}>
                  <FavoriteIcon
                    color={
                      favorites.some((fav) => fav._id === product._id)
                        ? "error"
                        : "disabled"
                    }
                  />
                </IconButton>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpen(true);
                  }}
                >
                  Details
                </Button>
                <IconButton
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity === 0}
                >
                  <ShoppingCartIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={currentPage}
          onChange={paginate}
          color="primary"
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5">{selectedProduct?.name}</Typography>
            <Typography variant="body1">
              Price: ${selectedProduct?.price}
            </Typography>
            <Typography variant="body1">
              Category: {selectedProduct?.category}
            </Typography>
            <Typography variant="body1">
              Theme: {selectedProduct?.theme}
            </Typography>
            <Typography variant="body1">
              Occasion: {selectedProduct?.occasion}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: selectedProduct?.stockQuantity > 0 ? "green" : "red",
              }}
            >
              In Stock: {selectedProduct?.stockQuantity}
            </Typography>
            <Typography variant="body2">
              {selectedProduct?.description}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => {
              addToCart(selectedProduct);
              handleClose();
            }}
            variant="contained"
            color="primary"
            disabled={selectedProduct?.stockQuantity === 0}
          >
            {selectedProduct?.stockQuantity > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <img
            src={selectedProduct}
            alt="Product"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;
