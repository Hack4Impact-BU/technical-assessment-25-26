import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import tzlookup from 'tz-lookup';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(conn => {
    console.log(`MongoDB connected: ${conn.connection.host}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


const sunLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  handler: (req, res) =>
    res.status(429).json({ error: 'Too many /sun requests—please wait a moment.' })
});

const geminiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  handler: (req, res) =>
    res.status(429).json({ error: 'Too many AI requests—please slow down.' })
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));

app.post('/sun', sunLimiter, async (req, res) => {
  const { lat, lon } = req.body;
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat/lon must be numbers' });
  }
  const today = new Date();
  const sunrise = getSunrise(lat, lon, today);
  const sunset = getSunset(lat, lon, today);
  const tz = tzlookup(lat, lon);

  let location = 'Unknown Location';
  try {
    const q = encodeURIComponent(`${lat} ${lon}`);
    const geoUrl =
      `https://api.opencagedata.com/geocode/v1/json?` +
      `q=${q}&key=${process.env.OPENCAGE_KEY}` +
      `&no_annotations=1&language=en`;
    const geoRes = await fetch(geoUrl);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results?.length) {
        const comp = geoData.results[0].components;
        location = comp.city || comp.town || comp.village || geoData.results[0].formatted;
      }
    } else {
      console.warn('OpenCage error in /sun:', geoRes.status);
    }
  } catch (e) {
    console.warn('Reverse-geocode error in /sun:', e);
  }
  res.json({ sunrise, sunset, tz, location });
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are a JSON‐only formatter. You MUST output exactly valid JSON—no markdown, no explanations.

    ⚠️ ALL “name” fields must be real city names (e.g. “Tokyo”, “Reykjavik”).

    Your output must conform to:
    {
      "type":"object",
      "properties":{
        "candidates":{
          "type":"array",
          "items":{
            "type":"object",
            "properties":{
              "name":      {"type":"string"},
              "country":   {"type":"string"},
              "latitude":  {"type":"number"},
              "longitude": {"type":"number"}
            },
            "required":["name","country","latitude","longitude"]
          }
        }
      },
      "required":["candidates"]
    }
  `.trim()
});

app.post('/gemini', geminiLimiter, async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return res.status(400).json({ error: 'lat and lon must be numbers' });
    }

    const today = new Date();
    const baseSunrise = getSunrise(lat, lon, today);
    const baseSunset = getSunset(lat, lon, today);
    const tz = tzlookup(lat, lon);

    const promptSunrise = new Date(baseSunrise)
      .toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      });
    const promptSunset = new Date(baseSunset)
      .toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      });

    const prompt = `
      You have:
        Coordinates: (${lat},${lon})
        Local sunrise: "${promptSunrise}"
        Local sunset:  "${promptSunset}"

      Question: Which 5 real cities at least 1,000 km away have sunrise & sunset times most similar?
      (NO placeholders like “City A/B/C/D”—only real city names.)

      Output: Valid JSON:
      {
        "candidates":[
          { "name": string, "country": string, "latitude": number, "longitude": number },
          … 5 items …
        ]
      }
    `.trim();

    const result = await model.generateContent(prompt);
    let raw = result.response
      .text()
      .trim()
      .replace(/^```(?:json)?\s*/, '')
      .replace(/```$/, '')
      .trim();

    const { candidates } = JSON.parse(raw);
    const enriched = candidates.map(city => {
      const { name, country, latitude, longitude } = city;
      const sunriseUtc = getSunrise(latitude, longitude, today);
      const sunsetUtc = getSunset(latitude, longitude, today);
      const tzCity = tzlookup(latitude, longitude);
      const fmt = {
        timeZone: tzCity,
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      };
      const sunriseLocal = new Date(sunriseUtc).toLocaleTimeString('en-US', fmt);
      const sunsetLocal = new Date(sunsetUtc).toLocaleTimeString('en-US', fmt);

      const diff = (utc, base) => {
        const partsUtc = new Intl.DateTimeFormat('en-US', {
          timeZone: tzCity,
          hourCycle: 'h23',
          hour: 'numeric',
          minute: 'numeric'
        })
          .formatToParts(utc)
          .reduce((o, { type, value }) => {
            if (type === 'hour') o.hour = parseInt(value);
            if (type === 'minute') o.minute = parseInt(value);
            return o;
          }, {});
        const partsBase = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hourCycle: 'h23',
          hour: 'numeric',
          minute: 'numeric'
        })
          .formatToParts(base)
          .reduce((o, { type, value }) => {
            if (type === 'hour') o.hour = parseInt(value);
            if (type === 'minute') o.minute = parseInt(value);
            return o;
          }, {});
        return Math.abs(partsUtc.hour * 60 + partsUtc.minute - (partsBase.hour * 60 + partsBase.minute));
      };

      const score = diff(sunriseUtc, baseSunrise) + diff(sunsetUtc, baseSunset);
      return { name, country, latitude, longitude, sunriseLocal, sunsetLocal, score };
    });

    enriched.sort((a, b) => a.score - b.score);
    const best = enriched[0];

    res.json({
      name: best.name,
      country: best.country,
      latitude: best.latitude,
      longitude: best.longitude,
      sunriseLocal: best.sunriseLocal,
      sunsetLocal: best.sunsetLocal
    });
  } catch (err) {
    console.error('[/gemini] error:', err);
    res.status(500).json({ error: err.message });
  }
});

const historySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    timezone: { type: String, required: true },
    location: { type: String, default: 'Unknown Location' },
    suggested: {
      city: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  { timestamps: true }
);
const History = mongoose.model('History', historySchema);

app.post('/history', async (req, res) => {
  try {
    const { sessionId, lat, lon, tz } = req.body;
    if (
      typeof sessionId !== 'string' ||
      typeof lat !== 'number' ||
      typeof lon !== 'number' ||
      typeof tz !== 'string'
    ) {
      return res.status(400).json({ error: 'lat, lon must be numbers and tz a string' });
    }

    let location = 'Unknown Location';
    try {
      const q = encodeURIComponent(`${lat} ${lon}`);
      const geoUrl =
        `https://api.opencagedata.com/geocode/v1/json` +
        `?q=${q}` +
        `&key=${process.env.OPENCAGE_KEY}` +
        `&no_annotations=1&language=en`;

      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results?.length) {
          const comp = geoData.results[0].components;
          location = comp.city || comp.town || comp.village || geoData.results[0].formatted;
        }
      } else {
        console.warn('OpenCage error:', geoRes.status, await geoRes.text());
      }
    } catch (e) {
      console.warn('Reverse-geocode error:', e);
    }

    const gemRes = await fetch('http://localhost:4000/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon })
    });
    if (!gemRes.ok) throw new Error('gemini lookup failed');
    const gemData = await gemRes.json();

    const entry = await History.create({
      sessionId,
      lat,
      lon,
      timezone: tz,
      location,
      suggested: {
        city: gemData.name,
        country: gemData.country
      }
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('POST /history error:', err);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

app.get('/history', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId in query' });
    }
    const all = await History.find({ sessionId }).sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error('GET /history error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.delete('/history', async (req, res) => {
  try {
    const { sessionId, ids } = req.body;
    if (typeof sessionId !== 'string' || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'sessionId must be a string and ids an array' });
    }

    const result = await History.deleteMany({
      sessionId,
      _id: { $in: ids }
    });

    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error('DELETE /history error:', err);
    res.status(500).json({ error: 'Failed to delete history' });
  }
});
