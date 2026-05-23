
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { type Message, type GeminiPart } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { SYSTEM_INSTRUCTION } from '../constants';

const MODEL_NAME = 'gemini-3-flash-preview';

export const callGemini = async (prompt: string, image: File | null, history: Message[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userParts: GeminiPart[] = [];

  if (image) {
    try {
      const base64Image = await fileToBase64(image);
      userParts.push({
        inlineData: {
          mimeType: image.type,
          data: base64Image,
        },
      });
    } catch (error) {
      console.error("Error converting file to base64:", error);
      throw new Error("Failed to process image file.");
    }
  }

  if (prompt) {
    userParts.push({ text: prompt });
  }

  const contents = [
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    // FIX: Use 'as const' to prevent TypeScript from widening the type of 'role' to a generic string.
    // This ensures the object conforms to the stricter type expected by the `Content` interface.
    { role: 'user' as const, parts: userParts },
  ];

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
          systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    if (!response.text) {
        throw new Error("Received an empty response from the model.");
    }
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
