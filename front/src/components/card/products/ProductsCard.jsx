import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogContentText } from "@mui/material";
import axios from "axios";
import Edit from "../../../pages/admin/management/edit/Edit";

const ProductsCard = ({ product, fetchProducts }) => { // Pass fetchProducts as a prop
  const [open, setOpen] = useState(false); // State for the delete confirmation dialog 
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for the edit dialog
  const [showFullDescription, setShowFullDescription] = useState(false); // State for the description toggle
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleEditDialogOpen = () => { // Function to open the edit dialog
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => { // Function to close the edit dialog
    setIsEditDialogOpen(false);
  };

  const handleClickOpen = () => { // Function to open the delete confirmation dialog
    setOpen(true);
  };

  const handleClose = () => { // Function to close the delete confirmation dialog
    setOpen(false);
  };

  const deleteProduct = async () => { // Function to delete the product
    try { // Try-catch block to handle errors
      await axios.delete( 
        `https://backstore-iqcq.onrender.com/products/delete/${product._id}`, 
        { // Request configuration
          timeout: 5000, // Set a timeout of 5 seconds for the request
        }
      ); 
      alert(" Product deleted successfully"); // Show a success message
      setOpen(false); // Close the dialog
      fetchProducts(); // Refresh the product list after deletion
      window.location.reload();
    } catch (error) { // Catch any errors that occur during the request
      console.log(error);
    }
  };

  const handleEditSuccess = () => {
    // Close the dialog
    setIsEditDialogOpen(false);

    // Refresh the data
    fetchProducts();
  };

  const toggleDescription = () => { // Function to toggle the description length
    setShowFullDescription(!showFullDescription);
  };

  const handleImageDialogOpen = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setIsImageDialogOpen(false);
  };

  return (
    <div>
      <Card sx={{ maxWidth: 345, height: "100%", minHeight: 300 }}> {/* Card component from Material-UI */}
        <CardMedia 
            sx={{
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
            }}
            image={product.imageUrl}
            title={product.name}
            onClick={handleImageDialogOpen}  
        />        
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: {product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock Quantity: {product.stockQuantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {product.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description:{" "}
            {showFullDescription || product.description.length <= 20 // Show full description or a truncated version based on the state and length of the description
              ? product.description
              : `${product.description.substring(0, 20)}...`} 
            {product.description.length > 20 && ( // Show "Read More" button if the description is longer than 20 characters
              <Button size="small" onClick={toggleDescription}>
                {showFullDescription ? "Show Less" : "Read More" } {/* Toggle the button text based on the state */} 
              </Button> 
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleEditDialogOpen}> {/* Open the edit dialog when the button is clicked */}
            Edit
          </Button>
          <Button size="small" onClick={handleClickOpen}> {/* Open the delete confirmation dialog when the button is clicked */}
            Delete
          </Button>
        </CardActions>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog
        open={open}
        onClose={handleClose} 
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      > 
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> {/* Dialog content */}
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button> {/* Close the dialog when the button is clicked */}
          <Button onClick={deleteProduct} autoFocus> {/* Delete the product when the button is clicked */}
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent> 
          {/* Edit component */}
          <Edit product={product} handleEditSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>

      {/* Image preview dialog */}
      <Dialog
        open={isImageDialogOpen}
        onClose={handleImageDialogClose}
        maxWidth="md" 
        fullWidth
      >
        <DialogContent>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "auto" }} // Make image responsive
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsCard;
