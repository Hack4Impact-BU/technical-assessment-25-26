import express from "express";
import LocationHistory from "../models/History.js";

const router = express.Router();
router.delete("/wipe", async (req, res) => {
  try {
    await LocationHistory.deleteMany({});
    res.status(200).json({ message: "History wiped clean!" });
  } catch (err) {
    console.error("Failed to wipe history:", err);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

router.get("/", async (req, res) => {
  try {
    const allHistory = await LocationHistory.find().sort({ timestamp: -1 });
    res.json(allHistory);
  } catch (err) {
    console.error("Failed to fetch history:", err);
    res.status(500).json({ error: "Failed to fetch history data" });
  }
});

router.post("/", async (req, res) => {
  const { clickedData, twinData } = req.body;

  try {
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
        latitude: twinData.latitude,
        longitude: twinData.longitude,
        location: twinData.location,
        sunrise: twinData.sunrise,
        sunset: twinData.sunset,
        fun_fact: twinData.fun_fact,
        country_code: twinData.country_code || null,
      },
    });
    await newEntry.save();
    res.status(201).json({ message: "Saved to history" });
  } catch (err) {
    console.error("Failed to save history:", err);
    res.status(500).json({ error: "Could not save history" });
  }
});

export default router;