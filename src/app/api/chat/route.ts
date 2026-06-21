import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { logActivity } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rateLimit";

// Initialize the Google Gen AI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return await verifyAccessToken(token);
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !["admin", "uchastkavoy"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (!checkRateLimit(ipAddress)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Query database context for the AI
    const [totalYouth, highRiskCount, medRiskCount, highRiskProfiles] = await Promise.all([
      prisma.youthProfile.count({ where: { deletedAt: null } }),
      prisma.youthProfile.count({ where: { xavf: "HIGH", deletedAt: null } }),
      prisma.youthProfile.count({ where: { xavf: "MEDIUM", deletedAt: null } }),
      prisma.youthProfile.findMany({
        where: { xavf: "HIGH", deletedAt: null },
        select: { ism: true, familiya: true, izoh: true, telefon: true },
        take: 5
      })
    ]);

    const dbContextString = `
Database Context (Real-time data from local database):
- Total youth registered: ${totalYouth}
- High-risk youth count: ${highRiskCount}
- Medium-risk youth count: ${medRiskCount}
- High-risk cases details (first 5): ${highRiskProfiles.map(p => `${p.ism} ${p.familiya} (Contact: ${p.telefon}): ${p.izoh}`).join("; ")}
`;

    const systemInstruction = `You are the "Yoshlar Qalqoni AI Assistant", an advanced, professional, and secure local neighborhood management system intelligence operating in Syrdarya Region (Сырдарьинская область), Uzbekistan. Your task is to provide concise, actionable, and data-driven insights for mahalla officials (Uchastkavoy, Rais, Yetakchi). You should adapt to the language preferred by the user (Uzbek or Russian). Keep responses brief and straight to the point unless asked for details.
Context about current user: ${context}
${dbContextString}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Extract stats for audit metadata
    const estimatedTokens = Math.ceil((prompt.length + (response.text || "").length) / 4);

    // Metadata-only Audit Log (No raw prompt or text to prevent log bloat)
    await logActivity(
      user.id,
      "AI_REQUEST",
      {
        tokens: estimatedTokens,
        category: "chat_analytics",
        success: true
      },
      ipAddress
    );

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    
    // Log failure audit
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value;
      const user = token ? await verifyAccessToken(token) : null;
      const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
      if (user) {
        await logActivity(
          user.id,
          "AI_REQUEST",
          {
            category: "chat_analytics",
            success: false,
            error: error.message || "Unknown error"
          },
          ipAddress
        );
      }
    } catch (_) {}

    return NextResponse.json({ error: error.message || "Failed to generate AI response" }, { status: 500 });
  }
}
