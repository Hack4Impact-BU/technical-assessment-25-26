import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import sunriseRoutes from './routes/sunrise.js'; // 👈 add this line

dotenv.config();
// debugging the gemini API key
console.log("Loaded GEMINI key:", process.env.GEMINI_API_KEY);

const app = express();

app.use(cors({
  origin: 'https://technical-assessment-25-26-1.onrender.com',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// MongoDB (can be uncommented if needed)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// API routes
app.use('/api/sunrise', sunriseRoutes); // add this line

app.get('/', (req, res) => {
  res.send('Sol Atlas Backend Running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));