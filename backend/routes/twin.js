import express from "express";
import { getTwinLocationDescription } from "../utils/twinGemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { sunrise, sunset } = req.body;
  console.log("Received from frontend:", sunrise, sunset); // ✅ Add this

  if (!sunrise || !sunset) {
    console.log("Missing sunrise/sunset in body");
    return res.status(400).json({ error: "Missing sunrise or sunset data." });
  }

  try {
    const twinData = await getTwinLocationDescription({ sunrise, sunset });
    console.log("✅ Twin Data from Gemini:", twinData); // ✅ Add this
    res.json(twinData);
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Failed to get twin location." });
  }
});

export default router;