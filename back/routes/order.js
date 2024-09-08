const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path to your Order model is correct

// Route to delete an order
router.delete("/delete/:id", async (req, res) => {
  // Log the received delete request for debugging purposes
  console.log(`Received delete request for order ID: ${req.params.id}`);
  try { // Attempt to delete the order
    const deletedOrder = await Order.findByIdAndDelete(req.params.id); // Find the order by ID and delete it
    if (!deletedOrder) { // If the order is not found, return a 404 error
      return res.status(404).json({ error: "Order not found" }); 
    }
    res.status(200).json({  // If the order is successfully deleted, return a 200 OK response
      message: "Order deleted successfully",
      order: deletedOrder  // Include the deleted order in the response
    });
    deletedOrder.status = 'Cancelled'; // Update the status to 'Cancelled'
  } catch (err) { // If an error occurs during the delete operation, log the error and return a 500 error
    console.error(err);
    if (err.kind === "ObjectId") { // If the error is due to an invalid ObjectId, return a 400 error
      return res.status(400).json({ error: "Invalid order ID" });
    }
    res.status(500).json({ error: "Failed to delete order" });
  }
});



module.exports = router;
