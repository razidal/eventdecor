import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import axios from "axios";
import OrdersCard from "./OrdersCard";

const TableAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://backstore-iqcq.onrender.com/cart/allOrders`,
        {
          timeout: 5000,
        }
      );
      setOrders(response.data.orders); // Adjust based on actual response structure
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container>
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
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <OrdersCard order={order} fetchOrders={fetchOrders} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TableAdmin;
