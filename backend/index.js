import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MongoClient } from 'mongodb'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 8888

//NEED TO SETUP MONGO DB
const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() =>{
    console.log("Connected to MongoDB")
})

const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
                        Seperated the city that is far away from the input city with a | characeter surrounded by no spaces,
                        do not under any circumstanse add information before the city name
                        when giving a description of a town make it 20-40 words and describe only the most important aspects of the city
                       `
})


//"Please tell me the name of the city at the following latitude longitude coordinates as well as a short description of the city: 42.361145, -71.057083"   
app.post('/chat', async (req, res) => {
    console.log(req.body)
    const geminiQuery = "Please find a city far away from " + req.body.location + 
                        " with a similar sunrise time of " + req.body.sunriseTime + 
                        " and sunset time of " + req.body.sunsetTime
                        + " you do not need to use presice/ up to date information about sunrise time, use your best guess from your training"
    let responseMessage
    try {
        //const result = await model.generateContent(userInput)
        const result = await model.generateContent(geminiQuery)
        responseMessage = result.response.text()
    } catch(e){
        console.log(e)
        responseMessage = 'Something went wrong!'
    }
    res.json({
        message: responseMessage
    })
    console.log("[BACKEND] responseMessage: " + responseMessage)
})

app.post('/add', async (req, res) => {
    try{
        const log = req.body
        console.log("[BACKEND] History log being added to DB: " + Object.values(log))
        if (!log.latitude || !log.longitude || !log.location || Object.keys(log).length !== 3){
            res.status(400).json({ message: 'Bad Request' })
            return
        }
        await mongoclient.db('project-solis').collection('history').insertOne(log)
        res.status(201).json({ message: 'Success' })
    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

app.get('/history', async (req, res) =>{
    try{
        const history = await mongoclient.db('project-solis').collection('history').find({}).toArray()
        res.status(200).json(history)
    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

app.get('/clear', async (req, res) => {
    try{
        await mongoclient.db('project-solis').collection('history').deleteMany({});
        res.status(200)
    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})  