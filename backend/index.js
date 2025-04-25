import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Example route (you’ll add real routes later)
app.get('/', (req, res) => {
  res.send('Sol Atlas Backend is running!');
});

// TODO: Import and use your API routes here (sunrise.js, gemini.js, etc.)
// app.use('/api/sunrise', sunriseRoutes);
// app.use('/api/gemini', geminiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));