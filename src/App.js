import { useState } from "react";

const GROQ_API_KEY = "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";

const SAMPLE_MESSAGES = [
  "I ordered 5 days ago and still haven't received my package!",
  "I'd like to return the shoes I bought last week.",
  "Do you have this jacket in size medium?",
  "Your website keeps logging me out every time I try to checkout.",
  "Thank you so much, the product is amazing!",
  "Buy cheap meds online click here now!!!",
];

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    const prompt = `You are a customer support AI. Analyze the following customer message and respond ONLY with a valid JSON object, no extra text.

Message: "${input}"

Respond with exactly this format:
{
  "category": "one of: Complaint, Refund/Return, Sales Inquiry, Delivery Question, Account/Technical Issue, General Query, Spam",
  "sentiment": "one of: Positive, Neutral, Negative",
  "reply": "a short professional auto-reply under 3 sentences"
}`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const text = data.choices[0].message.content;
      const parsed = JSON.parse(text);
      setResult(parsed);
    } catch (err) {
      setError("Something went wrong. Check your API key or try again.");
    }

    setLoading(false);
  };

  const sentimentColor = {
    Positive: "#22c55e",
    Neutral: "#f59e0b",
    Negative: "#ef4444",
  };

  const categoryColor = "#6366f1";

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Customer Message Analyzer</h1>
        <p style={{ color: "#94a3b8", marginBottom: 32 }}>Powered by Groq · LLaMA 3.3 70B</p>

        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Quick samples:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {SAMPLE_MESSAGES.map((msg, i) => (
            <button key={i} onClick={() => setInput(msg)}
              style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
              {msg.length > 40 ? msg.slice(0, 40) + "…" : msg}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a customer message..."
          rows={4}
          style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 16, color: "#f1f5f9", fontSize: 15, resize: "vertical", boxSizing: "border-box" }}
        />

        <button onClick={analyze} disabled={loading}
          style={{ marginTop: 12, width: "100%", padding: "14px", background: loading ? "#334155" : "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Analyzing…" : "Analyze Message"}
        </button>

        {error && <p style={{ color: "#ef4444", marginTop: 16 }}>{error}</p>}

        {result && (
          <div style={{ marginTop: 32, background: "#1e293b", borderRadius: 12, padding: 24, border: "1px solid #334155" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ background: categoryColor + "22", color: categoryColor, border: `1px solid ${categoryColor}`, borderRadius: 20, padding: "6px 16px", fontWeight: 600, fontSize: 14 }}>
                {result.category}
              </span>
              <span style={{ background: sentimentColor[result.sentiment] + "22", color: sentimentColor[result.sentiment], border: `1px solid ${sentimentColor[result.sentiment]}`, borderRadius: 20, padding: "6px 16px", fontWeight: 600, fontSize: 14 }}>
                {result.sentiment === "Positive" ? "😊" : result.sentiment === "Negative" ? "😞" : "😐"} {result.sentiment}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>AUTO-REPLY</p>
            <p style={{ background: "#0f172a", borderRadius: 8, padding: 16, color: "#e2e8f0", lineHeight: 1.6, fontSize: 15 }}>
              {result.reply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}