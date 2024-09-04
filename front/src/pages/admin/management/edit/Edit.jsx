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
} from "@mui/material";

const Edit = ({ product, handleEditSuccess }) => {
  const [editProduct, setEditProduct] = useState({
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

    try {
      const response = await axios.put(
        `https://backstore-iqcq.onrender.com/products/update/${product._id}`,
        editProduct
      );

      alert("Product updated successfully");
      handleEditSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
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
          onChange={handleInputChange}
        />
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          fullWidth
          required
          name="description"
          value={editProduct.description}
          onChange={handleInputChange}
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
        <TextField
          id="theme"
          label="Theme"
          variant="outlined"
          fullWidth
          name="theme"
          value={editProduct.theme}
          onChange={handleInputChange}
        />
        <TextField
          id="occasion"
          label="Occasion"
          variant="outlined"
          fullWidth
          required
          name="occasion"
          value={editProduct.occasion}
          onChange={handleInputChange}
        />
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
              setEditProduct({
                ...editProduct,
                dimensions: {
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
              setEditProduct({
                ...editProduct,
                dimensions: {
                  ...editProduct.dimensions,
                  height: e.target.value,
                },
              })
            }
          />
        </Box>
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
