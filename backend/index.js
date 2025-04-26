import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const mongoClient = new MongoClient(process.env.MONGO_URL);
let markersCollection;

mongoClient.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        const db = mongoClient.db('MarkerHistory'); // Replace with your database name
        markersCollection = db.collection('markers'); // Replace with your collection name
        console.log('Markers collection initialized:', markersCollection !== undefined);
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.post('/api/similar-location', async (req, res) => {
    const { lat, lng } = req.body;
    if (lat == null || lng == null) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const prompt = `Find a location on Earth with similar sunrise and sunset times as latitude ${lat} and longitude ${lng}. Provide the name of the new location, its latitude, and longitude in a single sentence. Provide one more sentence with a brief description of the location.`;

    try {
        const result = await model.generateContent([prompt]);
        const similarLocation = result.response.text().trim();
        res.json({ similarLocation });
    } catch (err) {
        console.error('Error with Gemini:', err);
        res.status(500).json({ error: 'Failed to process the request' });
    }
});

app.post('/api/save-marker', async (req, res) => {
    const { lat, lng, geminiOutput } = req.body;

    if (!lat || !lng || !geminiOutput) {
        return res.status(400).json({ error: 'Latitude, longitude, and Gemini output are required' });
    }

    try {
        const marker = { lat, lng, geminiOutput, createdAt: new Date() };
        await markersCollection.insertOne(marker);
        res.status(201).json({ message: 'Marker saved successfully' });
    } catch (err) {
        console.error('Error saving marker:', err);
        res.status(500).json({ error: 'Failed to save marker' });
    }
});

app.get('/api/markers', async (req, res) => {
    console.log('GET /api/markers called'); // Log when the endpoint is called
    try {
        if (!markersCollection) {
            console.error('Markers collection is not initialized');
            return res.status(500).json({ error: 'Markers collection is not initialized' });
        }

        const markers = await markersCollection.find().toArray();
        console.log('Markers retrieved:', markers); // Log the retrieved markers
        res.json(markers);
    } catch (err) {
        console.error('Error retrieving markers:', err);
        res.status(500).json({ error: 'Failed to retrieve markers' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
