// In routes/user.js or your preferred routes file
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Update user role
router.put("/update-role/:id", async (req, res) => { // Define a route for updating user roles
  try {
    const user = await User.findById(req.params.id); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = req.body.role; // Update the user's role with the new role from the request body
    await user.save();  // Save the updated user to the database
    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });   // Handle any errors that occur during the update operation
  }
});

// Delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Find and delete the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle the case where the user is not found
    }
    res.json({ message: "User deleted successfully" }); // Send a success message
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get('/get', async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the database
      res.status(200).json(users);
    } catch (error) {   // Handle any errors that occur during the fetch operation
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
