import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Divider } from "@mui/material";
import TableOrder from "./TableOrder";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ id }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  console.log("id", id);
  useEffect(() => {
    const getUser = async () => {
      if (id && id._id) {
    // Check if id is set before continuing the call
        try {
          const response = await axios.get(
            `https://backstore-iqcq.onrender.com/auth/user/${id._id}`
          );

          setUser(response.data.user);
          setUserId(response.data.user._id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("ID is undefined");
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body1">Loading user data...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body1">
            No user data available. Please log in.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body1">
            Full Name: {user.fullName || "Not available"}
          </Typography>
          <Typography variant="body1">
            Email: {user.email || "Not available"}
          </Typography>
          <Typography variant="body1">
            Date of Birth: {Date(user.dateOfBirth).toISOString().split('T')[0]  || "Not available"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>
        <TableOrder id={userId} />
      </Paper>
    </Container>
  );
};

export default Profile;
