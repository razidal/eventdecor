const express = require("express");
const app = express();
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cardRoutes = require("./routes/cart");
const payRoutes = require("./routes/pay");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/users");
const cors = require("cors");
app.use(express.json());

app.use(cors(
   { origin:"https://eventdecor1.netlify.app",
    credentials:true
   }
)); // Use this after the variable declaration
app.use('/users', userRoutes);
app.use('/order', orderRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cardRoutes);
app.use("/pay", payRoutes);
const PORT = process.env.PORT || 3000; // Use the provided port or default to 3000

connectDB().then(()=>{  // Connect to the database before starting the server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server after the database connection is established
}).catch(err=>{ // Handle any errors that occur during the database connection
    console.error("Faild",err)
    process.exit(1) // Exit the process with a failure status code
})


