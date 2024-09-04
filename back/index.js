const express = require("express");
const app = express();
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cardRoutes = require("./routes/cart");
const payRoutes = require("./routes/pay");
const cors = require("cors");
app.use(express.json());

app.use(cors(
   { origin:"https://eventdecor1.netlify.app",
    credentials:true
   }
)); // Use this after the variable declara

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cardRoutes);
app.use("/pay", payRoutes);
const PORT = process.env.PORT || 3000;
connectDB().then(()=>{
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err=>{
    console.error("Faild",err)
    process.exit(1)
})


