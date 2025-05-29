const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const nodemailer = require("nodemailer");
require('dotenv').config();

const EMAIL_USER = process.env.EMAIL_USER 
const EMAIL_PASS = process.env.EMAIL_PASS 
// Helper function to send email on status update
const sendStatusUpdateEmail = async (fullName, userEmail, orderId, newStatus) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS, // move to .env in production
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: userEmail,
      subject: "Order Status Update",
      text: `Hello ${fullName},\n\nYour order with ID ${orderId} has been updated to: ${newStatus}.\n\nThank you for shopping with us!\nEvent Decor Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Status update email sent successfully");
  } catch (error) {
    console.error("Error sending status update email:", error);
  }
};

// Update order status and notify user
router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  console.log("Updating order status:", orderId, "->", status);

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("Order not found for id:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("Order found:", order);

    const user = await User.findById(order.userId);
    if (!user) {
      console.log("User not found for userId:", order.userId);
      return res.status(404).json({ error: "User not found" });
    }

    order.status = status;
    await order.save();

    sendStatusUpdateEmail(user.fullName, user.email, order._id, status);

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Send password reset code
router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  console.log("Sending verification code to:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: "User does not exist" });

    const code = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Your verification code is ${code}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
    res.status(200).send({ code });

  } catch (err) {
    console.error("Error sending verification email:", err);
    res.status(500).send({ error: "Failed to send code. Please try again." });
  }
});

module.exports = router;
