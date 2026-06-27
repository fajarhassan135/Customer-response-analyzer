"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { company_name: companyName } },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 12 }}>Check your email</h2>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.7 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <a href="/login" style={{ display: "inline-block", marginTop: 28, padding: "12px 28px", backgroundColor: C.indigo, color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 8 }}>Create account</h1>
        <p style={{ fontSize: 14, color: C.sub, marginBottom: 32 }}>Start analyzing customer messages with AI.</p>

        {error && (
          <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#ef4444" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Company name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Your company"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.panel, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.panel, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.panel, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ width: "100%", padding: "13px", borderRadius: 8, backgroundColor: C.indigo, color: "#fff", fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer" }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: C.sub, marginTop: 20 }}>
          Already have an account? <a href="/login" style={{ color: C.indigo, textDecoration: "none", fontWeight: 600 }}>Log in</a>
        </p>
      </div>
    </div>
  );
}