import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gen AI client with the API key from environment variables
// It automatically picks up GEMINI_API_KEY from process.env if available, 
// but we pass it explicitly just to be safe.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `You are the "Yoshlar Qalqoni AI Assistant", an advanced, professional, and secure local neighborhood management system intelligence operating in Syrdarya Region (Сырдарьинская область), Uzbekistan. Your task is to provide concise, actionable, and data-driven insights for mahalla officials (Uchastkavoy, Rais, Yetakchi). You should adapt to the language preferred by the user (Uzbek or Russian). Keep responses brief and straight to the point unless asked for details. Context about current user: ${context}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI response" }, { status: 500 });
  }
}
