// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env file");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose model (fast + reasoning balance)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// System Prompt (improved)
const SYSTEM_PROMPT = `
You are an AI Trip Planner Agent. 
Your role is to guide the user step by step in planning their trip. 
You must always ask only one question at a time, in the exact order given below:

1. Starting location (source)  
2. Destination city or country  
3. Group size (Solo, Couple, Family, Friends)  
4. Budget (Low, Medium, High)  
5. Trip duration (number of days)  
6. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation)  
7. Special requirements or preferences (if any)  

Rules:
- Do not skip steps.  
- Do not ask multiple questions at once.  
- If the user’s answer is unclear or incomplete, politely ask them to clarify before moving forward.  
- Be friendly, conversational, and interactive in tone.  
- Along with each response, include which UI component should be displayed.  

🚨 IMPORTANT:
- When "ui" is anything except "Final", follow the schema below:
{
  "resp": "string (your text response to the user)",
  "ui": "source | destination | groupSize | budget | tripDuration | travelInterests | preferences"
}

- When "ui" = "Final", return a **structured trip plan JSON** using this schema:
{
  "resp": "Here’s your personalized trip plan!",
  "ui": "Final",
  "plan": {
    "source": "string",
    "destination": "string",
    "groupSize": "string",
    "budget": "string",
    "duration": "string",
    "interests": ["array of strings"],
    "preferences": "string",
    "itinerary": [
      { "day": 1, "activities": ["list of activities"] },
      { "day": 2, "activities": ["list of activities"] }
    ]
  }
}
`;

// Function to send message to Gemini
export async function askGemini(userMessage: string, history: string[] = []) {
  try {
    // Create context by combining system prompt + history + latest user message
    const prompt = `
    ${SYSTEM_PROMPT}
    
    Conversation so far:
    ${history.join("\n")}
    
    User: ${userMessage}
    AI:
    `;

    const result = await model.generateContent(prompt);

    // Get raw response text
    const text = result.response.text();

    // Try to parse JSON safely
    let parsed;
    try {
      // Clean Gemini output → remove markdown/code fences
      const cleanText = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
    
      parsed = JSON.parse(cleanText);
    } catch (err: any) {
      console.error("JSON parse error:", err.message, "Raw:", text);
      // If Gemini sends invalid JSON, fallback
      parsed = {
        resp: "Sorry, I had trouble understanding. Could you please repeat?",
        ui: "source",
      };
    }

    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      resp: "Something went wrong while planning your trip. Please try again.",
      ui: "source",
    };
  }
}
