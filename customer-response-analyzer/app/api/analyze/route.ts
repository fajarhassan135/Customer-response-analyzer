import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt = `You are a customer support AI. Analyze the following customer message and respond ONLY with a valid JSON object, no extra text.

Message: "${message}"

Respond with exactly this format:
{
  "category": "one of: Complaint, Refund/Return, Sales Inquiry, Delivery Question, Account/Technical Issue, General Query, Spam",
  "sentiment": "one of: Positive, Neutral, Negative",
  "urgency": "one of: Low, Medium, High",
  "reply": "a short professional auto-reply under 3 sentences"
}

Urgency guidance: High = customer is upset, threatening to leave, or has a time-sensitive issue. Medium = a real issue but not urgent. Low = general questions, positive feedback, or spam.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Failed to analyze message" }, { status: 500 });
  }
}