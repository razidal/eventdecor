const express = require("express");
const router = express.Router();
const PartyDecoration = require("../models/PartyDecoration");

// Add a new party decoration
router.post("/add", async (req, res) => {
  try {
    const newDecoration = new PartyDecoration(req.body); // Assuming the request body contains the decoration data
    const validationError = newDecoration.validateSync();
    if (validationError) { // Validate the decoration data
      return res.status(400).json({ error: validationError.message });
    }
    await newDecoration.save(); // Save the decoration to the database
    res.status(201).json({
      message: "Decoration added successfully",
      decoration: newDecoration, // Return the added decoration in the response
    });
  } catch (err) { // Handle any errors that occur during the process
    console.error(err);
    res.status(500).json({ error: "Failed to add decoration" });
  }
});

// Get all party decorations
router.get("/all", async (req, res) => {
  try {  // Fetch all decorations from the database
    const decorations = await PartyDecoration.find();
    res
      .status(200)
      .json({ message: "All decorations", decorations: decorations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch decorations" });
  }
});
router.get("/categories", async (req, res) => {
  try { // Fetch all unique categories from the database
    const categories = await PartyDecoration.distinct("category");
    res.json(categories);  // Return the categories in the response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/themes", async (req, res) => {
  try { // Fetch all unique themes from the database
    const themes = await PartyDecoration.distinct("theme");
    res.json(themes);
  } catch (error) { // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
});

router.get("/occasions", async (req, res) => {
  try { // Fetch all unique occasions from the database
    const occasions = await PartyDecoration.distinct("occasion"); // Return the occasions in the response
    res.json(occasions);
  } catch (error) { // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
});
// Get a specific party decoration by ID
router.get("/get/:id", async (req, res) => {
  try {
    const decoration = await PartyDecoration.findById(req.params.id);
    if (!decoration) { // Check if the decoration exists in the database
      return res.status(404).json({ error: "Decoration not found" });
    }
    res
      .status(200)
      .json({ message: "Decoration found", decoration: decoration });
  } catch (err) {
    console.error(err); // Handle any errors that occur during the process
    if (err.kind === "ObjectId") { // Check if the provided ID is invalid
      return res.status(400).json({ error: "Invalid decoration ID" });
    }
    res.status(500).json({ error: "Failed to fetch decoration" });
  }
});

// Update a party decoration
router.put("/update/:id", async (req, res) => {
  try { // Find the decoration by ID and update it with the new data
    const updatedDecoration = await PartyDecoration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Validate the updated data
    );
    if (!updatedDecoration) { // Check if the decoration exists in the database
      return res.status(404).json({ error: "Decoration not found" });
    }
    res.status(200).json({ // Return the updated decoration in the response
      message: "Decoration updated successfully",
      decoration: updatedDecoration,
    });
  } catch (err) { // Handle any errors that occur during the process
    console.error(err);
    res.status(500).json({ error: "Failed to update decoration" });
  }
});

// Delete a party decoration
router.delete("/delete/:id", async (req, res) => {
  try { // Find the decoration by ID and delete it from the database
    const deletedDecoration = await PartyDecoration.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDecoration) { // Check if the decoration exists in the database
      return res.status(404).json({ error: "Decoration not found" });
    }
    res.status(200).json({
      message: "Decoration deleted successfully",
      decoration: deletedDecoration,
    });
  } catch (err) {  // Handle any errors that occur during the process
    console.error(err);
    if (err.kind === "ObjectId") { // Check if the provided ID is invalid
      return res.status(400).json({ error: "Invalid decoration ID" });
    }
    res.status(500).json({ error: "Failed to delete decoration" });
  }
});
router.get("/categories", async (req, res) => {
  try { // Fetch all unique categories from the database
    const categories = await PartyDecoration.distinct("category");
    res.json(categories);
  } catch (error) { // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
});

router.get("/themes", async (req, res) => {
  try { // Fetch all unique themes from the database
    const themes = await PartyDecoration.distinct("theme");
    res.json(themes);
  } catch (error) { // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
});

router.get("/occasions", async (req, res) => {
  try { // Fetch all unique occasions from the database
    const occasions = await PartyDecoration.distinct("occasion");
    res.json(occasions);
  } catch (error) {   // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
