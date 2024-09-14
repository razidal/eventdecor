import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  Container,
  Box,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Paper,
  TableContainer,
} from "@mui/material";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUsers = async () => { // Fetch users from the server
      try {
        const response = await axios.get("https://backstore-iqcq.onrender.com/users/get");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => { // Update user role on the server
    try {
      await axios.put(`https://backstore-iqcq.onrender.com/users/update-role/${id}`, {
        role: newRole,
      });
      setUsers((prevUsers) => 
        prevUsers.map((user) => // Update the user's role in the state
          user._id === id ? { ...user, role: newRole } : user 
        )
      );
      window.location.reload(); // Reload the page to reflect the updated user role
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (id) => { // Delete user from the server
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`https://backstore-iqcq.onrender.com/users/delete/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id)); // Remove the user from the state
      setDeleting(false);
      alert("User deleted successfully.");
    } catch (error) {
      setDeleting(false);
      alert("Failed to delete user. Please try again.");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Users
        </Typography>
      </Box>
      {loading ? ( // Display a loading message while fetching users
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}> 
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="User">User</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={deleting}
                      size="small"
                      fullWidth
                    >
                      {deleting ? "Deleting..." : "Delete"} {/* Display a loading message while deleting user*/}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ManageUsers;
