import express from "express";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { getLocationDescription } from "../utils/youGemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const sunrise = getSunrise(lat, lng).toISOString();
    const sunset = getSunset(lat, lng).toISOString();
    const { location, description, country_code } = await getLocationDescription({ lat, lng });
    res.json({ sunrise, sunset, country_code, location, description });
  } catch (error) {
    console.error("❌ Error in /api/sun:", error);
    res.status(500).json({ error: "Failed to fetch location data." });
  }
});

export default router;