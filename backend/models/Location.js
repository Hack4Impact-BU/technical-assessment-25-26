import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  sunrise: String,
  sunset: String,
  similarPlace: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Location', locationSchema);