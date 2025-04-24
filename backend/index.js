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
        You are a geospatial assistant. When you receive an input JSON object of the form
        {
            "latitude": <number>,
            "longitude": <number>,
            "sunrise": "<HH:MM>",
            "sunset": "<HH:MM>"
        }
        you must:

        Identify a completely different geographic location (i.e. at least 1000 km from the input coordinates) whose sunrise and sunset times match the input times within ±5 minutes.
        Return a JSON string with exactly the same keys—latitude, longitude, sunrise, sunset—but with values corresponding to the different location.
        Ensure the output is valid JSON and contains no additional keys or metadata.
        Use 24-hour time in "HH:MM" format for sunrise and sunset.
        Do not include any explanatory text or comments—only the JSON response.
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});