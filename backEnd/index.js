import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import {GoogleGenerativeAI} from '@google/generative-ai'
import { MongoClient } from 'mongodb'


dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000

const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log("Connected to MongoDB")
})

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

app.get('/logs' ,async (req, res) => {
    try {
        const logs = await mongoclient.db('TW-MapData').collection('data').find({}).toArray()
        res.status(200).json(logs)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error'})
    }
})