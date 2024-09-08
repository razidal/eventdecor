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
    const fetchUsers = async () => { // Fetch all users
      try {
        const response = await axios.get("https://backstore-iqcq.onrender.com/users/get"); // Fetch all users
        setUsers(response.data); // Update the users state with the fetched data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => { // Handle role change for a user
    try {
      await axios.put(`https://backstore-iqcq.onrender.com/users/update-role/${id}`, {
        role: newRole,
      });
      setUsers((prevUsers) => // Update the users state with the new role
        prevUsers.map((user) =>   // Map through the users array and update the role for the user with the matching ID
          user._id === id ? { ...user, role: newRole } : user // If the user ID matches, create a new object with the updated role; otherwise, return the
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?"); // Show a confirmation dialog before deleting the user
    if (!confirmDelete) return; // If the user cancels the deletion, return early
    setDeleting(true);
    try { // Handle user deletion
      await axios.delete(`https://backstore-iqcq.onrender.com/users/delete/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id)); // Update the users state by filtering out the deleted user
      setDeleting(false);
      alert("User deleted successfully."); // Show a success message
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
      {loading ? ( // Show a loading message while fetching data
        <Typography>Loading...</Typography>
      ) : ( // Render the user table once data is fetched
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
            {users.map((user) => ( // Map through the users array and render a table row for each user
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
                     {deleting ? "Deleting..." : "Delete"} {/* Show a loading message while deleting the user*/}
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
