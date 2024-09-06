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
} from "@mui/material";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting,setDeleting]=useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://backstore-iqcq.onrender.com/users/get"); // Fetch all users
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`https://backstore-iqcq.onrender.com/users/update-role/${id}`, {
        role: newRole,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`https://backstore-iqcq.onrender.com/users/delete/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
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
        <Typography variant="h4">Manage Users</Typography>
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Table>
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
                  >
                     {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default ManageUsers;
