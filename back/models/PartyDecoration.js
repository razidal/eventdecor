const mongoose = require("mongoose");

const PartyDecorationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Balloons",
        "Banners",
        "Tableware",
        "Lighting",
        "Party Favors",
        "Other",
      ],
    },
    color: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
    },
    occasion: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    isReusable: {
      type: Boolean,
      default: false,
    },
    ageGroup: {
      type: String,
      enum: ["Kids", "Teens", "Adults", "All Ages"],
    },
    brand: String,
    weight: Number,
    packageQuantity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartyDecoration", PartyDecorationSchema);
