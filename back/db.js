const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => { // async function to handle promise
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB"); // log success message
    console.log("MongoDB connection SUCCESS");
  } catch (err) { // catch any errors that occur during the connection process
    console.error("Could not connect to MongoDB", err); // log error message
    console.error("MongoDB connection FAIL");
    throw err;
  }
};

module.exports = connectDB; // export the connectDB function so it can be used in other parts of the application
