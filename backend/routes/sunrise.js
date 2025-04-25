import express from 'express';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import Location from '../models/Location.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Received POST /api/sunrise with body:', req.body);

  const { lat, lng } = req.body;

  if (lat == null || lng == null) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  const sunrise = getSunrise(lat, lng);
  const sunset = getSunset(lat, lng);

  try {
    const newLocation = new Location({
      lat,
      lng,
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
    });

    await newLocation.save();

    res.json({
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      lat,
      lng
    });
  } catch (err) {
    console.error('Failed to save location:', err);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

export default router;