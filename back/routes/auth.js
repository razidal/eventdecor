const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const sendRegistrationConfirmationEmail = async (userEmail, userName) => {
  //using Google strategy for registeration and loging in
  try {
    const transporter = nodemailer.createTransport({ //using nodemailer to send email to the user
      service: "Gmail",
      auth: {
        user: "eventdeocr@gmail.com", //sender email
        pass: "qbuw ncuc xwxl snsh", //sender password
      },
    });

    const mailOptions = {
      from: "eventdeocr@gmail.com",
      to: userEmail, //reciever email
      subject: "Registration Confirmation", // subject of the email
      text:` Dear ${userName},\n\nThank you for registering!\n\nBest regards,\nYour Team,` //email body
    };

    await transporter.sendMail(mailOptions); // sending the email
    console.log("Registration confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/register", async (req, res) => {
  const { fullName, email, password , dateOfBirth } = req.body; // getting the data from the request body

  //checking all input fields 
  if (!fullName || !email || !password || !dateOfBirth) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try { //trying to register the user
    let user = await User.findOne({ email });
//checking if the user already exists
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    } //if the user does not exist, create a new user
    user = new User({
      fullName,
      email,
      password,
      authType: "local",
      role: "User",
      dateOfBirth: dateOfBirth,
    });
    //encrypt the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //trying to send a confirmation mail and we don't want to delay the process
    try {
      await sendRegistrationConfirmationEmail(user.email, user.fullName);
    } catch (emailError) { //if there is an error sending the email, log it and continue with the registration process
      console.error("Failed to send confirmation email:", emailError);
    }
    //if the user is registered successfully, send a success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //checking all input fields
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }
    //check if the user is registered using google or local strategy
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { //check if the password is correct
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
  //checking all input fields
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
      await user.save(); //save the user to the database
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
    //if the user exists, send the user data
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
    if (!update.password) { //if the user did not enter a new password, don't update the password
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
  try { //fetching all users
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/user/id/:email", async (req, res) => {
  const email = req.params.email;
//fetching user id with email
  try {
    const user = await User.findOne({ email }); //find user with email
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
  const { email } = req.body; //  getting email from the request body
  console.log(email);
  try {
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }

    // Generate and send verification code logic
    const code = Math.floor(1000 + Math.random() * 9000).toString();

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

// To reset password
router.put("/reset-password", async (req, res) => {
  const { email, password } = req.body; //  getting email and password from the request body
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }
    //encrypting password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword; //update the password with the new hashed password
    await user.save(); //save the user to the database

    res.status(200).send({ message: "Password updated successfully" }); //send a success message
  } catch (err) {
    res.status(500).send({ error: "Failed to reset password" }); //send an error message if something goes wrong
  }
});

module.exports = router; //exporting the router
