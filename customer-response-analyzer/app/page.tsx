"use client";

const C = {
  bg: "#0f172a",
  panel: "#1e293b",
  border: "#334155",
  text: "#f1f5f9",
  sub: "#94a3b8",
  indigo: "#6366f1",
  indigoDark: "#4f46e5",
};

const features = [
  { title: "Bulk message analysis", desc: "Paste or upload dozens of customer messages at once — get categorized, scored, and drafted replies in seconds." },
  { title: "Sentiment & urgency scoring", desc: "Every message is scored for tone and flagged by urgency, so your team knows what to handle first." },
  { title: "Auto-drafted replies", desc: "Each message gets a short, professional reply draft your team can send as-is or tweak." },
  { title: "Spam detection", desc: "Junk and promotional messages are automatically flagged and routed out of your support queue." },
  { title: "Insights dashboard", desc: "Track category trends, sentiment distribution, and urgent issues over time." },
  { title: "Private, per-account history", desc: "Every analyzed message is saved securely to your own account — never shared across users." },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: "sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, backgroundColor: C.bg, zIndex: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Customer Response Analyzer</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/login" style={{ fontSize: 13, color: C.sub, textDecoration: "none" }}>Log in</a>
          <a href="/signup" style={{ fontSize: 13, fontWeight: 600, padding: "9px 20px", borderRadius: 999, backgroundColor: C.indigo, color: "#fff", textDecoration: "none" }}>
            Sign up free
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.indigo, marginBottom: 16 }}>
          AI-Powered Support Automation
        </p>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 24 }}>
          Understand and respond to<br />
          <span style={{ color: C.indigo }}>customer messages, instantly.</span>
        </h1>
        <p style={{ fontSize: 16, color: C.sub, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
          Paste in customer feedback, support tickets, or reviews — get instant categorization, sentiment, urgency scoring, and a drafted reply for every message.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <a href="/signup" style={{ padding: "14px 32px", borderRadius: 10, backgroundColor: C.indigo, color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            Get started free
          </a>
          <a href="/login" style={{ padding: "14px 32px", borderRadius: 10, backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: 15, border: `1px solid ${C.border}`, textDecoration: "none" }}>
            Log in
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ backgroundColor: C.panel, padding: "72px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>Everything your support team needs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Stop reading every message manually.</h2>
        <p style={{ fontSize: 15, color: C.sub, marginBottom: 32 }}>Free to try — analyze your first batch of messages in under a minute.</p>
        <a href="/signup" style={{ display: "inline-block", padding: "14px 36px", backgroundColor: C.indigo, color: "#fff", fontWeight: 600, fontSize: 15, borderRadius: 10, textDecoration: "none" }}>
          Create free account
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Customer Response Analyzer</div>
          <div style={{ fontSize: 12, color: C.sub }}>Built with Next.js, Supabase, and Groq.</div>
        </div>
      </footer>

    </div>
  );
}