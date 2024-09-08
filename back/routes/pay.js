const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const User = require("../models/User");
const PartyDecoration = require("../models/PartyDecoration");


const sendOrderConfirmationEmail = async (userEmail, orderData) => { 
  try { // Set up the email transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({ // Replace with your email service provider's SMTP settings
      service: "Gmail", // Example: "Gmail" or "Outlook"
      auth: {   // Replace with your email credentials
        user: "eventdeocr@gmail.com",
        pass: "qbuw ncuc xwxl snsh",
      },
    });
    // Set up the email options
    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: userEmail,
      subject: "Order Confirmation",
      text: `Thank you for your order! Your order ID is: ${orderData._id}`,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/user/:id/new_order", async (req, res) => {
  const userId = req.params.id;
  console.log("Received new order request:", req.body);
  // Validate the request data and user existence here
  if (userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).send({ error: "User does not exist" });
      }
      // Validate and process the order data here
      const { products, totalAmount } = req.body;
      // Add more validation as needed
      for (const product of products) {
        const decoration = await PartyDecoration.findById(product.productId);
        if (!decoration) { // Product not found
          return res
            .status(400)
            .send({ error: `Product ${product.productId} not found `});
        }
        if (decoration.stockQuantity < product.quantity) { // Insufficient stock
          return res.status(400).send({ 
            error: `Insufficient stock for product ${decoration.name}`,
          });
        }
      }
      // Create a new order
      const newOrder = new Order({
        userId,
        products,
        totalAmount,
        address: req.body.address,
        status: "Pending",
      });
      // Save the order to the database 
      await newOrder.save();
      // Update the stock quantity of the products in the database
      for (const product of products) {
        await PartyDecoration.findByIdAndUpdate(product.productId, {
          $inc: { stockQuantity: -product.quantity }, // Decrease the stock quantity
        });
      }
      // Send order confirmation email to the user
      await sendOrderConfirmationEmail(user.email, newOrder);

      res
        .status(200)
        .send({ message: "Order created successfully", order: newOrder });
    } catch (err) {
      console.error("Error saving order:", err);
      res.status(500).send({ error: "Something went wrong" });
    }
  } else {
    res.status(400).send({ error: "User ID is required" });
  }
});

router.post("/process-payment", async (req, res) => {
  console.log("Received payment request:", req.body);
  
  const { userId, cartData, totalPrice, paymentMethod, email, address } =
    req.body;
  // Validate the request data here
  if (
    !userId ||
    !cartData ||
    !totalPrice ||
    !paymentMethod ||
    !email ||
    !address
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Missing or invalid required fields" });
  }
  // Validate the address data here
  if (
    !address.street ||
    !address.city ||
    !address.postalCode ||
    !address.country
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid address data" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Validate and process the cart data here
    for (const item of cartData) {
      const product = await PartyDecoration.findById(item.productId);
      if (!product) { // Product not found
        return res.status(404).json({
          success: false,
          error:` Product ${item.productId} not found`,
        });
      }
      if (product.stockQuantity < item.quantity) { // Insufficient stock
        return res.status(400).json({
          success: false,
          error:` Insufficient stock for product ${product.name}`,
        });
      }
    }
    // Process the payment here 
    const newOrder = new Order({
      userId,
      products: cartData.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentMethod,
      status: "Completed",
      address,
    });

    await newOrder.save();
    // Update the stock quantity of the products in the database
    for (const item of cartData) {
      await PartyDecoration.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity }, // Decrease the stock quantity
      });
    }

    await sendOrderConfirmationEmail(email, newOrder);

    res.status(200).json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error("Error processing payment:", error);
    if (error.name === "ValidationError") { // Mongoose validation error
      res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    } else { // Other errors
      res.status(500).json({
        success: false,
        error: "Order processing failed",
        details: error.message,
      });
    }
  }
});

module.exports = router;
