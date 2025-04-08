const mongoose = require("mongoose");
const { Schema } = mongoose;

const historyEntrySchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  googleGeminiResponse: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("HistoryEntry", historyEntrySchema);
