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

router.get("/allOrders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "userId",
        model: "User",
        select: "fullName email", // Include fullName for frontend
      })
      .populate({
        path: "products.productId",
        model: "PartyDecoration",
        select: "name price",
      });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders with populate:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
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
