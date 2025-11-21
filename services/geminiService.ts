import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Helper to check for API key
const getAIClient = (): GoogleGenAI | null => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  context: string = ""
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "I'm sorry, but I'm not connected to the AI service right now. Please check your API key.";

  try {
    const model = "gemini-2.5-flash"; // Using Flash for quick chat responses
    
    const systemInstruction = `You are Albert, an intelligent assistant for Integratd Living. 
    You help with CRM data, analyzing floorplans, quoting, and technical Loxone automation queries.
    You are professional, concise, and helpful.
    
    Current Context from App:
    ${context ? context : "No specific app context loaded."}
    `;

    const contents = [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: newMessage }] }
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: contents as any, // Type assertion due to slight SDK type mismatch in some versions
      config: {
        systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request.";
  }
};

export const analyzeFloorplan = async (base64Image: string, automationType: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const model = "gemini-3-pro-preview"; // Using Pro for complex vision analysis

    const prompt = `Analyze this floorplan image. We are installing a Loxone automation system.
    Focus specifically on: ${automationType}.
    1. Identify the rooms.
    2. Suggest placement for ${automationType} sensors or devices.
    3. Estimate the number of devices needed per room.
    4. Provide a JSON summary of the estimated count.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
            { inlineData: { mimeType: "image/png", data: base64Image } },
            { text: prompt }
        ]
      }
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing floorplan.";
  }
};