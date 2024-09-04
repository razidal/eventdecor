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

const ProductsCard = ({ product, fetchProducts }) => {
  const [open, setOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `https://backstore-iqcq.onrender.com/products/delete/${product._id}`,
        {
          timeout: 5000,
        }
      );
      alert(" Product deleted successfully");
      setOpen(false);
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSuccess = () => {
    // Close the dialog
    setIsEditDialogOpen(false);

    // Refresh the data
    fetchProducts();
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={product.imageUrl}
          title={product.name}
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
            {showFullDescription || product.description.length <= 20
              ? product.description
              : `${product.description.substring(0, 20)}...`}
            {product.description.length > 20 && (
              <Button size="small" onClick={toggleDescription}>
                {showFullDescription ? "Show Less" : "Read More"}
              </Button>
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleEditDialogOpen}>
            Edit
          </Button>
          <Button size="small" onClick={handleClickOpen}>
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
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteProduct} autoFocus>
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
          <Edit product={product} handleEditSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsCard;
