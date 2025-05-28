const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path to your Order model is correct
const User = require('../models/User'); // Ensure the path to your User model is correct
const nodemailer = require("nodemailer");

// Create reusable transporter for email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "eventdeocr@gmail.com",
    pass: "qbuw ncuc xwxl snsh", // Consider storing this securely
  },
});

// Route to update order status and send email
router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body;
  console.log("Update status called for order:", req.params.id, status);

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Get user details
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compose email
    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: user.email,
      subject: "Order Update Notification",
      text: `Your order status has been updated to ${status}. Order ID: ${order._id}`,
    };

    // Send email with async/await
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return res.status(200).json({ message: "Order status updated and email sent." });
    } catch (emailError) {
      console.error("Error while sending email:", emailError);
      return res.status(500).json({ error: "Order updated, but failed to send email." });
    }

  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Failed to update order status." });
  }
});

// Route to send password reset code
router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }

    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your verification code is ${code}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return res.status(200).send({ code });
    } catch (emailError) {
      console.error("Error while sending email:", emailError);
      return res.status(500).send({ error: "Failed to send email." });
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send({ error: "Failed to send code. Please try again." });
  }
});

module.exports = router;
