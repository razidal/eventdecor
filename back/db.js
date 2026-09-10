const mongoose = require("mongoose");

const connectDB = async () => { // async function to handle promise
  try {
    mongoose // mongoose library
      .connect("mongodb+srv://razidallasheh_db_user:lBuTVLog4rPL5VTO@cluster0.xupesy3.mongodb.net") // connect to MongoDB database
      .then(() => console.log("Connected to MongoDB")) // log success message
      .catch((err) => console.error("Could not connect to MongoDB", err)); // log error message
    console.log("MongoDB connection SUCCESS");
  } catch (err) { // catch any errors that occur during the connection process
    console.error("MongoDB connection FAIL");
    process.exit(1); // exit the process with a failure status code
  }
};

module.exports = connectDB; // export the connectDB function so it can be used in other parts of the application
