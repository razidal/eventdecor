import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Divider, useMediaQuery, useTheme, CircularProgress, Backdrop} from "@mui/material";
import TableOrder from "./TableOrder";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {createTheme } from "@mui/material/styles";

const Profile = ({ id }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  
  const theme =  createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use breakpoints from theme

  useEffect(() => {
    const getUser = async () => {
      if (id && id._id) {
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
            <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
              <CircularProgress color="inherit" />
            </Backdrop>
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

  const formattedDate = new Date(user.dateOfBirth).toLocaleDateString();

  return (
    <Container maxWidth="md" sx={{ px: isMobile ? 2 : 4 }}>
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
            Date of Birth: {formattedDate || "Not available"}
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
