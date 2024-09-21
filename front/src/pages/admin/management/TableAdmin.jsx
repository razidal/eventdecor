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
  useMediaQuery,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import axios from "axios";
import Typography from '@mui/material/Typography';

const TableAdmin = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the ID of the selected user

  const isMobile = useMediaQuery("(max-width:600px)"); // for mobile devices

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

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`https://backstore-iqcq.onrender.com/order/update-status/${orderId}`, {
        status: status
      });
      console.log("Response:", response.data);
      alert(`Order status updated to ${status}`);
      window.location.reload(); // Reload the page to reflect the updated order status
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error);
      alert("Failed to update order status.");
    }
  };;

  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h4'
        sx={{ paddingTop: '50px', paddingBottom:'30px', display: 'inline-block' }}>
          Orders
        </Typography>
      </Box>

      {loading ? ( // Show loading indicator while data is being fetched
        <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      ) : error ? ( // Show error message if there was an error during the fetch request
        <p>Error: {error.message}</p>
      ) : ( // Render the table with user data if data is available and there was no error
        <Container sx={{ padding: isMobile ? "0 10px" : "0" }}>
        <Table
          sx={{
            width: "100%",
            tableLayout: isMobile ? "auto" : "fixed",
            display: isMobile ? "block" : "table",
            overflowX: "auto",
          }}
        >
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
                  <TableCell align="center">{user.totalAmount}$</TableCell>
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
                      sx= {{ width: isMobile? "100%" : "auto" }}  // Mobile
                    > 
                      <MenuItem value="Pending">Pending</MenuItem>
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
            "& > :not(style)": { m: 1, width: isMobile ? "90%" : "25ch" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            justifyContent: "center",
            gap: "1rem",
            width: isMobile ? "95%" : "50%",
            margin: "auto",
            padding: isMobile ? "20px" : "40px",
          }}
        >
            <h2>Order Details</h2>
            <Table
              sx={{
              tableLayout: "auto",
              width: isMobile ? "100%" : "auto",
              overflowX: isMobile ? "auto" : "visible",
            }}
            >
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
