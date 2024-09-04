const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect("mongodb+srv://razidal:eventdecor123@cluster0.eldvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("Could not connect to MongoDB", err));
    console.log("MongoDB connection SUCCESS");
  } catch (err) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;
