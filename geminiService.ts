
import { GoogleGenAI, Type } from "@google/genai";
import { UserConstraints } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getExpertAnalysis = async (constraints: UserConstraints) => {
  const prompt = `
    Act as a Senior Cloud Architect. Analyze the tradeoff between AWS Lambda and AWS EC2.
    USER CONSTRAINTS:
    - Budget: ${constraints.budget}
    - Traffic Pattern: ${constraints.traffic}
    - Scalability: ${constraints.scalability}
    - Control Over Infra: ${constraints.control}
    - Development Speed: ${constraints.devSpeed}

    TASK:
    Generate a deep-dive "Referee" analysis. 
    1. Explain WHY one might be better for specific constraints.
    2. Identify a "Deadlock" or critical tradeoff point.
    3. Do NOT pick one winner. Use "Choose X if..., Choose Y if..." logic.
    4. Format the output in structured Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Referee is currently unavailable. Please check your constraints and try again.";
  }
};
