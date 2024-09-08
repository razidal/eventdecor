const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authType === "local";
      },
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    address: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
    },
    dateOfBirth: 
    { type: Date,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
