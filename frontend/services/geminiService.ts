
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isDeepfake: {
      type: Type.BOOLEAN,
      description: "True if the media shows clear signs of AI generation or manipulation.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "Percentage score (0-100) representing the likelihood of being a deepfake.",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed forensic explanation of the findings.",
    },
    artifactsDetected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific digital artifacts found (e.g., 'Frequency noise in facial regions').",
    },
    visualAnomalies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          description: { type: Type.STRING },
        },
      },
      description: "Specific locations of anomalies found in the media.",
    },
  },
  required: ["isDeepfake", "confidenceScore", "explanation", "artifactsDetected", "visualAnomalies"],
};

export const analyzeMedia = async (
  base64Data: string,
  mimeType: string,
  fileName: string
): Promise<AnalysisResult> => {
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    You are a world-class digital forensics expert specializing in deepfake detection. 
    Analyze the provided media (image or video frame) for signs of AI manipulation.
    
    Look for:
    1. Inconsistent lighting and shadows.
    2. Blurring or unnatural transitions around the eyes, mouth, and hairline.
    3. Double edges or "ghosting" effects.
    4. Unusual facial symmetry or micro-expressions.
    5. Discrepancies in skin texture or digital noise patterns.
    
    Return a precise forensic report in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: "Analyze this file for deepfake artifacts." },
            {
              inlineData: {
                data: base64Data.split(",")[1] || base64Data,
                mimeType,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      ...result,
      metadata: {
        fileName,
        fileType: mimeType,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze media. Please try again.");
  }
};
