const HistoryEntry = require("../models/historyEntry");

// Get all history entries
const getAllEntries = async (req, res) => {
  try {
    const entries = await HistoryEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching history entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new history entry
const createEntry = async (req, res) => {
  const { latitude, longitude, googleGeminiResponse } = req.body;

  const newEntry = new HistoryEntry({
    latitude,
    longitude,
    googleGeminiResponse,
  });

  try {
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error creating history entry:", error);
    res.status(500).json({ error: "Failed to create a new history entry" });
  }
};

module.exports = {
  getAllEntries,
  createEntry,
}; 