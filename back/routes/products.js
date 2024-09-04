const express = require("express");
const router = express.Router();
const PartyDecoration = require("../models/PartyDecoration");

// Add a new party decoration
router.post("/add", async (req, res) => {
  try {
    const newDecoration = new PartyDecoration(req.body);
    const validationError = newDecoration.validateSync();
    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }
    await newDecoration.save();
    res.status(201).json({
      message: "Decoration added successfully",
      decoration: newDecoration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add decoration" });
  }
});

// Get all party decorations
router.get("/all", async (req, res) => {
  try {
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
  try {
    const categories = await PartyDecoration.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/themes", async (req, res) => {
  try {
    const themes = await PartyDecoration.distinct("theme");
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/occasions", async (req, res) => {
  try {
    const occasions = await PartyDecoration.distinct("occasion");
    res.json(occasions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a specific party decoration by ID
router.get("/get/:id", async (req, res) => {
  try {
    const decoration = await PartyDecoration.findById(req.params.id);
    if (!decoration) {
      return res.status(404).json({ error: "Decoration not found" });
    }
    res
      .status(200)
      .json({ message: "Decoration found", decoration: decoration });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid decoration ID" });
    }
    res.status(500).json({ error: "Failed to fetch decoration" });
  }
});

// Update a party decoration
router.put("/update/:id", async (req, res) => {
  try {
    const updatedDecoration = await PartyDecoration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDecoration) {
      return res.status(404).json({ error: "Decoration not found" });
    }
    res.status(200).json({
      message: "Decoration updated successfully",
      decoration: updatedDecoration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update decoration" });
  }
});

// Delete a party decoration
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedDecoration = await PartyDecoration.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDecoration) {
      return res.status(404).json({ error: "Decoration not found" });
    }
    res.status(200).json({
      message: "Decoration deleted successfully",
      decoration: deletedDecoration,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid decoration ID" });
    }
    res.status(500).json({ error: "Failed to delete decoration" });
  }
});
router.get("/categories", async (req, res) => {
  try {
    const categories = await PartyDecoration.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/themes", async (req, res) => {
  try {
    const themes = await PartyDecoration.distinct("theme");
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/occasions", async (req, res) => {
  try {
    const occasions = await PartyDecoration.distinct("occasion");
    res.json(occasions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
