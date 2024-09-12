const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path to your Order model is correct
const User = require('../models/User'); // Ensure the path to your User model is correct
// Route to delete an order
router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body; //  getting email from the request body
  // Log the received delete request for debugging purposes
  console.log(`Received delete request for order ID: ${req.params.id}`);
  try { // Attempt to delete the order
    const order = await User.findOne(req.params.id); 
    if (!order) {
      return res.status(400).send({ error: "User does not exist" });
    }
    res.status(200).json({  // If the order is successfully deleted, return a 200 OK response
      message: "Order deleted successfully",
      order: order  // Include the deleted order in the response
    });
    order.status = status; // Update the status of order
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
      subject: "Order Cancellation", // subject of the email
      text: `Your order has been ${status}, order id: ${req.params.id}`,
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
  } catch (err) { // If an error occurs during the delete operation, log the error and return a 500 error
    console.error(err);
    if (err.kind === "ObjectId") { // If the error is due to an invalid ObjectId, return a 400 error
      return res.status(400).json({ error: "Invalid order ID" });
    }
    res.status(500).json({ error: "Failed to delete order" });
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
