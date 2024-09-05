const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path to your Order model is correct

// Route to delete an order
router.delete('/delete/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
      order: deletedOrder,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    res.status(500).json({ error: 'Failed to delete order' });
  }
});


module.exports = router;
