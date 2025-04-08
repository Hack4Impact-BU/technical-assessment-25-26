import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

const API_KEY = process.env.API_KEY;
const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log('Connected to MongoDB')
})

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You're helping users explore global locations with similar sunrise/sunset patterns. Given a location and its sunrise/sunset time, your job is to suggest a different part of the world (preferably with different geography or culture) that has similar times. Keep answers brief and clear, and return only the place name and region.`,
})


app.post('/api/suninfo', async (req, res) => {
    /* 
        API: /api/suninfo
        method: POST
        response: Similiar locations with sunrise / sunset data given by Gemini AI from the requests Lat, Lng.
    */

    const lat = req.body.lat;
    const lng = req.body.lng;
    const message = "Lat: " + lat + " Lng: " + lng
    let responseMessage;
    try {
        const result = await model.generateContent(message);
        responseMessage = result.response.text();
    } catch(e){
        responseMessage = 'Oops, something went wrong!'
    }
    res.json({
        geminiLocation: responseMessage,
    })
})

app.post('/api/history/upload', async (req, res) => {
    /* 
        API: /api/history/upload
        method: POST
        uploads marker data to database
    */

    const lat = req.body.lat;
    const lng = req.body.lng;
    const message = "Lat: " + lat + " Lng: " + lng
    let responseMessage;
    try {
        const result = await model.generateContent(message);
        responseMessage = result.response.text();
    } catch(e){
        responseMessage = 'Oops, something went wrong!'
    }
    res.json({
        geminiLocation: responseMessage,
        geminiRawResponse: responseMessage,
    })
})

app.get('/api/history', (req, res) => {
    /* 
        API: /api/history
        method: GET
        response: Marker data from database
    */
    res.send('/')
})

app.get('/', (req, res) => {
    res.send('/')
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})