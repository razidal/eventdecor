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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
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

  const formatOrderDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

  const fetchData = async () => {
    try { 
      const response = await axios.get( 
        `https://backstore-iqcq.onrender.com/cart/allOrders`,
        {
          timeout: 15000,
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
  };

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
          <Box sx={{ overflowX: "auto" }}>
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
                <TableCell align="center">Order Number</TableCell>
                <TableCell align="center">Total Price</TableCell>
                <TableCell align="center">Order Date</TableCell>
                <TableCell align="center">Order Details</TableCell>
                <TableCell align="center">Order Confirmation</TableCell>
                <TableCell align="center">Action</TableCell> {/* Add Action column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.map((user) => ( // Map through the user data and render a table row for each user
                <TableRow key={user._id}>         
                  <TableCell align="center">{user._id}</TableCell>
                  <TableCell align="center">{user.totalAmount}$</TableCell>
                  <TableCell align="center">{formatOrderDate(user.orderDate)}</TableCell>
                  <TableCell>
                    <Button align="center" onClick={() => handleOpenModal(user)}>
                      Order Details
                    </Button>
                  </TableCell>
                  <TableCell align="center">{user.status}</TableCell>
                  <TableCell align="center">
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
          </Box>
        </Container>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      width: isMobile ? '95%' : '60%',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: isMobile ? '20px' : '40px',
      borderRadius: '8px',
      boxShadow: 24,
      position: 'relative',
    }}
  >
    <IconButton
      aria-label="close"
      onClick={handleCloseModal}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        padding: "4px",
        width: "28px",
        height: "28px",
        "& .MuiSvgIcon-root": {
          fontSize: "1rem",
        },
      }}
    >
      <CloseIcon />
    </IconButton>

    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mt: 2 }}>
      <strong>Order Details</strong>
    </Typography>

    {/* User Info */}
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="body2" sx={{paddingTop:"8px"}}>Full Name: {selectedUser?.userId?.fullName || 'N/A'}</Typography>
      <Typography variant="body2" sx={{paddingTop:"8px"}}>Email: {selectedUser?.userId?.email || 'N/A'}</Typography>
    </Box>

    <Table
      sx={{
        tableLayout: "auto",
        width: "100%",
        marginBottom: "1rem",
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
        {selectedUser?.products?.map((product, index) => (
          <TableRow key={index}>
            <TableCell>{product.productId?.name || 'N/A'}</TableCell>
            <TableCell>{product.price}$</TableCell>
            <TableCell>{product.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Typography variant="h6" gutterBottom>
     <strong>Delivery Address</strong> 
    </Typography>
    <Typography variant="body2">
      {selectedUser?.address?.street}, {selectedUser?.address?.city},{" "}
      {selectedUser?.address?.postalCode}, {selectedUser?.address?.country}
    </Typography>
  </Box>
</Modal>

    </div>
  );
};

export default TableAdmin;
