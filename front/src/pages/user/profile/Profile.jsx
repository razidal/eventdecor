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

  useEffect(() => {
    const getUser = async () => { // Fetch user data based on the provided ID
      if (id && id._id) { // Check if id and id._id are defined
        try { 
          const response = await axios.get( // Make a GET request to the server to fetch user data
            `https://backstore-iqcq.onrender.com/auth/user/${id._id}`
          );
          setUser(response.data.user);
          setUserId(response.data.user._id);
        } catch (error) { // Handle any errors that occur during the fetch request
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

  // Format the date of birth
  const formattedDate = new Date(user.dateOfBirth).toLocaleDateString();

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
            Full Name: {user.fullName || "Not available"} {/* Display the user's full name or "Not available" if not provided */}
          </Typography>
          <Typography variant="body1">
            Email: {user.email || "Not available"} {/* Display the user's email or "Not available" if not provided */}
          </Typography>
          <Typography variant="body1">
            Date of Birth: {formattedDate || "Not available"} {/* Display the user's date of birth or "Not available" if not provided */}
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
