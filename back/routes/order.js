const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const nodemailer = require("nodemailer");

// Set up transporter globally
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "eventdeocr@gmail.com",
    pass: "qbuw ncuc xwxl snsh", // Use env variable in production
  },
});

// Update order status and send email
router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body;
  console.log("Update status called for order:", req.params.id, status);

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update order status
    order.status = status;
    await order.save();

    const user = await User.findById(order.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compose and send email
    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: user.email,
      subject: "Order Update Notification",
      text: `Your order status has been updated to ${status}. Order ID: ${order._id}`,
    };

    transporter.sendMail(mailOptions)
      .then(info => {
        console.log("Email sent:", info.response);
      })
      .catch(error => {
        console.error("Email sending failed:", error);
      });

    // Always respond success regardless of email result
    return res.status(200).json({ message: "Order status updated." });

  } catch (error) {
    console.error("Order update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Send password reset code
router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  console.log("Send code to:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: "User does not exist" });

    const code = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your verification code is ${code}`,
    };

    transporter.sendMail(mailOptions)
      .then(info => {
        console.log("Verification code sent:", info.response);
        res.status(200).send({ code });
      })
      .catch(error => {
        console.error("Failed to send verification email:", error);
        res.status(500).send({ error: "Failed to send email." });
      });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send({ error: "Failed to send code. Please try again." });
  }
});

module.exports = router;
