import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log('Connected to MongoDB')
})

app.get('/', (req, res) => {
    res.send('/')
})

app.post('/history', (req, res) => {
    res.send('/')
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})