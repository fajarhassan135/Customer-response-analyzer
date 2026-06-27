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

export default function InsightsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  const total = messages.length;

  const categoryBreakdown = messages.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentBreakdown = messages.reduce((acc, m) => {
    acc[m.sentiment] = (acc[m.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const urgentMessages = messages.filter((m) => m.urgency === "High").slice(0, 5);
  const spamCount = messages.filter((m) => m.category === "Spam").length;

  const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);

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
          <a href="/history" style={{ fontSize: 13, color: C.sub, textDecoration: "none" }}>History</a>
          <a href="/insights" style={{ fontSize: 13, color: C.indigo, fontWeight: 600, textDecoration: "none" }}>Insights</a>
          <button onClick={handleLogout} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 999, backgroundColor: "transparent", color: C.indigo, border: `1px solid ${C.indigo}`, cursor: "pointer" }}>
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 4 }}>Insights</h1>
        <p style={{ color: C.sub, marginBottom: 32 }}>Aggregate trends across all your analyzed messages.</p>

        {loading ? (
          <p style={{ color: C.sub }}>Loading...</p>
        ) : total === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: C.panel, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <p style={{ color: C.sub, marginBottom: 16 }}>No data yet — analyze some messages first.</p>
            <a href="/dashboard" style={{ color: C.indigo, fontWeight: 600, textDecoration: "none" }}>Go to Analyze →</a>
          </div>
        ) : (
          <>
            {/* TOP STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
              {[
                { label: "Total analyzed", value: total },
                { label: "Negative sentiment", value: sentimentBreakdown["Negative"] || 0 },
                { label: "High urgency", value: messages.filter((m) => m.urgency === "High").length },
                { label: "Flagged as spam", value: spamCount },
              ].map((stat) => (
                <div key={stat.label} style={{ backgroundColor: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
              {/* CATEGORY BREAKDOWN */}
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>By category</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sortedCategories.map(([category, count]) => {
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={category}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: C.text }}>{category}</span>
                          <span style={{ fontSize: 13, color: C.sub }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 6, backgroundColor: C.border, borderRadius: 4 }}>
                          <div style={{ height: 6, width: `${pct}%`, backgroundColor: C.indigo, borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SENTIMENT BREAKDOWN */}
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>By sentiment</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Positive", "Neutral", "Negative"].map((sentiment) => {
                    const count = sentimentBreakdown[sentiment] || 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={sentiment}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: C.text }}>{sentiment}</span>
                          <span style={{ fontSize: 13, color: C.sub }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 6, backgroundColor: C.border, borderRadius: 4 }}>
                          <div style={{ height: 6, width: `${pct}%`, backgroundColor: sentimentColor[sentiment], borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* URGENT MESSAGES */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Needs urgent attention</h2>
              {urgentMessages.length === 0 ? (
                <p style={{ color: C.sub, fontSize: 14 }}>No high-urgency messages right now.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {urgentMessages.map((m) => (
                    <div key={m.id} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 16 }}>
                      <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{m.content}</p>
                      <p style={{ fontSize: 11, color: C.sub, marginTop: 6 }}>{m.category} · {new Date(m.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}