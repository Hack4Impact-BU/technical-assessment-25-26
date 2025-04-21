import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import {GoogleGenerativeAI} from '@google/generative-ai'
import { MongoClient } from 'mongodb'


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
                        You will be given coordinates using the format "latitude, longitude".
                        You will also be given the times for when the sun rises and sun sets at that location.
                        Your goal is to provide other locations that are similar to the given location's sunrise and sunset times.
                        You will also provide a short fun fact about the location you found.
                        Do not use markdown, emojis, or any syntax other than plain text in your responses.`,
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


app.post('/positions', async (req, res) => {
    const { lat, lng } = req.body

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' })
    }

    await collection.insertOne({ lat, lng, when: new Date() })
    res.status(200).json({ message: 'Position saved successfully' })
    console.log('Position saved to database:', { lat, lng, when: new Date() })
})


app.get('/positions', async (_, res) => {
    try {
      const docs = await collection          // the mongo collection object we created earlier
        .find({})
        .sort({ when: -1 })                  // newest first (optional)
        .toArray();
  
      res.json(docs);                        // Express adds status 200 + JSON header
    } catch (err) {
      console.error(err);
      res.status(500).send({ ok: false, error: 'db-error' });
    }
  });
