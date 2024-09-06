import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Edit = ({ id }) => {
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [successMessage, setSuccessMessage] = useState("");

  const [editUser, setEditUser] = useState({
    fullName: id.fullName || "",
    email: id.email || "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `https://backstore-iqcq.onrender.com/auth/user/${id._id}`
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id._id) {
      getUser();
    }
  }, [id]);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Email validation check
    if (!validateEmail(editUser.email)) {
      validationErrors.email = "Please enter a valid email.";
    }

    // Password validation check
    if (editUser.password && !validatePassword(editUser.password)) {
      validationErrors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors
      return;
    }

    const userData = {
      fullName: editUser.fullName || user.fullName,
      email: editUser.email || user.email,
      password: editUser.password || user.password,
    };

    try {
      const response = await axios.put(
        `https://backstore-iqcq.onrender.com/auth/update/${id._id}/`,
        userData
      );
      console.log("User updated:", response.data);
      setSuccessMessage("User updated successfully!");
      setUser(response.data.user);
      setEditUser({
        fullName: response.data.user.fullName,
        email: response.data.user.email,
        password: "",
      });
      setErrors({}); // Clear errors after successful update
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response) {
        console.error("Server Error Response:", error.response.data);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4">Edit User</Typography>
      <form onSubmit={handleSubmit}>
        <Box
          component="div"
          sx={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            "& > :not(style)": { m: 1 },
          }}
        >
          <TextField
            id="fullName"
            label="Full Name"
            variant="outlined"
            fullWidth
            value={editUser.fullName}
            onChange={(e) =>
              setEditUser({ ...editUser, fullName: e.target.value })
            }
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle password visibility
            variant="outlined"
            fullWidth
            value={editUser.password}
            onChange={(e) =>
              setEditUser({ ...editUser, password: e.target.value })
            }
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Update
          </Button>

          {/* Display success message */}
          {successMessage && (
            <Alert severity="success" style={{ marginTop: "20px" }}>
              {successMessage}
            </Alert>
          )}
        </Box>
      </form>

      <Box mt={4}>
        <Typography variant="h6">Updated User Details:</Typography>
        <Typography variant="body1">Full Name: {user.fullName}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
      </Box>
    </Container>
  );
};

export default Edit;
