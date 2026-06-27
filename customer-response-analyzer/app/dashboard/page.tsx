"use client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

const C = {
  bg: "#0f172a",
  panel: "#1e293b",
  border: "#334155",
  text: "#f1f5f9",
  sub: "#94a3b8",
  indigo: "#6366f1",
  indigoDark: "#4f46e5",
};

const SAMPLE_MESSAGES = [
  "I ordered 5 days ago and still haven't received my package!",
  "I'd like to return the shoes I bought last week.",
  "Do you have this jacket in size medium?",
  "Your website keeps logging me out every time I try to checkout.",
  "Thank you so much, the product is amazing!",
  "Buy cheap meds online click here now!!!",
];

type AnalysisResult = {
  content: string;
  category: string;
  sentiment: string;
  urgency: string;
  reply: string;
};

const sentimentColor: Record<string, string> = {
  Positive: "#22c55e",
  Neutral: "#f59e0b",
  Negative: "#ef4444",
};

const urgencyColor: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bulkInput, setBulkInput] = useState("");
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUser(data.user);
      }
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setBulkInput((prev) => (prev ? prev + "\n" + lines.join("\n") : lines.join("\n")));
    };
    reader.readAsText(file);
  }

  async function analyzeMessage(message: string): Promise<AnalysisResult | null> {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) return null;
      return { content: message, ...data };
    } catch {
      return null;
    }
  }

  async function handleAnalyze() {
    const messages = bulkInput
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    if (messages.length === 0 || !user) return;

    setLoading(true);
    setError("");
    setResults([]);
    setProgress({ done: 0, total: messages.length });

    const newResults: AnalysisResult[] = [];

    for (const message of messages) {
      const result = await analyzeMessage(message);
      if (result) {
        newResults.push(result);
        await supabase.from("messages").insert({
          user_id: user.id,
          content: result.content,
          category: result.category,
          sentiment: result.sentiment,
          urgency: result.urgency,
          reply: result.reply,
        });
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    if (newResults.length === 0) {
      setError("Could not analyze any messages. Please try again.");
    }

    setResults(newResults);
    setLoading(false);
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ color: C.sub, fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Customer Response Analyzer</div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: 13, color: C.indigo, fontWeight: 600, textDecoration: "none" }}>Analyze</a>
          <a href="/history" style={{ fontSize: 13, color: C.sub, textDecoration: "none" }}>History</a>
          <a href="/insights" style={{ fontSize: 13, color: C.sub, textDecoration: "none" }}>Insights</a>
          <button onClick={handleLogout} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 999, backgroundColor: "transparent", color: C.indigo, border: `1px solid ${C.indigo}`, cursor: "pointer" }}>
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 4 }}>Analyze customer messages</h1>
        <p style={{ color: C.sub, marginBottom: 32 }}>Paste one message per line, or upload a CSV. Each line is treated as a separate message.</p>

        <p style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>Quick samples:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {SAMPLE_MESSAGES.map((msg, i) => (
            <button
              key={i}
              onClick={() => setBulkInput((prev) => (prev ? prev + "\n" + msg : msg))}
              style={{ background: C.panel, border: `1px solid ${C.border}`, color: "#cbd5e1", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
            >
              {msg.length > 40 ? msg.slice(0, 40) + "…" : msg}
            </button>
          ))}
        </div>

        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Paste one customer message per line..."
          rows={6}
          style={{ width: "100%", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, color: C.text, fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
          <button
            onClick={handleAnalyze}
            disabled={loading || !bulkInput.trim()}
            style={{ flex: 1, padding: "14px", background: loading ? C.border : C.indigo, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? `Analyzing ${progress.done}/${progress.total}...` : "Analyze Messages"}
          </button>

          <label style={{ padding: "14px 20px", background: "transparent", border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Upload CSV
            <input type="file" accept=".csv,.txt" onChange={handleCsvUpload} style={{ display: "none" }} />
          </label>
        </div>

        {error && <p style={{ color: "#ef4444", marginTop: 16 }}>{error}</p>}

        {results.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>Results ({results.length})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map((r, i) => (
                <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                  <p style={{ fontSize: 14, color: C.text, marginBottom: 12, lineHeight: 1.5 }}>{r.content}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    <span style={{ background: C.indigo + "22", color: C.indigo, border: `1px solid ${C.indigo}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, fontSize: 12 }}>
                      {r.category}
                    </span>
                    <span style={{ background: sentimentColor[r.sentiment] + "22", color: sentimentColor[r.sentiment], border: `1px solid ${sentimentColor[r.sentiment]}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, fontSize: 12 }}>
                      {r.sentiment}
                    </span>
                    <span style={{ background: urgencyColor[r.urgency] + "22", color: urgencyColor[r.urgency], border: `1px solid ${urgencyColor[r.urgency]}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, fontSize: 12 }}>
                      {r.urgency} urgency
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: C.sub, marginBottom: 4 }}>Suggested reply:</p>
                  <p style={{ background: C.bg, borderRadius: 8, padding: 12, color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>{r.reply}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}