import React, { useState } from "react";
import { Card, CardActions, CardContent, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import axios from "axios";

const OrdersCard = ({ order, fetchOrders }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteOrder = async () => {
    try {
      await axios.delete(
        `https://backstore-iqcq.onrender.com/order/delete/${order._id}`,
        {
          timeout: 5000,
        }
      );
      alert("Order deleted successfully");
      setOpen(false);
      fetchOrders(); // Refresh the order list after deletion
    } catch (error) {
      console.log(error);
      alert("Error deleting order");
    }
  };

  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Order ID: {order._id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Amount: ${order.totalAmount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {order.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Delivery Address: {order.address.street}, {order.address.city}, {order.address.postalCode}, {order.address.country}
          </Typography>
        </CardContent>
        <CardActions>
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
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteOrder} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrdersCard;
