const Order = require("../models/Order");
const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    res
      .status(200)
      .send({ message: "Order added successfully", Order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).send({ message: "All Orders", Orders: Orders });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});
router.get("/allOrders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId") // Populate the user details
      .populate({
        path: "products.productId",
        model: "PartyDecoration", // Ensure this matches the correct model for the product (PartyDecoration in your case)
        select: "name price",
      });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders with populate:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch orders", details: err.message });
  }
});
router.get("/user/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const Order = await Order.findOne({ email: email }); // Use _id instead of id
    if (!Order) {
      return res.status(400).send({ error: "Order does not exist" });
    }
    res.status(200).send({ message: "Order", Order: Order });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/user/:id/getOrders", async (req, res) => {
  const userId = req.params.id;
  try {
    const orders = await Order.find({ userId: userId }).populate({
      path: "products.productId",
      model: "PartyDecoration",
      select: "name price quantity",
    });
    if (!orders || orders.length === 0) {
      return res.status(404).send({ error: "No orders found for this user" });
    }
    res.status(200).send({ message: "Orders", orders: orders });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

module.exports = router;
