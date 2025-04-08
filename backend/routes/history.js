const express = require("express");
const router = express.Router();
const HistoryEntry = require("../models/historyEntry");

// get all history entries
router.get("/", async (req, res) => {
  try {
    // find (mongoose) all documents from the collection
    const entries = await HistoryEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching history entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// create a new history entry
router.post("/", async (req, res) => {
  // retrieve data from the request body
  const { latitude, longitude, googleGeminiResponse } = req.body;

  // create a new history entry using defined schema
  const newEntry = new HistoryEntry({
    latitude,
    longitude,
    googleGeminiResponse,
  });

  try {
    // save (mongoose) the new entry to the database
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error creating history entry:", error);
    res.status(500).json({ error: "Failed to create a new history entry" });
  }
});

module.exports = router;
