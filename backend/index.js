import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MongoClient } from 'mongodb'
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { DateTime } from 'luxon'
import geoTz from 'geo-tz'

dotenv.config()

if (!process.env.API_KEY) {
  console.error("ERROR: API_KEY is not defined");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined");
  process.exit(1);
}

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

const port = Number(process.env.PORT);
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});

const mongouri = process.env.MONGO_URI
const mongoclient = new MongoClient(mongouri, {})

mongoclient.connect().then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(err => {
  console.error("MongoDB connection failed", err);
  process.exit(1);
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an expert meteorologist.
        You are provided with a sunrise time, a sunset time, a latitude, a longitude, and a date.
        These times are in the local timezone of the specified coordinates.
        Your task is to identify a location that, on the same date, has sunrise and sunset times closely matching the provided times, while ideally being as geographically distant from the original coordinates as possible.
        Your response must follow this EXACT format: "City Name, Country".
        Include no additional text, explanation, or formatting.
        If no perfect match can be found, strive to find the closest match without sacrificing geographical distance.
        Avoid reusing locations repeatedly.
        If you are unable to find a suitable location, respond with "N/A".
        Ensure your answers are as geographically diverse as possible.
        Make sure that the sunrise and sunset times you find match those times for the same date, in the same local timezone, at the given coordinates.
        If the same location has been suggested recently, please try a different city that still meets the sunrise and sunset time requirements, even if it might be slightly less accurate.`
})

app.get('/', (req, res) => {
    res.send("Backend running!");
})

app.post('/api/data', async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const tz = geoTz.find(lat, lng)[0];

        const sunriseUTC = getSunrise(lat, lng);
        const sunsetUTC = getSunset(lat, lng);

        const sunrise = DateTime.fromJSDate(sunriseUTC, { zone: 'utc' }).setZone(tz).toFormat('hh:mm a');
        const sunset = DateTime.fromJSDate(sunsetUTC, { zone: 'utc' }).setZone(tz).toFormat('hh:mm a');

        res.json({ sunrise, sunset })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
})

app.post('/gemini', async (req, res) => {
    try {
        const { lat, lng } = req.body;
        console.log("Received Data: ", req.body);
        const tz = geoTz.find(lat, lng)[0];

        const sunriseUTC = getSunrise(lat, lng);
        const sunsetUTC = getSunset(lat, lng);

        const date = sunriseUTC.toISOString().split('T')[0];
        const sunrise = DateTime.fromJSDate(sunriseUTC, { zone: 'utc' }).setZone(tz).toFormat('hh:mm a');
        const sunset = DateTime.fromJSDate(sunsetUTC, { zone: 'utc' }).setZone(tz).toFormat('hh:mm a');

        let response;
        try {
            const prompt = `
                On the date of ${date}, with sunrise at ${sunrise} and sunset at ${sunset}, located at latitude ${lat} and longitude ${lng}, find a location that has sunrise and sunset times closely matching the ones provided. Your goal is to maximize the geographical distance from the original coordinates, so try to identify a location as far away as possible while still matching the sunrise and sunset times accurately. If you can't find an exact match, provide the closest match, but prioritize distance over exact time matches. Respond with the location in this format: "City Name, Country". If no valid location can be found, respond with "N/A". Ensure you don't suggest the same city repeatedly.
            `;
            const result = await model.generateContent(prompt);
            response = await result.response.text();
            await mongoclient.db('twinlight').collection('logs').insertOne({
                sunrise: sunrise,
                sunset: sunset,
                similarLocation: response,
                timestamp: new Date().toString(),
            })
        } catch (e) {
            console.error(e);
            response = "Oops, something went wrong!";
        }
        res.json({
            message: response,
        })
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
})

app.get('/logs', async (req, res) => {
    try {
        const logs = await mongoclient.db('twinlight').collection('logs').find({}).sort({ timestamp: -1 }).toArray()
        res.status(200).json(logs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

app.post('/add', async (req, res) => {
    try {
        const log = req.body
        if (!log.input || !log.response || Object.keys(log).length !== 2) {
            res.status(400).json({ message: 'Bad Request' })
            return
        }
        await mongoclient.db('twinlight').collection('logs').insertOne(log)
        res.status(201).json({ message: 'Success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

app.post('/delete', async (req, res) => {
    try {
        const log = req.body
        if (!log.input || !log.response || Object.keys(log).length !== 2) {
            res.status(400).json({ message: 'Bad Request' })
            return
        }
        await mongoclient.db('twinlight').collection('logs').deleteOne(log)
        res.status(200).json({ message: 'Success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

