import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  Box,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";

const TableAdmin = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the ID of the selected order

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://backstore-iqcq.onrender.com/orders`,
        { timeout: 5000 }
      );
      setUserData(response.data.orders);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `https://backstore-iqcq.onrender.com/orders/delete/${orderId}`,
        { timeout: 5000 }
      );
      alert("Order deleted successfully");
      fetchOrders(); // Refresh the order list after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order");
    }
  };

  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ paddingTop: '50px', paddingBottom: '30px', display: 'inline-block' }}>
          Orders
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ display: 'inline-block' }}>
            Loading...
          </Typography>
        </Box>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <Container>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Order Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.totalAmount}$</TableCell>
                  <TableCell>{order.userId?.fullName}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(order)}>
                      Order Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleDeleteOrder(order._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            justifyContent: "center",
            gap: "1rem",
            width: "50%",
            margin: "auto",
            padding: "2rem",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">Order Details</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder?.products?.map((product, productIndex) => (
                <TableRow key={productIndex}>
                  <TableCell>{product.productId?.name}</TableCell>
                  <TableCell>{product.price}$</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="h6">Delivery Address</Typography>
          <Typography>
            {selectedOrder?.address?.street}, {selectedOrder?.address?.city},{" "}
            {selectedOrder?.address?.postalCode}, {selectedOrder?.address?.country}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default TableAdmin;
