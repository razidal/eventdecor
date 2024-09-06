const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const sendRegistrationConfirmationEmail = async (userEmail, userName) => {
  //using Google strategy for registeration and loging in
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
      subject: "Registration Confirmation",
      text:` Dear ${userName},\n\nThank you for registering!\n\nBest regards,\nYour Team,`
    };

    await transporter.sendMail(mailOptions);
    console.log("Registration confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  //checking all input fields 
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = new User({
      fullName,
      email,
      password,
      authType: "local",
      role: "User",
    });
    //encrypt the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //trying to send a confirmation mail and we don't want to delay the process
    try {
      await sendRegistrationConfirmationEmail(user.email, user.fullName);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    res.send({ user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.post("/google-login", async (req, res) => {
  const { email, googleId, fullName } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
    //if we don't have an existing user , create a new one
      user = new User({
        fullName,
        email,
        googleId: googleId || '', //to check if googleId is null or not
        authType: "google",
        role: "User",
      });
      await user.save();
    } else if (!user.googleId) {
      //check if user has googleId or not , if not give him one
      user.googleId = googleId;
      user.authType = "google";
      await user.save();
    }

    res.send({ user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
    //checking the existence of the entered user
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }

    res.status(200).send({ user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    //encrypting password with bcrypt
    const id = req.params.id;
    const update = { ...req.body };
    if (!update.password) {
      delete update.password;
    } else {
      update.password = await bcrypt.hash(update.password, 10);
    }
    //find user and update with id
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) {
      return res.status(404).send({ error: "User does not exist" });
    }
    return res.status(200).send({
      message: "User updated successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/users/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/user/id/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }
    res.status(200).send({ userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// To send verification code
router.post("/send-code", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).send({ error: "User does not exist" });
    }

    console.log("User found:", user.email);

    // Generate a random 4-digit code
    const code = crypto.randomInt(1000, 9999).toString();

    // Create the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password", // Use an app-specific password if using Gmail 2FA
      },
    });

    // Send the email with the verification code
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your verification code is ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error while sending email:", error);
        return res.status(500).send({ error: "Failed to send email." });
      }
      console.log("Email sent:", info.response);

      // Respond with the generated code (or store it for comparison later)
      res.status(200).send({ code });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send({ error: "Failed to send code. Please try again." });
  }
});

// To reset password
router.put("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ error: "Failed to reset password" });
  }
});

module.exports = router;
