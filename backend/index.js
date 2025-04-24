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
    systemInstructions: `
        TBD
    `
});

// generates a random location based on the given coordinates and sunrise/sunset times
app.post('/generate', async (req, res) => {
    try {
        const prompt = req.body.request;
        let responseMessage;
        try {
            const result = await model.generateContent(prompt);
            console.log('Generated response:', result);
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