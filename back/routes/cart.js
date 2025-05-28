const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");

const router = express.Router();

// Add a new order
router.post("/add", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(200).send({ message: "Order added successfully", order: newOrder });
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// Get all orders (Admin)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Populate user's name and email
      .populate({
        path: "products.productId",
        model: "PartyDecoration", // Match your model name
        select: "name price", // Select product fields to return
      });

    res.status(200).send({ message: "All Orders", orders });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// Get orders by user email
router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const orders = await Order.find({ userId: user._id })
      .populate("products.productId", "name price");

    if (!orders.length) {
      return res.status(404).send({ error: "No orders found for this user" });
    }

    res.status(200).send({ message: "User Orders", orders });
  } catch (err) {
    console.error("Error fetching user orders by email:", err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// Get orders by user ID (User Dashboard)
router.get("/user/:id/getOrders", async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ userId })
      .populate({
        path: "products.productId",
        model: "PartyDecoration",
        select: "name price quantity",
      });

    if (!orders.length) {
      return res.status(404).send({ error: "No orders found for this user" });
    }

    res.status(200).send({ message: "Orders", orders });
  } catch (err) {
    console.error("Error fetching user orders by ID:", err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

module.exports = router;
