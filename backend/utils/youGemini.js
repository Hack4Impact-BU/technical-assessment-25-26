import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function getLocationDescription({ lat, lng }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  You are a strict JSON-only assistant. Respond only with this format:
  
  {
    "location": "City, Country (if its the ocean, then just name the ocean and put an emoji for the ocean)",
    "country_code": "2-letter ISO country code (lowercase, e.g., 'es' for Spain)(if it's the ocean, then don't include this)",
    "description": "A short paragraph describing the location’s culture, geography, or history. I want close to 125 words. If it's the ocean, then describe that."
  }
  
  Latitude: ${lat}
  Longitude: ${lng}
  
  ⚠️ Do NOT include markdown or any text outside the JSON object.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
  
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) || responseText.match(/{[\s\S]*}/);
    if (jsonMatch) {
      responseText = jsonMatch[1] || jsonMatch[0];
    }
  
    const parsed = JSON.parse(responseText);
    return parsed; // Now includes both location and description
  } catch (err) {
    console.error("❌ Failed to get location info:", err);
    throw new Error("Gemini location description failed.");
  }
}