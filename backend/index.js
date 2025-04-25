import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import{GoogleGenerativeAI} from '@google/generative-ai'
import { MongoClient } from 'mongodb'


dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000

const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log("connected to MongoDB")
})


const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a location suggestion assistant. When given coordinates, 
find another city in the world with similar sunrise/sunset times that is:
1. At least 500 miles away
2. In a different country/region
3. Culturally or geographically interesting
4. Has notable differences from the original location

Respond ONLY with the city and country name in format "City, Country" with no other text. 
Ensure varied responses for similar inputs.`
,
})




app.post('/chat', async (req, res) => {
    const { position } = req.body; // Destructure position from request body
    
    if (!position || !Array.isArray(position) || position.length !== 2) {
        return res.status(400).json({ message: 'Invalid coordinates' });
    }

    try {
        // Construct a proper prompt with the coordinates
        const prompt = `Given these coordinates: ${position[0]}, ${position[1]}, suggest a different city with similar sunrise/sunset times. Respond with just the city name.`;
        
        const result = await model.generateContent(prompt);
        const cityName = result.response.text().trim();
        
        res.json({ cityName }); // Return as { cityName } to match frontend expectation
    } catch(e) {
        console.error('Gemini error:', e);
        res.status(500).json({ message: 'Error processing request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.get('/logs', async (req, res) => {
    try {
        const logs = await mongoclient.db('jdt-website').collection('logs').find({}).toArray()
        res.status(200).json(logs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})

app.post('/add', async (req, res) => {
    try {
        const { input, response, cityName } = req.body;
        
        if (!input || !response) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await mongoclient.db('jdt-website').collection('logs').insertOne({
            input,
            response,
            cityName: cityName || 'Unknown',
            timestamp: new Date()
        });
        
        res.status(201).json({ message: 'Success' });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    }
});


/*the only change from our add post request is .deleteOne(log)*/

/*
app.post('/delete', async (req, res) => {
    try {
        const log = req.body
        if (!log.input || !log.response || Object.keys(log).length !== 2) {
            res.status(400).json({ message: 'Bad Request' })
            return
        }
        await mongoclient.db('jdt-website').collection('logs').deleteOne(log)
        res.status(201).json({ message: 'Success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error' })
    }
})
*/
