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
  CircularProgress,
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
  const [loading, setLoading] = useState(true); // Loading state

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    const fetchFilterOptions = async () => { // Fetch filter options (categories, themes, occasions) from the backend
      try {
        const [categoriesRes, themesRes, occasionsRes] = await Promise.all([
          axios.get("https://backstore-iqcq.onrender.com/products/categories"),
          axios.get("https://backstore-iqcq.onrender.com/products/themes"),
          axios.get("https://backstore-iqcq.onrender.com/products/occasions"),
        ]);
        setCategories(categoriesRes.data); // Assuming the response structure is the same for all requests
        setThemes(themesRes.data); // Assuming the response structure is the same for all requests
        setOccasions(occasionsRes.data); // Assuming the response structure is the same for all requests
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions(); // Call the function to fetch filter options
    getProducts(); // Fetch products when the component mounts
  }, []);

  const getProducts = async () => { // Fetch products from the backend
    try { 
      const response = await axios.get(
        "https://backstore-iqcq.onrender.com/products/all"
      );
      setProducts(response.data.decorations); // Assuming the response structure is the same for all requests
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleClose = () => setOpen(false);

  const handleImageClick = (imageUrl) => { // Handle image click to open the dialog
    setSelectedProduct(imageUrl);
    setImageDialogOpen(true);
  };

  const addToCart = (product) => { // Add product to cart
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

  const handleFavoriteToggle = (product) => { // Toggle favorite status of a product
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite._id === product._id 
    );
    if (isAlreadyFavorite) { // Remove from favorites if already favorite
      dispatch(removeFromFavorites(product._id));
      setSnackbarMessage(`${product.name} removed from favorites!`); //show customer message
    } else { 
      dispatch(addToFavorites(product._id)); // Add to favorites if not already favorite
      setSnackbarMessage(`${product.name} added to favorites!`); 
    }
    setSnackbarOpen(true);
  };

  const handleSearchChange = (event) => { // Handle search input change
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => { // Handle category change
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleThemeChange = (event) => { // Handle theme change
    setTheme(event.target.value);
    setCurrentPage(1);
  };

  const handleOccasionChange = (event) => { // Handle occasion change
    setOccasion(event.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (event, newValue) => { // Handle price range change
    setPriceRange(newValue);
    setCurrentPage(1);
  };

  const clearFilters = () => { // Clear all filters and reset the state
    setCategory("");
    setTheme("");
    setOccasion("");
    setPriceRange([0, 150]);
    setSearch("");
  };

  const filteredProducts = products.filter( // Filter products based on search, category, theme, occasion, and price range
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      (category === "" || product.category === category) &&
      (theme === "" || product.theme === theme) &&
      (occasion === "" || product.occasion === occasion)
  );
 
  const indexOfLastItem = currentPage * itemsPerPage; // Pagination logic
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice( // Get current items for the current page
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (event, value) => setCurrentPage(value); // Change page

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Party Decorations
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Align items to the start and end of the container
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
              {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"} {/* Toggle button text */}
            </Button>
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={clearFilters} // Clear filters button
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
                onChange={handleSearchChange} // Search input field
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={handleCategoryChange} // Category dropdown
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((cat) => ( // Map through categories and create menu items
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
                  onChange={handleThemeChange} // Theme dropdown
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
                  onChange={handleOccasionChange} // Occasion dropdown
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {occasions.map((occ) => ( // Map through occasions and create menu items
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
                onChange={handlePriceChange} // Price range slider
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
            {theme && ( // Display active filters as chips with delete functionality
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
      {loading ? ( // Show loading spinner while fetching data
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <CircularProgress />
            </div>
          ) : (
      <Grid container spacing={3}>
        {currentItems.map((product) => ( // Map through current items and create product cards
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <ImageWrapper>
                <StyledCardMedia
                  component="img"
                  image={product.imageUrl} // Product image
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
                    setSelectedProduct(product); // Set selected product for details dialog
                    setOpen(true);  // Open details dialog 
                  }}
                >
                  Details
                </Button>
                <IconButton
                  onClick={() => addToCart(product)} // Add to cart button
                  disabled={product.stockQuantity === 0} // Disable if out of stock
                >
                  <ShoppingCartIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
)}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / itemsPerPage)} // Calculate total pages
          page={currentPage} // Current page
          onChange={paginate}  // Handle page change
          color="primary"
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5">{selectedProduct?.name}</Typography>
            {selectedProduct?.price && (                        
            <Typography variant="body1">Price: ${selectedProduct?.price}</Typography>
            )}
            {selectedProduct?.category && (                       
            <Typography variant="body1">
              Category: {selectedProduct?.category}
            </Typography>) }
            {selectedProduct?.theme&& (
            <Typography variant="body1">
              Theme: {selectedProduct?.theme}
            </Typography>)}
            {selectedProduct?.occasion && (                     
            <Typography variant="body1">
              Occasion: {selectedProduct?.occasion}
            </Typography>)}
            {selectedProduct?.color && (                        
            <Typography>
                Color : {selectedProduct?.color}
            </Typography>)}
            {selectedProduct?.material && (                   
            <Typography>
              Material : {selectedProduct?.material}
            </Typography>)}
            {selectedProduct?.dimensions?.length &&
            selectedProduct?.dimensions?.width &&
            selectedProduct?.dimensions?.height && (
            <Typography>
            Dimensions: {selectedProduct?.dimensions.length}cm x 
            {selectedProduct?.dimensions.width}cm x 
            {selectedProduct?.dimensions.height}cm
            </Typography>
            )}
            {selectedProduct?.isReusable !== undefined && ( 
            <Typography> 
              is Reusable : {selectedProduct?.isReusable ? "Yes" : "No"}
            </Typography>)}
            {selectedProduct?.ageGroup && (                    
            <Typography>
              Age Group : {selectedProduct?.ageGroup}
            </Typography>)} 
            {selectedProduct?.brand && (                   
            <Typography>
              Brand : {selectedProduct?.brand}
            </Typography> )}
            {selectedProduct?.weight && (                   
            <Typography>
              Weight : {selectedProduct?.weight}
            </Typography>)}
            {selectedProduct?.packageQuantity && (                   
            <Typography>
              Package Quantity : {selectedProduct?.packageQuantity}
            </Typography>)}
            <Typography
              variant="body1"
              sx={{
                color: selectedProduct?.stockQuantity > 0 ? "green" : "red", // Change color based on stock quantity
              }}
            >
              In Stock: {selectedProduct?.stockQuantity} 
            </Typography>
            {selectedProduct?.description && (                  
            <Typography variant="body2">
              Description: {selectedProduct?.description}
            </Typography> )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button> 
          <Button
            onClick={() => {
              addToCart(selectedProduct); // Add to cart button
              handleClose(); // Close details dialog
            }}
            variant="contained"
            color="primary"
            disabled={selectedProduct?.stockQuantity === 0} // Disable if out of stock
          >
            {selectedProduct?.stockQuantity > 0 // Change button text based on stock quantity
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
  );
};

export default Products;
