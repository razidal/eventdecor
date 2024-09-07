const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const User = require("../models/User");
const PartyDecoration = require("../models/PartyDecoration");
const stripe = require("stripe")("sk_test_51PwNVNDPvgfjYdfi0WlwoFXRVX2KUSerAJQS3jqtL0K9opavbhuePjqEicoR8kyYcia86YYQZDlL6NqW8McxTqlO00LD1Y5EM8");

const sendOrderConfirmationEmail = async (userEmail, orderData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "eventdeocr@gmail.com",
        pass: "qbuw ncuc xwxl snsh",
      },
    });

    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: userEmail,
      subject: "Order Confirmation",
      text: `Thank you for your order! Your order ID is: ${orderData._id}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/user/:id/new_order", async (req, res) => {
  const userId = req.params.id;
  console.log("Received new order request:", req.body);

  if (userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).send({ error: "User does not exist" });
      }

      const { products, totalAmount } = req.body;

      for (const product of products) {
        const decoration = await PartyDecoration.findById(product.productId);
        if (!decoration) {
          return res
            .status(400)
            .send({ error: `Product ${product.productId} not found `});
        }
        if (decoration.stockQuantity < product.quantity) {
          return res.status(400).send({
            error: `Insufficient stock for product ${decoration.name}`,
          });
        }
      }

      const newOrder = new Order({
        userId,
        products,
        totalAmount,
        address: req.body.address,
        status: "Pending",
      });

      await newOrder.save();

      for (const product of products) {
        await PartyDecoration.findByIdAndUpdate(product.productId, {
          $inc: { stockQuantity: -product.quantity },
        });
      }

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

// Process payment
router.post("/process-payment", async (req, res) => {
  const { userId, cartData, totalPrice, email, address, cardInfo } = req.body;

  try {
    // Create Stripe token
    const token = await stripe.tokens.create({
      card: {
        number: cardInfo.cardNumber,
        exp_month: cardInfo.expiryMonth,
        exp_year: cardInfo.expiryYear,
        cvc: cardInfo.cvv,
        name: cardInfo.cardholderName,
      },
    });

    // Charge the card using the token
    const charge = await stripe.charges.create({
      amount: totalPrice * 100, // Stripe expects the amount in cents
      currency: "usd",
      source: token.id,
      description: `Order by user ${userId}`,
    });

    // Save the order in the database
    const newOrder = new Order({
      userId,
      products: cartData.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentInfo: {
        cardholderName: cardInfo.cardholderName,
        cardToken: token.id,  // Storing token instead of actual card number
        expiryDate: `${cardInfo.expiryMonth}/${cardInfo.expiryYear}`,
      },
      address,
    });

    await newOrder.save();

    res.status(200).json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error("Payment processing failed:", error);
    res.status(500).json({ success: false, error: "Payment failed" });
  }
});

module.exports = router;
