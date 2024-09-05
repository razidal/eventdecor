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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backstore-iqcq.onrender.com/cart/allOrders",
          {
            timeout: 5000,
          }
        );

        setUserData(response.data.orders);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                <TableCell>Order Confirmation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.totalAmount}$</TableCell>
                  <TableCell>{user.userId?.fullName}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(user)}>
                      Order Details
                    </Button>
                  </TableCell>
                  <TableCell>Confirmed</TableCell>
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