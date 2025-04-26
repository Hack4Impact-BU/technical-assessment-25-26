import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function findSimilarSunTimesPlace(sunrise, sunset) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  I have a sunrise time of ${sunrise} and a sunset time of ${sunset}.
  Suggest a place in a different part of the world that has similar sunrise and sunset times right now.
  Return only the name of the location, like a city and country. Do not include explanations or extras.
  `;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}