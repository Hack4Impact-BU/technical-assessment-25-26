import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MongoClient } from 'mongodb'
import { getSunrise, getSunset } from 'sunrise-sunset-js'


// Standard configeration
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

const mongoclient = new MongoClient(process.env.MONGO_URL)

mongoclient.connect().then(() => {
    console.log("Connected to MongoDB")
})

const collection = mongoclient.db("TW-MapData").collection("data")

const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a guide that tells users short fun facts about locations using the lat long coordinate system.
                        You will be given coordinates using the format "latitude, longitude, sunrise time, sunset time".
                        Your goal is to provide other locations that are similar to the given location's sunrise and sunset times.
                        You will also provide a short fun fact about the location you found.
                        In your response, you will follow the format: 
                        "Original location: <original location>, Orginal Sunset: <original sunset>, Orginal Sunrise: <original sunrise>,
                        New location: <new location>, New Sunset: <new sunset>, New Sunrise: <new sunrise>, Fun fact: <fun fact>"
                        The location you choose must be on a different continent than the orginal location.
                        Also make the orginal location is correct with the given coordinates.
                        Do not use markdown, emojis, or any syntax other than plain text in your responses.`,
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Takes position and sends it to MongoDB
app.post('/ai', async (req, res) => {
    const { lat, lng, sunRise, sunSet } = req.body

    if (!lat || !lng || !sunRise || !sunSet) {
        return res.status(400).json({ error: 'Latitude, longitude, sunrise, and sunset are required' })
    }

    const responses = await model.generateContent("lat:" + lat + ", lng: " + lng + ", sunrise: " + sunRise + ", sunset: " + sunSet)
    const result = responses.response.text()

    collection.insertOne({ lat, lng, when: new Date(), responses })
    res.status(200).json({ message: 'Information saved successfully' })
    console.log('Position saved to database:', { lat, lng, sunRise, sunSet, when: new Date(), result })
})


// Sorts the positions by date and returns them to the front end
app.get('/positions', async (_, res) => {
    try {
      const docs = await collection
        .find({})
        .sort({ when: -1 })
        .toArray();
  
      res.json(docs);
    } catch (err) {
      console.error(err);
      res.status(500).send({ ok: false, error: 'db-error' });
    }
  });
