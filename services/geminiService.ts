
import { GoogleGenAI, Type } from "@google/genai";
import { FarmerProfile, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCreditRisk = async (farmer: FarmerProfile) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the credit risk for this farmer:
        Name: ${farmer.name}
        Current Limit: ${farmer.creditLimit}
        Outstanding: ${farmer.outstandingBalance}
        Status: ${farmer.overdue ? 'Overdue' : 'Good Standing'}
        History: ${JSON.stringify(farmer.history)}
        Provide a short risk score (1-100) and recommendation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return null;
  }
};

export const getFinancialAdvice = async (farmer: FarmerProfile) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an AgriDo financial advisor, give friendly advice to Farmer ${farmer.name} who has ${farmer.outstandingBalance} due soon. His credit limit is ${farmer.creditLimit}. Suggest optimal crops or timing for repayment based on standard harvest cycles.`,
    });
    return response.text;
  } catch (error) {
    return "Keep track of your harvests to manage repayments better.";
  }
};

export const generateAgriImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, professional, realistic commercial photograph of: ${prompt}. Clean background, cinematic lighting, focused on the item.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
