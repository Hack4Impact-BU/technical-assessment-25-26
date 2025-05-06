import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sunRoutes from "./routes/sun.js";
import twinRoutes from "./routes/twin.js";
import historyRoutes from "./routes/history.js";
import mongoose from "mongoose";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/sun", sunRoutes);
app.use("/api/twin", twinRoutes);
app.use("/api/history", historyRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error", err));
app.listen(PORT, () => {
  console.log(`🌍 Backend server running on http://localhost:${PORT}`);
});