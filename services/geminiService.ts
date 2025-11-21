import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

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
      contents: contents as any,
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

export const analyzeFloorplan = async (base64Image: string, automationType: string, tier: string): Promise<any> => {
  const ai = getAIClient();
  if (!ai) return null; // Return null to handle fallback in UI

  try {
    const model = "gemini-3-pro-preview";

    const prompt = `Analyze this floorplan image for a home automation quote.
    Project Tier: ${tier}.
    Systems to include: ${automationType}.

    1. Identify the rooms in the floorplan.
    2. Based on the pricing tier and selected systems, determine the list of automation devices needed.
    3. Estimate the quantity and unit cost for each item.
    4. Estimate installation labor hours.

    Output strictly valid JSON matching the schema.
    `;

    // Clean base64 if needed
    const cleanBase64 = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
            { inlineData: { mimeType: "image/png", data: cleanBase64 } },
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedRooms: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  total: { type: Type.NUMBER }
                }
              }
            },
            laborHours: { type: Type.NUMBER },
            laborCost: { type: Type.NUMBER },
            subtotal: { type: Type.NUMBER },
            grandTotal: { type: Type.NUMBER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
};