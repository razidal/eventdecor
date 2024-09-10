import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Edit = ({ product, handleEditSuccess }) => {
  const [editProduct, setEditProduct] = useState({ // Initialize editProduct state with product data
    // ...product, // Spread the product data into editProduct state
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    imageUrl: product.imageUrl || "",
    category: product.category || "",
    stockQuantity: product.stockQuantity || "",
    color: product.color || "",
    theme: product.theme || "",
    occasion: product.occasion || "",
    material: product.material || "",
    dimensions: {
      length: product.dimensions?.length || "",
      width: product.dimensions?.width || "",
      height: product.dimensions?.height || "",
    }, 
    isReusable: product.isReusable || false,
    ageGroup: product.ageGroup || "",
    brand: product.brand || "",
    weight: product.weight || "",
    packageQuantity: product.packageQuantity || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try { // Use try-catch block to handle errors during API call
      const response = await axios.put( 
        `https://backstore-iqcq.onrender.com/products/update/${product._id}`, // Use product._id to update the specific product
        editProduct
      );

      alert("Product updated successfully"); // Show success alert
      handleEditSuccess(); // Call handleEditSuccess function to update the product list in the parent component
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setEditProduct({ ...editProduct, isReusable: e.target.checked });
  };

  return (
    <form onSubmit={handleSubmit}> 
      <Box component="form">
        <TextField
          id="name"
          label="Product Name"
          variant="outlined"
          fullWidth
          required
          name="name"
          value={editProduct.name}
          onChange={handleInputChange} // Call handleInputChange function on input change
        />
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          fullWidth
          required
          name="description"
          value={editProduct.description}
          onChange={handleInputChange} // Call handleInputChange function on input change
        />
        <TextField
          id="price"
          label="Price"
          type="number"
          variant="outlined"
          fullWidth
          required
          name="price"
          value={editProduct.price}
          onChange={handleInputChange} 
        />
        <TextField
          id="imageUrl"
          label="Image URL"
          variant="outlined"
          fullWidth
          name="imageUrl"
          value={editProduct.imageUrl}
          onChange={handleInputChange}
        />
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            fullWidth
            required
            name="category"
            value={editProduct.category}
            onChange={handleInputChange}
          >
            <MenuItem value="Balloons">Balloons</MenuItem>
            <MenuItem value="Banners">Banners</MenuItem>
            <MenuItem value="Tableware">Tableware</MenuItem>
            <MenuItem value="Lighting">Lighting</MenuItem>
            <MenuItem value="Party Favors">Party Favors</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="stockQuantity"
          label="Stock Quantity"
          type="number"
          variant="outlined"
          fullWidth
          required
          name="stockQuantity"
          value={editProduct.stockQuantity}
          onChange={handleInputChange} 
        />
        <TextField
          id="color"
          label="Color"
          variant="outlined"
          fullWidth
          required
          name="color"
          value={editProduct.color}
          onChange={handleInputChange}
        />
        <FormControl fullWidth>
          <InputLabel id="theme-label">Theme</InputLabel>
          <Select
            labelId="theme-label"
            id="theme"
            fullWidth
            required
            name="theme"
            value={editProduct.theme}
            onChange={handleInputChange}
          >
            <MenuItem value="Birthday">Birthday</MenuItem>
            <MenuItem value="Celebration">Celebration</MenuItem>
            <MenuItem value="Floral">Floral</MenuItem>
            <MenuItem value="Wedding">Wedding</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="occasion-label">Occasion</InputLabel>
          <Select
            labelId="occasion-label"
            id="occasion"
            fullWidth
            required
            name="occasion"
            value={editProduct.occasion}
            onChange={handleInputChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Birthday">Birthday</MenuItem>
            <MenuItem value="Wedding">Wedding</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="material"
          label="Material"
          variant="outlined"
          fullWidth
          name="material"
          value={editProduct.material}
          onChange={handleInputChange}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            id="length"
            label="Length (cm)"
            type="number"
            variant="outlined"
            fullWidth
            name="length"
            value={editProduct.dimensions.length}
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                dimensions: {
                  ...editProduct.dimensions,
                  length: e.target.value,
                },
              })
            }
          />
          <TextField
            id="width"
            label="Width (cm)"
            type="number"
            variant="outlined"
            fullWidth
            name="width"
            value={editProduct.dimensions.width}
            onChange={(e) =>
              setEditProduct({ // Update the editProduct state with the new value for width
                ...editProduct,
                dimensions: { // Update the dimensions object within editProduct state
                  ...editProduct.dimensions,
                  width: e.target.value,
                },
              })
            }
          />
          <TextField
            id="height"
            label="Height (cm)"
            type="number"
            variant="outlined"
            fullWidth
            name="height"
            value={editProduct.dimensions.height}
            onChange={(e) =>
              setEditProduct({ // Update the editProduct state with the new value for height
                ...editProduct, 
                dimensions: {  // Update the dimensions object within editProduct state
                  ...editProduct.dimensions,
                  height: e.target.value,
                },
              })
            }
          />
        </Box>
      <FormControlLabel
          control={
            <Checkbox
              checked={editProduct.isReusable}
              onChange={handleCheckboxChange}
              name="isReusable"
              color="primary"
            />
          }
          label="Reusable"
        />
        <FormControl fullWidth>
          <InputLabel id="ageGroup-label">Age Group</InputLabel>
          <Select
            labelId="ageGroup-label"
            id="ageGroup"
            fullWidth
            name="ageGroup"
            value={editProduct.ageGroup}
            onChange={handleInputChange} 
          >
            <MenuItem value="Kids">Kids</MenuItem>
            <MenuItem value="Teens">Teens</MenuItem>
            <MenuItem value="Adults">Adults</MenuItem>
            <MenuItem value="All Ages">All Ages</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="brand"
          label="Brand"
          variant="outlined"
          fullWidth
          name="brand"
          value={editProduct.brand}
          onChange={handleInputChange}
        />
        <TextField
          id="weight"
          label="Weight (kg)"
          type="number"
          variant="outlined"
          fullWidth
          name="weight"
          value={editProduct.weight}
          onChange={handleInputChange}
        />
        <TextField
          id="packageQuantity"
          label="Package Quantity"
          type="number"
          variant="outlined"
          fullWidth
          name="packageQuantity"
          value={editProduct.packageQuantity}
          onChange={handleInputChange}
        />
      </Box>
      <Button variant="contained" type="submit">
        Update
      </Button>
    </form>
  );
};

export default Edit;
