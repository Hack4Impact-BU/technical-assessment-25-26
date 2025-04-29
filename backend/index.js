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
    model: "gemini-2.0-flash",
    systemInstruction: `A user of this website is given the sunset and sunrise time of their 
                        current location displayed in a map element. Your job is to find another 
                        interesting place in the world with similar sunrise and sunset time to the user's 
                        current location. This new location should be a significant distance away
                        and it should be random. You will recieve the user coordinates,
                        and you will respond with a unique city name with no other text, 
                        emojis, or formatting. Pick a new city every time you are asked.
`,
})




app.post('/chat', async (req, res) => {
    const position  = req.body.position; // Extract position from the request body
    console.log('Received Position:', position); // Log the received position


    let responseMessage;

    try {
        // Generate a prompt for the Gemini API
        const prompt = `Find a city with somewhat similar sunrise and sunset times to the coordinates: ${position[0]}, ${position[1]}.`;
        console.log('Generated Prompt:', prompt);

        // Call the Gemini API
        const result = await model.generateContent(prompt);

        console.log('Gemini API Response:', result);


        responseMessage = result.response.text().trim(); // Extract and trim the city name
        console.log('City Name:', responseMessage);
    } catch (e) {
        console.error('Error generating content:', e);
        responseMessage = 'Oops, something went wrong!';
    }

    res.json({
        cityName: responseMessage, // Return the city name
    });
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
        const log = req.body
        if (!log.input || !log.response || Object.keys(log).length !== 2) {
            res.status(400).json({ message: 'Bad Request' })
            return
        }
        await mongoclient.db('jdt-website').collection('logs').insertOne(log)
    } catch(error) {
        console.error(error)
        res.status(500).json({message: 'Error'})
    }
})

app.get('/api/nominatim', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Missing city name' });
      }
  
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`,
        {
          headers: {
            'User-Agent': 'Sundial/1.0 (ajh756.404@gmail.com)'
          }
        }
      );
  
      if (!nominatimResponse.ok) {
        throw new Error(`Nominatim API error: ${nominatimResponse.status}`);
      }
  
      const results = await nominatimResponse.json();
      res.json(results);
    } catch (error) {
      console.error('Geocoding proxy error:', error);
      res.status(500).json({ 
        error: 'Geocoding service unavailable',
        details: error.message 
      });
    }
  });
