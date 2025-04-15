import express from "express";
import { getSunrise, getSunset } from "sunrise-sunset-js";

const router = express.Router();

router.post("/", (req, res) => {
  const { lat, lng } = req.body;

  try {
    const sunrise = getSunrise(lat, lng); // Optional: add new Date() for today
    const sunset = getSunset(lat, lng);

    res.json({
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
    });
  } catch (error) {
    console.error("Sunrise/Sunset calc error:", error);
  }
});

export default router;