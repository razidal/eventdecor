const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path to your Order model is correct
const User = require('../models/User'); // Ensure the path to your User model is correct
// Route to delete an order

router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body; // New status to update

  try {
    // Find the order by ID
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch the user associated with the order
    const user = await User.findById(order.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Set up the email sending process
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "eventdeocr@gmail.com",
        pass: "qbuw ncuc xwxl snsh", // Gmail app-specific password
      },
    });

    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: user.email, // User's email from the User model
      subject: "Order Status Update",
      text: `Your order has been ${status}. Order ID: ${req.params.id}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error while sending email:", error);
        return res.status(500).json({ error: "Failed to send email." });
      }

      res.status(200).json({ message: "Order status updated and email sent." });
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

router.post("/send-code", async (req, res) => {
  const { email } = req.body; //  getting email from the request body
  console.log(email);
  try {
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }
    // Create the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "eventdeocr@gmail.com",
        pass: "qbuw ncuc xwxl snsh", // Use an app-specific password if using Gmail 2FA
      },
    });

    // Send the email with the verification code
    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: email, // recipient's email address
      subject: "Password Reset Code", // subject of the email
      text: `Your verification code is ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => { //callback function to check if the email is sent or not
      if (error) {
        console.error("Error while sending email:", error);
        return res.status(500).send({ error: "Failed to send email." });
      }
      console.log("Email sent:", info.response); //log the response if the email is sent successfully

      // Respond with the generated code (or store it for comparison later)
      res.status(200).send({ code });
    });
  } catch (err) { //catch any errors that occur during the process
    console.error("Unexpected error:", err);
    res.status(500).send({ error: "Failed to send code. Please try again." });
  }
});

module.exports = router;
