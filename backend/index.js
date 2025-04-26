import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Only allow the frontend to connect
    methods: ['GET', 'POST', 'OPTIONS'], // Explicitly include OPTIONS method
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // If you need to include credentials (cookies, etc)
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.options('*', (req, res) => {
    // Ensure CORS preflight requests are handled
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

app.post('/api/sunrise', async (req, res) => {
    const { lat, lon } = req.body;

    try {
        const sunrise = getSunrise(lat, lon);
        const sunset = getSunset(lat, lon);

        const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();

        const prompt = `Find a place in a completely different part of the world with a similar sunrise (${sunriseTime}) and sunset (${sunsetTime}) time. Explain briefly.`;

        const result = await genAI.generateContent({
            model: "gemini-1.5-flash",  
            contents: [{ parts: [{ text: prompt }] }],
        });

        const suggestion = result.response.text();

        res.json({
            sunrise: sunriseTime,
            sunset: sunsetTime,
            suggestion,
        });
    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).json({ error: 'Failed to generate suggestion' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
