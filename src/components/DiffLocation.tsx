import { GoogleGenAI } from "@google/genai"
import { Location } from "@/types";
import {useEffect, useState} from "react";

// Initialize AI model
const geminiKey = import.meta.env.VITE_GEMINI_API
if (!geminiKey) {
    throw new Error("GEMINI_API is not defined");
}
const ai = new GoogleGenAI({apiKey: geminiKey});
export default function DiffLocation({position, sunrise, sunset}: Location){

    const [town, setTown] = useState<string>("")
    const [fact, setFact] = useState<string>("")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const townResult = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: `What is a town or city very far away, across the world from latitude and longitude ${position} that has a sunrise time close or equal to ${sunrise} and 
                        a sunset time close or equal to ${sunset} today? Output should be in the format: town name, country name. The country must
                         be a real country, not an area of a country. The total output you tell me must be less than 7 words.`,
                })
                // remove null and undefined outputs to avoid errors
                const townText = String(townResult.candidates?.[0]?.content?.parts?.[0]?.text)
                setTown(townText)
                console.log(townText)
            }catch (error) {
                console.error("Error generating town:", error)
                setTown("Error finding town.")
            }
        }
        fetchData();
        }, [position]) // only re-render when user position is changed

    // only run once town has been found...
    useEffect(() => {
        const fetchData = async () => {
            try {
                const factResult = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: `What is a fun fact about ${town}? The total output you tell me must be less than 15 words.`,
                })

                // remove null and undefined outputs to avoid errors
                const factText = String(factResult.candidates?.[0]?.content?.parts?.[0]?.text)
                setFact(factText)
                console.log(factText)
            }catch (error) {
                console.error("Error generating fact:", error)
                setFact("Error finding fact.")
            }
        }
        fetchData();
    }, [position, town]) // only re-render when user position is changed

    return(
        <>
            <p>{town} <br/> {fact}</p>
        </>
    )
}

