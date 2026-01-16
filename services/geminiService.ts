import { GoogleGenAI, Type } from "@google/genai";
import { CreateCardData, CardType } from "../types";

// NOTE: In a production app, never expose API keys on the client. 
// This should be handled via a proxy server. 
// For this demo, we assume the environment variable is injected safely or user provided.

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function extractCardFromUrl(url: string): Promise<Partial<CreateCardData>> {
  try {
    const ai = getAIClient();
    
    const prompt = `
      Analyze the following URL: ${url}
      
      I need you to extract or generate the following information for an "Idea Card":
      1. A concise Title (max 50 chars).
      2. An Essence (summary, max 2 sentences).
      3. The most appropriate Card Type from this list: [ui, feature, insight, model, pattern, growth, tech, other].
      
      Return the response in JSON format.
    `;

    // Using gemini-3-flash-preview as requested for basic text tasks/tools
    // Using googleSearch tool to ground the response in actual web content
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            essence: { type: Type.STRING },
            card_type: { 
              type: Type.STRING, 
              enum: ['ui', 'feature', 'insight', 'model', 'pattern', 'growth', 'tech', 'other'] 
            },
          },
          required: ["title", "essence", "card_type"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);

    return {
      title: data.title,
      essence: data.essence,
      card_type: data.card_type as CardType,
      source_url: url,
      image_url: '' // We can't reliably get OG image without a proxy, so we'll leave it empty for manual fill
    };

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    // Fallback if AI fails
    return {
      title: 'New Link',
      source_url: url,
      card_type: CardType.OTHER
    };
  }
}