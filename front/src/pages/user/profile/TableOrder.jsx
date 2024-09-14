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
  useMediaQuery,
  Container,
} from "@mui/material";
import axios from "axios";

const TableOrder = ({ id }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [idPerson, setIdPerson] = useState("");
  const [selectedOrder, setSelectedOrder] = useState([]);


  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpenModal = (order) => {
    setOpenModal(true);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (id && id._id) {
      setIdPerson(id._id);
    }
  }, [id]);

  useEffect(() => { // Fetch data when idPerson changes
    const fetchData = async () => {
      if (!idPerson) {
        console.error("ID is undefined");
        return;
      }

      console.log("Fetching data for ID:", idPerson);

      try { // Fetch data from the API
        const response = await axios.get(
          `https://backstore-iqcq.onrender.com/cart/user/${idPerson}/getOrders`
        );
        console.log("API Response:", response.data);

        if (response.data.orders) { // Check if orders exist in the response
          setUserData(response.data.orders);
        } else {
          setUserData([]);
        }
      } catch (error) { // Handle errors
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idPerson]);

  useEffect(() => {
    const fetchData = async () => { // Fetch data when idPerson changes
      if (!id) return;
      console.log("Fetching data for ID:", idPerson);

      try {
        const response = await axios.get( // Fetch data from the API
          `https://backstore-iqcq.onrender.com/cart/user/${id}/getOrders`
        );
        console.log("API Response:", response.data);

        if (response.data.orders) {
          setUserData(response.data.orders);
        } else {
          setUserData([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, idPerson]);

  return (
    <Container sx={{ mt: 4 }}>
    <h2>Orders</h2>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error.message}</p>
    ) : userData.length === 0 ? (
      <p>No orders available.</p>
    ) : (
      <Box
        sx={{
          overflowX: "auto",
          "& table": {
            minWidth: isMobile ? 600 : "auto",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Order Details</TableCell>
              <TableCell>Order Confirmation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.totalAmount}$</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(order)}>
                    View Order
                  </Button>
                </TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    )}
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          justifyContent: "center",
          gap: "1rem",
          width: isMobile ? "90%" : "50%",
          maxWidth: "600px",
          margin: "auto",
          padding: "2rem",
          borderRadius: "8px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
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
            {selectedOrder?.products?.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.productId.name}</TableCell>
                <TableCell>{product.productId.price}$</TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  </Container>
  );
};

export default TableOrder;
