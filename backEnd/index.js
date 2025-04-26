import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MongoClient } from 'mongodb'

// Default config and setup for mondoDB and Google Generative AI
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
                        "Original location: <original location>, Orginal Sunset: <original sunset>, Orginal Sunrise: <original sunrise>, *new line*
                        New location: <new location>, New Sunset: <new sunset>, New Sunrise: <new sunrise>, *new line* Fun fact: <fun fact>"
                        The location you choose must be on a different continent than the orginal location.
                        Also make the orginal location is correct with the given coordinates.
                        Do not use markdown, emojis, or any syntax other than plain text in your responses except new lines.
                        Whenever you add a new line, do it twice so there's an extra space.`,
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Takes position and sends it to MongoDB
app.post('/ai', async (req, res) => {
  try {
    const { lat, lng, sunRise, sunSet } = req.body

    if (!lat || !lng || !sunRise || !sunSet) {
      return res.status(400).json({ error: 'Latitude, longitude, sunrise, and sunset are required' })
    }

    const responses = await model.generateContent("lat:" + lat + ", lng: " + lng + ", sunrise: " + sunRise + ", sunset: " + sunSet)
    const result = await responses.response.text()

    collection.insertOne({ lat, lng, when: new Date(), result })

    res.status(200).json({
      message: 'Information saved successfully',
      result: result
    })
    console.log('Position saved to database:', { lat, lng, sunRise, sunSet, when: new Date(), result })
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'db-error' })
  }
})


// Deletes all positions from the database
app.post('/positions/data', async (req, res) => {
  try {
    await collection.deleteMany({})
    res.status(200).json({ message: 'All positions deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'db-error' })
  }
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
