// In routes/user.js or your preferred routes file
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Update user role
router.put("/update-role/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = req.body.role;
    await user.save();
    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get('/get', async (req, res) => {
    try {
      const users = await User.find({}, '-password'); // Exclude the password field
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
