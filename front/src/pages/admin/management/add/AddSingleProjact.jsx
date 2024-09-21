import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import styled from "styled-components";

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  max-width: 500px;
  margin: auto;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const AddSingleProjact = ({ setOpen }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stockQuantity: "",
    color: "",
    theme: "",
    occasion: "",
    material: "",
    dimensions: { length: "", width: "", height: "" },
    isReusable: false,
    ageGroup: "",
    brand: "",
    weight: "",
    packageQuantity: "",
  });

  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    const fetchProducts = async () => {
      try { // Fetch products from the server
        const response = await axios.get("https://backstore-iqcq.onrender.com/products/all", {
          timeout: 5000,
        });
        setProducts(response.data.products); // Update the products state
        setLoading(false); // Set loading to false
      } catch (err) { // Handle errors
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products"); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchProducts(); // Call the fetchProducts function
  }, []);
  // Fetch categories, themes, and occasions from the server
  useEffect(() => {
    const fetchData = async () => { // Define an async function to fetch data
      try {
        const categoriesRes = await axios.get( // Fetch categories
          "https://backstore-iqcq.onrender.com/products/categories",
          {
            timeout: 5000,
          }
        );
        const themesRes = await axios.get( // Fetch themes
          "https://backstore-iqcq.onrender.com/products/themes",
          {
            timeout: 5000,
          }
        );
        const occasionsRes = await axios.get( // Fetch occasions
          "https://backstore-iqcq.onrender.com/products/occasions",
          {
            timeout: 5000,
          }
        );
          // Update the state with the fetched data
        setCategories(categoriesRes.data); 
        setThemes(themesRes.data);
        setOccasions(occasionsRes.data);
      } catch (error) { // Handle errors
        console.error(
          "Failed to fetch categories, themes, or occasions",
          error
        );
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => { // Handle input changes
    const { name, value } = e.target; 
    setProduct({ ...product, [name]: value }); // Update the product state
  };

  const handleDimensionChange = (e) => { // Handle dimension changes
    const { name, value } = e.target;
    setProduct({ // Update the product state
      ...product,
      dimensions: { ...product.dimensions, [name]: value }, // Update the dimensions property
    });
  };

  const handleCheckboxChange = (e) => {
    setProduct({ ...product, isReusable: e.target.checked }); // Update the isReusable property
  };

  const AddProjact = async (e) => { // Handle form submission
    e.preventDefault();
    try { // Send a POST request to add the product
      const response = await axios.post( 
        "https://backstore-iqcq.onrender.com/products/add",
        product
      );
      console.log(response.data); 
 
      alert("Product added successfully"); // Show a success message
      window.location.reload();
      setTimeout(() => { // Close the form after 2 seconds
        setOpen(false);
      }, 2000);
    } catch (error) { // Handle errors
      console.log(error);
    }
  };

  return (
    <FormContainer component="form" onSubmit={AddProjact}> {}
      <TextField
        label="Product Name"
        variant="outlined"
        name="name"
        value={product.name}
        onChange={handleInputChange} // Update the name property
        fullWidth
      />
      <TextField
        label="Description"
        variant="outlined"
        name="description"
        value={product.description}
        onChange={handleInputChange} // Update the description property
        fullWidth
      />
      <TextField
        label="Price"
        type="number"
        variant="outlined"
        name="price"
        value={product.price}
        onChange={handleInputChange} // Update the price property
        fullWidth
      />
      <TextField
        label="Image URL"
        variant="outlined"
        name="imageUrl"
        value={product.imageUrl}
        onChange={handleInputChange} // Update the imageUrl property
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={product.category}
          onChange={handleInputChange} // Update the category property
        >
          {categories.map((category, index) => ( // Map through the categories and create a MenuItem for each one
            <MenuItem key={index} value={category}> 
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Stock Quantity"
        type="number"
        variant="outlined"
        name="stockQuantity"
        value={product.stockQuantity}
        onChange={handleInputChange} // Update the stockQuantity property
        fullWidth
      />
      <TextField
        label="Color"
        variant="outlined"
        name="color"
        value={product.color}
        onChange={handleInputChange}  // Update the color property
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Theme</InputLabel>
        <Select name="theme" value={product.theme} onChange={handleInputChange}> 
          {themes.map((theme, index) => ( // Map through the themes and create a MenuItem for each one
            <MenuItem key={index} value={theme}>
              {theme}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Occasion</InputLabel>
        <Select
          name="occasion"
          value={product.occasion}
          onChange={handleInputChange} // Update the occasion property
        >
          {occasions.map((occasion, index) => ( // Map through the occasions and create a MenuItem for each one
            <MenuItem key={index} value={occasion}>
              {occasion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Material"
        variant="outlined"
        name="material"
        value={product.material}
        onChange={handleInputChange}
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Length"
          type="number"
          variant="outlined"
          name="length"
          value={product.dimensions.length}
          onChange={handleDimensionChange}
          fullWidth
        />
        <TextField
          label="Width"
          type="number"
          variant="outlined"
          name="width"
          value={product.dimensions.width}
          onChange={handleDimensionChange}
          fullWidth
        />
        <TextField
          label="Height"
          type="number"
          variant="outlined"
          name="height"
          value={product.dimensions.height}
          onChange={handleDimensionChange}
          fullWidth
        />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={product.isReusable}
            onChange={handleCheckboxChange}
            name="isReusable"
          />
        }
        label="Is Reusable"
      />
      <FormControl fullWidth>
        <InputLabel>Age Group</InputLabel>
        <Select
          name="ageGroup"
          value={product.ageGroup}
          onChange={handleInputChange}
        >
          <MenuItem value="Kids">Kids</MenuItem>
          <MenuItem value="Teens">Teens</MenuItem>
          <MenuItem value="Adults">Adults</MenuItem>
          <MenuItem value="All Ages">All Ages</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Brand"
        variant="outlined"
        name="brand"
        value={product.brand}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        label="Weight"
        type="number"
        variant="outlined"
        name="weight"
        value={product.weight}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        label="Package Quantity"
        type="number"
        variant="outlined"
        name="packageQuantity"
        value={product.packageQuantity}
        onChange={handleInputChange}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Product
      </Button>
    </FormContainer>
  );
};

export default AddSingleProjact;
