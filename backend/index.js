import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { signBrowserId, validateBrowserIdentity } from '../backend/signatures.js'

dotenv.config()

const app = express()
app.use(cors({
    origin: process.env.FRONTEND || '*'   // lock it down to your frontend URL in prod
  }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

const API_KEY = process.env.API_KEY;
const mongourl = process.env.MONGO_URL;
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log('Connected to MongoDB')
})


const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
You are an assistant for exploring global locations based on sunrise and sunset patterns. Given a set of coordinates, sunrise, and sunset times for a specific date, your task is to recommend a location from a different geographical region that has similar sunrise and sunset times on the same date.
 
Your response must:
1. Be provided strictly as a JSON object with three keys: "place", "region", "info".
2. Include no additional text, explanation, or formatting.
3. Suggest a location with the closest time difference from the given cordinates.
4. If no valid location can be found, respond with {"place": "N/A", "region": "N/A", "info": "N/A"}, but try your best to give something.

Example:
Input: Coordinates: 35.6895, 139.6917; Sunrise: 05:30; Sunset: 18:30; Date: 2025-04-08.
Output:
{
  "place": "Istanbul",
  "region": "Turkey",
  "info": "info about Istanbul, Turkey and info about its sunrise/sunset "
}
`
})


app.get('/api/browserid', (req, res) => {
    /* 
        API: /api/browserid
        method: GET
        response: gives the client a secure browserid and signature(backend knows these values)
    */
    const id = crypto.randomUUID();
    const signature = signBrowserId(id);
    res.json({ browserId: id, signature });
});

app.post('/api/suninfo', async (req, res) => {
    /* 
        API: /api/suninfo
        method: POST
        response: Similiar locations with sunrise / sunset data given by Gemini AI from the requests Lat, Lng.
    */

    const lat = req.body.lat;
    const lng = req.body.lng;
    const sunset = new Date(req.body.sunset).toLocaleTimeString();
    const sunrise = new Date(req.body.sunrise).toLocaleTimeString();
    const date = req.body.date;
    const message = `Coordinates: ${lat}, ${lng}; Sunrise: ${sunrise}; Sunset: ${sunset}; Date: ${date}.`;
    try {
        const result = await model.generateContent(message);
        let rawText = result.response.text().trim();
        rawText = rawText.replace(/```json|```/g, '').trim();
        const firstBrace = rawText.indexOf("{");
        const lastBrace = rawText.lastIndexOf("}");
        const jsonString = rawText.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonString);
        return res.json(parsed);
    } catch (e) {
        console.error("Gemini error:", e);
        return res.json({ "place": "N/A", "region": "N/A", "info": "N/A" });
    }
})

app.post('/api/history/upload', async (req, res) => {
    /* 
        API: /api/history/upload
        method: POST
        uploads marker data to database
    */
    const data = req.body;
    const browserId = req.headers['x-browser-id'];
    const signature = req.headers['x-browser-signature'];

    if (
        !browserId || !signature ||
        !data.lat || !data.lng || !data.sunrise || !data.sunset ||
        !data.geminiLocation || !data.geminiLocation.place || !data.geminiLocation.region || !data.geminiLocation.info
    ) {
        return res.status(400).json({ message: 'Bad Request: Missing required fields' });
    }

    if (!validateBrowserIdentity(browserId, signature, res)) return;

    try {
        await mongoclient.db('history').collection('history').insertOne({
            ...data,
            browserId
        });
        res.status(201).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    }
});

app.get('/api/history', async (req, res) => {
    /* 
        API: /api/history
        method: GET
        response: Marker data from database
    */

    const browserId = req.headers['x-browser-id'];
    const signature = req.headers['x-browser-signature'];

    if (!browserId || !signature) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    if (!validateBrowserIdentity(browserId, signature, res)) return;

    try {
        const data = await mongoclient
            .db('history')
            .collection('history')
            .find({ browserId })
            .toArray();

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching history' });
    }
});

app.post('/api/history/clear', async (req, res) => {
    /* 
       API: /api/history/clear
       Method: POST
       Description: Clears all marker data from the history collection.
   */

    const browserId = req.body.browserId;
    const signature = req.body.signature;

    if (!browserId || !signature) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    if (!validateBrowserIdentity(browserId, signature, res)) return;

    try {
        const result = await mongoclient.db('history').collection('history').deleteMany({ browserId });
        res.status(200).json({ message: 'History cleared', deletedCount: result.deletedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error clearing history' });
    }
});

app.get('/', (req, res) => {
    res.send('/')
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})