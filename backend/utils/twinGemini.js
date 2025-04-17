import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getTwinLocationDescription({ sunrise, sunset }) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = `
You are a strict JSON-only assistant. Respond only with this format:

{
  "location": "City, Country (if its the ocean, then just name the ocean and put an emoji for the ocean)",
  "country_code": "2-letter ISO country code (lowercase, e.g., 'es' for Spain)(if it's the ocean, then don't include this)",
  "sunrise": "6:18 AM",
  "sunset": "7:40 PM",
  "fun_fact": "A lengthy description of the city, including its culture, history, and geography. I want close to 125 words."
}

Do NOT include any explanation or markdown formatting.
Find a city in a different part of the world with a similar sunrise (${sunrise}) and sunset (${sunset}) time.
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    console.log("🔵 Raw Gemini response:", responseText);
    const jsonMatch =
      responseText.match(/```(?:json)?\s*([\s\S]*?)```/) ||
      responseText.match(/{[\s\S]*}/);
    if (jsonMatch) {
      responseText = jsonMatch[1] || jsonMatch[0];
    }

    const parsed = JSON.parse(responseText);
    console.log("✅ Parsed Twin Response:", parsed);
    return parsed;

  } catch (err) {
    console.error("Gemini response could not be parsed.");
    console.error(err);
    throw new Error("Gemini response could not be parsed.");
  }
}