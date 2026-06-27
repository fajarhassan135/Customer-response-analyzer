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
};

type MessageRow = {
  id: string;
  content: string;
  category: string;
  sentiment: string;
  urgency: string;
  reply: string;
  created_at: string;
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

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUser(data.user);
        fetchMessages(data.user.id);
      }
    });
  }, []);

  async function fetchMessages(userId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setMessages(data as MessageRow[]);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const categories = ["All", ...Array.from(new Set(messages.map((m) => m.category)))];
  const urgencies = ["All", "Low", "Medium", "High"];

  const filtered = messages.filter((m) => {
    if (categoryFilter !== "All" && m.category !== categoryFilter) return false;
    if (urgencyFilter !== "All" && m.urgency !== urgencyFilter) return false;
    return true;
  });

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
          <a href="/dashboard" style={{ fontSize: 13, color: C.sub, textDecoration: "none" }}>Analyze</a>
          <a href="/history" style={{ fontSize: 13, color: C.indigo, fontWeight: 600, textDecoration: "none" }}>History</a>
          <a href="/insights" style={{ fontSize: 13, color: C.sub, textDecoration: "none" }}>Insights</a>
          <button onClick={handleLogout} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 999, backgroundColor: "transparent", color: C.indigo, border: `1px solid ${C.indigo}`, cursor: "pointer" }}>
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 4 }}>Message history</h1>
        <p style={{ color: C.sub, marginBottom: 32 }}>{messages.length} messages analyzed total.</p>

        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.panel, color: C.text, fontSize: 13 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.panel, color: C.text, fontSize: 13 }}
          >
            {urgencies.map((u) => (
              <option key={u} value={u}>{u === "All" ? "All urgency" : u + " urgency"}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p style={{ color: C.sub }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: C.panel, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <p style={{ color: C.sub, marginBottom: 16 }}>No messages match this filter.</p>
            <a href="/dashboard" style={{ color: C.indigo, fontWeight: 600, textDecoration: "none" }}>Analyze your first message →</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((m) => (
              <div key={m.id} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5, flex: 1, marginRight: 16 }}>{m.content}</p>
                  <span style={{ fontSize: 11, color: C.sub, whiteSpace: "nowrap" }}>
                    {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ background: C.indigo + "22", color: C.indigo, border: `1px solid ${C.indigo}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, fontSize: 12 }}>
                    {m.category}
                  </span>
                  <span style={{ background: sentimentColor[m.sentiment] + "22", color: sentimentColor[m.sentiment], border: `1px solid ${sentimentColor[m.sentiment]}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, fontSize: 12 }}>
                    {m.sentiment}
                  </span>
                  <span style={{ background: urgencyColor[m.urgency] + "22", color: urgencyColor[m.urgency], border: `1px solid ${urgencyColor[m.urgency]}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, fontSize: 12 }}>
                    {m.urgency} urgency
                  </span>
                </div>
                <p style={{ background: C.bg, borderRadius: 8, padding: 12, color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>{m.reply}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}