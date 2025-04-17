import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  clicked: {
    latitude: Number,
    longitude: Number,
    sunrise: String,
    sunset: String,
    location: String,
    description: String,
    country_code: String,
  },
  twin: {
    latitude: Number,
    longitude: Number,
    location: String,
    sunrise: String,
    sunset: String,
    fun_fact: String,
    country_code: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("History", historySchema);