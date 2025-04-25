import express from 'express';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

const router = express.Router();

router.post('/', (req, res) => {
  const { lat, lng } = req.body;

  if (lat == null || lng == null) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  const sunrise = getSunrise(lat, lng);
  const sunset = getSunset(lat, lng);

  res.json({
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    lat,
    lng
  });
});

export default router;