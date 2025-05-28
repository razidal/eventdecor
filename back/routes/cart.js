const Order = require("../models/Order");
const express = require("express");
const User = require("../models/User");

const router = express.Router();
// Add a new order
router.post("/add", async (req, res) => {
  try {
    const newOrder = new Order(req.body); // Create a new Order instance with the request body
    await newOrder.save();
    // Populate the user details in the response
    res
      .status(200)
      .send({ message: "Order added successfully", Order: newOrder }); // Send the newOrder object in the response
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/all", async (req, res) => {
  try { // Fetch all orders from the database
    const Orders = await Order.find(); // Use find() instead of findOne() to get all orders
    res.status(200).send({ message: "All Orders", Orders: Orders }); // Send the array of orders in the response
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});
router.get("/allOrders", async (req, res) => {
  try { // Fetch all orders from the database
    const orders = await Order.find()
      .populate("userId") // Populate the user details
      .populate({
        path: "products.productId", // Populate the product details
        model: "PartyDecoration", // Ensure this matches the correct model for the product (PartyDecoration in your case)
        select: "name price", // Select the fields you want to include from the product model
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
  const email = req.params.email; // Get the email from the request parameters
 // Fetch all orders from the database
  try {
    const Order = await Order.findOne({ email: email }); // Use findOne() to get the order for the specified email
    if (!Order) { // Check if the order exists
      return res.status(400).send({ error: "Order does not exist" });
    }
    res.status(200).send({ message: "Order", Order: Order });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/user/:id/getOrders", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters
  try { // Fetch all orders for the specified user ID from the database
    const orders = await Order.find({ userId: userId }).populate({ // Use find() to get all orders for the specified user ID
      path: "products.productId",
      model: "PartyDecoration",
      select: "name price quantity",
    });
    if (!orders || orders.length === 0) { // Check if any orders exist for the user
      return res.status(404).send({ error: "No orders found for this user" }); // Return a 404 status code if no orders are found
    }
    res.status(200).send({ message: "Orders", orders: orders }); // Send the array of orders in the response
  } catch (err) {
    console.error(err); // Log any errors to the console
    res.status(500).send({ error: "Something went wrong" });
  }
});

module.exports = router;
