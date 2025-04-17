import express from "express";
import { summarizeTwinLocation } from "../utils/twinGemini.js";
import LocationHistory from "../models/History.js";

const router = express.Router();

// GET /api/history — get all saved entries
router.get("/", async (req, res) => {
  try {
    const allHistory = await LocationHistory.find().sort({ createdAt: -1 }); // newest first
    res.json(allHistory);
  } catch (err) {
    console.error("❌ Failed to fetch history:", err);
    res.status(500).json({ error: "Failed to fetch history data" });
  }
});

router.post("/", async (req, res) => {
  const { clickedData, twinData } = req.body;

  try {
    // Step 1: Try to summarize twin location
    const summaryResult = await summarizeTwinLocation(twinData.fun_fact);
    const summaryLocation = summaryResult?.summaryLocation || twinData.location;

    // Step 2: Save everything to MongoDB
    const newEntry = new LocationHistory({
      clicked: {
        latitude: clickedData.latitude,
        longitude: clickedData.longitude,
        sunrise: clickedData.sunrise,
        sunset: clickedData.sunset,
        location: clickedData.location,
        description: clickedData.description,
        country_code: clickedData.country_code,
      },
      twin: {
        location: twinData.location,
        summary_location: summaryLocation,
        sunrise: twinData.sunrise,
        sunset: twinData.sunset,
        fun_fact: twinData.fun_fact,
        country_code: twinData.country_code || null,
      },
    });

    await newEntry.save();
    res.status(201).json({ message: "✅ Saved to history", summaryLocation });
  } catch (err) {
    console.error("❌ Failed to save history:", err);
    res.status(500).json({ error: "Could not save history" });
  }
});

export default router;