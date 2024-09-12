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
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Typography from '@mui/material/Typography';

const TableAdmin = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the ID of the selected user

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchData = async () => {
    try { 
      const response = await axios.get( 
        `https://backstore-iqcq.onrender.com/cart/allOrders`,
        {
          timeout: 5000,
        }
      ); 
      setUserData(response.data.orders); // Assuming the response contains an array of users
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) { // Catch any errors that occur during the fetch request
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const deleteOrder = async (orderId) => { // Function to handle order deletion
  //   const confirmDelete = window.confirm("Are you sure you want to delete this order?"); // Confirmation dialog before deletion
  //   if (!confirmDelete) return; // If the user cancels the deletion, do nothing

  //   setDeleting(true); // Set deleting state to true to show loading indicator or disable buttons
  //   try {
  //     await axios.delete(`https://backstore-iqcq.onrender.com/order/delete/${orderId}`); // Make a DELETE request to the server to delete the order
  //     setUserData((prevData) => prevData.filter((order) => order._id !== orderId)); // Remove the deleted order from the local state to update the UI instantly
  //     setDeleting(false);
  //     alert("Order deleted successfully."); // Show success message
  //   } catch (error) {
  //     setDeleting(false);   
  //     alert("Failed to delete order. Please try again."); // Show error message
  //     console.error("Error deleting order:", error);
  //   }
  // };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`https://backstore-iqcq.onrender.com/order/update-status/${orderId}`, {
        status: status
      });
      console.log("Response:", response.data);
      alert(`Order status updated to ${status}`);
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error);
      alert("Failed to update order status.");
    }
  };;

  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ paddingTop: '50px', paddingBottom:'30px', display: 'inline-block' }}>
          Orders
        </Typography>
      </Box>

      {loading ? ( // Show loading indicator while data is being fetched
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ display: 'inline-block' }}>
            Loading...
          </Typography>
        </Box>
      ) : error ? ( // Show error message if there was an error during the fetch request
        <p>Error: {error.message}</p>
      ) : ( // Render the table with user data if data is available and there was no error
        <Container>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Order Details</TableCell>
                <TableCell>Order Confirmation</TableCell>
                <TableCell>Action</TableCell> {/* Add Action column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.map((user) => ( // Map through the user data and render a table row for each user
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.totalAmount}$</TableCell>
                  <TableCell>{user.userId?.fullName}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(user)}>
                      Order Details
                    </Button>
                  </TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onChange={(e) => updateOrderStatus(user._id, e.target.value)}
                    >
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
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
                {selectedUser?.products?.map((product, productIndex) => (
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
              {selectedUser?.address?.street}, {selectedUser?.address?.city},{" "}
              {selectedUser?.address?.postalCode}, {selectedUser?.address?.country}
            </p>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default TableAdmin;
