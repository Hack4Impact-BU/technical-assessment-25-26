const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDatabase } = require('./mongodb.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_CLIENT_ID;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
        You are a geospatial assistant. Upon receiving an input JSON object of the form
        {
        "latitude": <number>,
        "longitude": <number>,
        "sunrise": "HH:MM",
        "sunset": "HH:MM"
        }
        you must:

        Find a different location at least 700 km from the input coordinates whose current local sunrise and sunset times are within ±15 minutes of the input times.
        Return a JSON object with exactly these keys and no others:
        givenLocation: the city name for the input coordinates in “City, State, Country” format
        latitude: the exact latitude that was given to you
        longitude: the exact longitude that was given to you
        foundLocation: the city name of the matched location in “City, State, Country” format
        foundLocationLat: the exact latitude that you found
        foundLocationLong: the exact longitude that you found
        sunrise: the found location’s sunrise time in 12-hour “HH:MM:SS AM/PM” format 
        sunset: the found location’s sunset time in 12-hour “HH:MM:SS AM/PM” format
        Do not include any explanatory text or metadata—only the valid JSON response.
        `
});

// generates a random location based on the given coordinates and sunrise/sunset times
app.post('/generate', async (req, res) => {
    try {
        const prompt = req.body.request;
        let responseMessage;
        try {
            const result = await model.generateContent(prompt);
            responseMessage = result.response.text();
        } catch (error) {
            responseMessage = error.message;
        }
        res.status(200).json({ responseMessage });
    } catch (error) {
        console.error('Error generating location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// inserts data in database
app.post('/insertData', async (req, res) => {
    try {
        const db = await getDatabase('h4i_technical_assessment_25');
        const collection = db.collection('locations');
        const data = req.body;
        await collection.insertOne({ data: data });
        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/fetchVoyages', async (req, res) => {
    try {
        const db = await getDatabase('h4i_technical_assessment_25');
        const collection = db.collection('locations');
        const voyages = await collection.find().toArray();
        console.log(voyages);
        res.status(200).json(voyages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});