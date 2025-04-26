import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/api/similar-location', async (req, res) => {
    const { lat, lng } = req.body;
    if (lat == null || lng == null) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const prompt = `Find a location on Earth with similar sunrise and sunset times as the location at latitude ${lat} and longitude ${lng}. Provide the latitude and longitude of the similar location.`;

    try {
        const result = await model.generateContent([prompt]);
        const similarLocation = result.response.text().trim();
        res.json({ similarLocation });
    } catch (err) {
        console.error('Error with Gemini:', err);
        res.status(500).json({ error: 'Failed to process the request' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
