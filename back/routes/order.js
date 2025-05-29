const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path to your Order model is correct
const User = require('../models/User'); // Ensure the path to your User model is correct
const nodemailer = require("nodemailer");
// Route to delete an order
require('dotenv').config();

router.put('/update-status/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: updatedOrder.userId.email,
      subject: `Order #${updatedOrder._id} Status Update`,
      text: `Your order status has been updated to: ${status}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// router.post("/send-code", async (req, res) => {
//   const { email } = req.body; //  getting email from the request body
//   console.log(email);
//   try {
//     const user = await User.findOne({ email }); 
//     if (!user) {
//       return res.status(400).send({ error: "User does not exist" });
//     }
//     // Create the nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS, // Use an app-specific password if using Gmail 2FA
//       },
//     });

//     // Send the email with the verification code
//     const mailOptions = {
//       from: EMAIL_USER,
//       to: email, // recipient's email address
//       subject: "Password Reset Code", // subject of the email
//       text: `Your verification code is ${code}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => { //callback function to check if the email is sent or not
//       if (error) {
//         console.error("Error while sending email:", error);
//         return res.status(500).send({ error: "Failed to send email." });
//       }
//       console.log("Email sent:", info.response); //log the response if the email is sent successfully

//       // Respond with the generated code (or store it for comparison later)
//       res.status(200).send({ code });
//     });
//   } catch (err) { //catch any errors that occur during the process
//     console.error("Unexpected error:", err);
//     res.status(500).send({ error: "Failed to send code. Please try again." });
//   }
// });

module.exports = router;
