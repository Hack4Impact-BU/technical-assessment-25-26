//imports and configs
const express = require('express');
const cors = require('cors');
const { getSunriseSunset } = require('./sunriseService');
const { findSimilarLocation, getDayLengthHours } = require('./geminiService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allows frontend origin
    methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
    credentials: true,
}));

app.use(express.json());

// test route
app.get('/', (req, res) => {
    res.send('Sun Times API is running!');
});

app.post('/api/sunrise-sunset', async (req, res) => {
    const { lat, lng } = req.body;

    try {
        const { sunrise, sunset, sunriseISO, sunsetISO } = await getSunriseSunset(lat, lng);

        console.log('Original Sunrise:', sunrise);
        console.log('Original Sunset:', sunset);
        console.log('Sunrise ISO:', sunriseISO);
        console.log('Sunset ISO:', sunsetISO);


        const daylightHours = getDayLengthHours(sunriseISO, sunsetISO);

        console.log('Daylight Hours:', daylightHours);

        res.json({ sunrise, sunset, sunriseISO, sunsetISO, daylightHours }); // Frontend sees formatted times, backend gets ISO for logic
    } catch (error) {
        console.error('Error fetching sun data:', error);
        res.status(500).json({ error: 'Failed to fetch sunrise/sunset times' });
    }
});


app.post('/api/similar-location', async (req, res) => {
    const { sunriseISO, sunsetISO } = req.body;
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);

    console.log('Request to api/similar-location, req.body:', req.body);


    if (!sunriseISO || !sunsetISO || isNaN(lat) || isNaN(lng)) {
        console.error('invalid request data')
        return res.status(400).json({ error: 'Invalid request data.' });
    }

    try {
        const location = await findSimilarLocation(sunriseISO, sunsetISO, lat, lng);
        console.log(' Similar location from Gemini:', location);

        res.json({ location });
    } catch (err) {
        console.error('Gemini API Error:', err);
        res.status(500).json({ error: 'Failed to get similar location' });
    }
});
/*
app.post('/api/extract-location', async (req, res) => {
    const { sunriseISO, sunsetISO, lat, lng } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Based on the following data:
Sunrise: ${sunriseISO}
Sunset: ${sunsetISO}
Latitude: ${lat}
Longitude: ${lng}

Please respond with just the most likely location (city, region, country) that matches this amount of daylight time and coordinates. Do not include any explanation.
`.trim();

        const result = await model.generateContent(prompt);
        const location = result.response.text().trim();

        res.json({ location });
    } catch (err) {
        console.error('Gemini Extraction Error:', err);
        res.status(500).json({ error: 'Failed to extract location.' });
    }
});
*/

// server start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});