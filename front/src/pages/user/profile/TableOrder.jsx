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
} from "@mui/material";
import axios from "axios";

const TableOrder = ({ id }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [idPerson, setIdPerson] = useState("");
  const [selectedOrder, setSelectedOrder] = useState([]);
  console.log("selectedOrder", selectedOrder);
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

  useEffect(() => {
    const fetchData = async () => {
      if (!idPerson) {
        console.error("ID is undefined");
        return;
      }

      console.log("Fetching data for ID:", idPerson);

      try {
        const response = await axios.get(
          `https://backstore-iqcq.onrender.com/cart/user/${idPerson}/getOrders`
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
  }, [idPerson]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      console.log("Fetching data for ID:", idPerson);

      try {
        const response = await axios.get(
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
    <div>
      <h2>Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : userData.length === 0 ? (
        <p>No orders available.</p>
      ) : (
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
                <TableCell>Confirmed</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="div"
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
            borderRadius: "8px",
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
    </div>
  );
};

export default TableOrder;
