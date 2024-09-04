const mongoose = require("mongoose");
const PartyDecoration = require("../models/PartyDecoration"); // Adjust the path as needed

// Connect to your MongoDB database
mongoose.connect("mongodb+srv://razidal:eventdecor123@cluster0.eldvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const decorations = [
  {
    name: "Colorful Balloon Set",
    price: 15.99,
    description: "Set of 50 colorful latex balloons",
    stockQuantity: 100,
    imageUrl: "https://example.com/balloon-set.jpg",
    category: "Balloons",
    color: "Multi",
    theme: "Birthday",
    occasion: "Birthday",
    material: "Latex",
    isReusable: false,
    ageGroup: "All Ages",
    packageQuantity: 50,
  },
  {
    name: "Happy Birthday Banner",
    price: 9.99,
    description: "Festive banner with 'Happy Birthday' text",
    stockQuantity: 75,
    imageUrl: "https://example.com/birthday-banner.jpg",
    category: "Banners",
    color: "Gold",
    theme: "Birthday",
    occasion: "Birthday",
    material: "Paper",
    isReusable: true,
    ageGroup: "All Ages",
    dimensions: { length: 200, width: 30 },
  },
  {
    name: "Unicorn Party Plates",
    price: 12.99,
    description: "Set of 24 unicorn-themed disposable plates",
    stockQuantity: 50,
    imageUrl: "https://example.com/unicorn-plates.jpg",
    category: "Tableware",
    color: "Pink",
    theme: "Fantasy",
    occasion: "Birthday",
    material: "Paper",
    isReusable: false,
    ageGroup: "Kids",
    packageQuantity: 24,
  },
  {
    name: "LED String Lights",
    price: 24.99,
    description: "10m string of warm white LED lights",
    stockQuantity: 30,
    imageUrl: "https://example.com/string-lights.jpg",
    category: "Lighting",
    color: "Warm White",
    theme: "General",
    occasion: "All",
    material: "Plastic",
    isReusable: true,
    ageGroup: "All Ages",
    dimensions: { length: 1000 },
  },
  {
    name: "Pirate Theme Decorations Set",
    price: 29.99,
    description: "Complete set of pirate-themed party decorations",
    stockQuantity: 25,
    imageUrl: "https://example.com/pirate-set.jpg",
    category: "Party Favors",
    color: "Multi",
    theme: "Pirate",
    occasion: "Birthday",
    material: "Various",
    isReusable: true,
    ageGroup: "Kids",
  },
  {
    name: "Confetti Cannons",
    price: 19.99,
    description: "Set of 5 confetti cannons for festive explosions",
    stockQuantity: 40,
    imageUrl: "https://example.com/confetti-cannons.jpg",
    category: "Other",
    color: "Multi",
    theme: "Celebration",
    occasion: "All",
    material: "Paper, Plastic",
    isReusable: false,
    ageGroup: "All Ages",
    packageQuantity: 5,
  },
  {
    name: "Wedding Arch",
    price: 89.99,
    description: "Elegant white arch for wedding ceremonies",
    stockQuantity: 10,
    imageUrl: "https://example.com/wedding-arch.jpg",
    category: "Other",
    color: "White",
    theme: "Wedding",
    occasion: "Wedding",
    material: "Metal, Fabric",
    isReusable: true,
    ageGroup: "Adults",
    dimensions: { height: 230, width: 200 },
  },
  {
    name: "Halloween Pumpkin Lanterns",
    price: 14.99,
    description: "Set of 3 battery-operated pumpkin lanterns",
    stockQuantity: 60,
    imageUrl: "https://example.com/pumpkin-lanterns.jpg",
    category: "Lighting",
    color: "Orange",
    theme: "Halloween",
    occasion: "Halloween",
    material: "Plastic",
    isReusable: true,
    ageGroup: "All Ages",
    packageQuantity: 3,
  },
  {
    name: "New Year's Eve Party Kit",
    price: 34.99,
    description: "Complete kit for a New Year's Eve party for 10 people",
    stockQuantity: 20,
    imageUrl: "https://example.com/new-year-kit.jpg",
    category: "Party Favors",
    color: "Gold, Silver",
    theme: "New Year",
    occasion: "New Year's Eve",
    material: "Various",
    isReusable: false,
    ageGroup: "Adults",
    packageQuantity: 1,
  },
  {
    name: "Floral Centerpiece",
    price: 39.99,
    description: "Artificial flower centerpiece for tables",
    stockQuantity: 15,
    imageUrl: "https://example.com/floral-centerpiece.jpg",
    category: "Other",
    color: "Multi",
    theme: "Floral",
    occasion: "All",
    material: "Silk, Plastic",
    isReusable: true,
    ageGroup: "All Ages",
    dimensions: { height: 30, width: 30, depth: 30 },
  },
];

async function addDecorations() {
  try {
    const currentDate = new Date();
    for (const decoration of decorations) {
      const newDecoration = new PartyDecoration(decoration);
      await newDecoration.save();
      console.log(`Added: ${decoration.name}`);
    }
    console.log("All decorations have been added successfully!");
    console.log(currentDate.toString());
  } catch (error) {
    console.error("Error adding decorations:", error);
  } finally {
    mongoose.disconnect();
  }
}

addDecorations();
