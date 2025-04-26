import express from 'express';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import Location from '../models/Location.js';
import { findSimilarSunTimesPlace } from '../utils/gemini.js';

const router = express.Router();

router.get('/history', async (req, res) => {
  try {
    const locations = await Location.find().sort({ timestamp: -1 });
    res.json(locations);
  } catch (err) {
    console.error('Failed to fetch history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/', async (req, res) => {
  console.log('Received POST /api/sunrise with body:', req.body);

  const { lat, lng } = req.body;

  if (lat == null || lng == null) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  const sunrise = getSunrise(lat, lng);
  const sunset = getSunset(lat, lng);

  try {
    const similarPlace = await findSimilarSunTimesPlace(
      sunrise.toISOString(),
      sunset.toISOString()
    );

    const newLocation = new Location({
      lat,
      lng,
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      similarPlace
    });

    await newLocation.save();

    res.json({
      lat,
      lng,
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      similarPlace
    });
  } catch (err) {
    console.error('Failed to save location:', err);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

router.delete('/history', async (req, res) => {
  try {
    await Location.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) {
    console.error('Failed to clear history:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

export default router;