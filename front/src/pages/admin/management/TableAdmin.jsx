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
} from "@mui/material";
import axios from "axios";
import Typography from '@mui/material/Typography';

const TableAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://backstore-iqcq.onrender.com/cart/allOrders`,
        {
          timeout: 5000,
        }
      );
      setOrders(response.data.orders); // Adjust this based on the actual structure of your response
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`https://backstore-iqcq.onrender.com/cart/delete/${orderId}`, { timeout: 5000 });
      alert("Order deleted successfully");
      fetchOrders(); // Refresh the order list after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order");
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
       <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ paddingTop: '50px', paddingBottom:'30px', display: 'inline-block' }}>
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
              {orders.map((order) => (
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
                    <Button onClick={() => handleDeleteOrder(order._id)} color="error">
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
        <div>
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
            }}
          >
            <h2>Order Details</h2>
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
            <h3>Delivery Address</h3>
            <p>
              {selectedOrder?.address?.street}, {selectedOrder?.address?.city},{" "}
              {selectedOrder?.address?.postalCode}, {selectedOrder?.address?.country}
            </p>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default TableAdmin;
