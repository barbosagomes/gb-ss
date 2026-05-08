import { useState } from "react";

// ─── Brand mark ───────────────────────────────────────────────────────────────
const StockSyncMark = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#0F172A" />
    <path
      d="M22 10 C22 10 28 10 30 14 C32 18 28 20 28 20 L20 20 L20 32 C20 34 18 36 16 36 C14 36 12 34 12 32 C12 30 14 28 16 28 L18 28 L18 14 Z"
      fill="white"
      stroke="#22D3EE"
      strokeWidth="0.5"
    />
    <rect x="26" y="26" width="4" height="10" rx="1" fill="#0EA5E9" opacity="0.7" />
    <rect x="31" y="22" width="4" height="14" rx="1" fill="#A855F7" opacity="0.8" />
    <rect x="36" y="18" width="4" height="18" rx="1" fill="#22D3EE" />
    <path d="M26 26 L38 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 14 L38 14 L38 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Social login button ──────────────────────────────────────────────────────
interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

const SocialButton = ({ icon, label, onClick, isLoading }: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      width: "100%",
      padding: "12px 20px",
      background: "#FFFFFF",
      border: "1.5px solid #1E293B",
      borderRadius: "10px",
      cursor: isLoading ? "not-allowed" : "pointer",
      fontFamily: '"DM Sans", sans-serif',
      fontSize: "15px",
      fontWeight: 500,
      color: "#0F172A",
      transition: "all 0.18s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      opacity: isLoading ? 0.7 : 1,
    }}
    onMouseEnter={e => {
      if (!isLoading) {
        (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#0F172A";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
      }
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
      (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E293B";
      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
    }}
  >
    {icon}
    <span>{isLoading ? "Redirecionando..." : label}</span>
  </button>
);

// ─── Google icon ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── GitHub icon ──────────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F172A" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = ({ label }: { label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
    <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "13px", color: "#94A3B8", fontWeight: 400 }}>
      {label}
    </span>
    <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
  </div>
);

// ─── Main Login component ─────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [loading, setLoading]         = useState<"google" | "github" | "email" | null>(null);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  // ── OAuth handlers: redirect to backend routes ──────────────────────────────
  const handleGitHubLogin = () => {
    setLoading("github");
    window.location.href = "/api/auth/github";
  };

  const handleGoogleLogin = () => {
    setLoading("google");
    window.location.href = "/api/auth/google";
  };

  const handleEmailLogin = () => {
    // TODO: implement email/password login via tRPC mutation
    setLoading("email");
    setTimeout(() => setLoading(null), 1800);
  };

  const inputStyle = (field: "email" | "password"): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    background: "#FFFFFF",
    border: `1.5px solid ${focusedField === field ? "#0EA5E9" : "#E2E8F0"}`,
    borderRadius: "10px",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "15px",
    color: "#0F172A",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    boxShadow: focusedField === field
      ? "0 0 0 3px rgba(14,165,233,0.12)"
      : "0 1px 2px rgba(0,0,0,0.04)",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: '"DM Sans", sans-serif',
        backgroundImage: `radial-gradient(circle, #CBD5E1 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      {/* ── Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "40px",
          boxShadow: "0 20px 60px -10px rgba(15,23,42,0.12)",
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <StockSyncMark />
          </div>
          <h1
            style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: "26px",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            GB StockSync
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px", margin: "6px 0 0 0", fontWeight: 400 }}>
            Sincronize seu estoque com o TikTok Shop
          </p>
        </div>

        {/* ── Social Buttons ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          <SocialButton
            icon={<GoogleIcon />}
            label="Continuar com Google"
            onClick={handleGoogleLogin}
            isLoading={loading === "google"}
          />
          <SocialButton
            icon={<GitHubIcon />}
            label="Continuar com GitHub"
            onClick={handleGitHubLogin}
            isLoading={loading === "github"}
          />
        </div>

        <Divider label="ou entre com e-mail" />

        {/* ── Email Form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontFamily: '"DM Sans", sans-serif',
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              placeholder="guilherme@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("email")}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Senha
              </label>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "13px",
                  color: "#0EA5E9",
                  cursor: "pointer",
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Esqueceu a senha?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("password")}
            />
          </div>

          {/* ── Primary CTA ── */}
          <button
            type="button"
            onClick={handleEmailLogin}
            disabled={loading === "email"}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "4px",
              background: loading === "email"
                ? "#7DD3FC"
                : "linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontFamily: '"DM Sans", sans-serif',
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading === "email" ? "not-allowed" : "pointer",
              transition: "all 0.18s ease",
              boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              if (loading !== "email") {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(14,165,233,0.45)";
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(14,165,233,0.35)";
            }}
          >
            {loading === "email" ? "Entrando..." : "Entrar na conta"}
          </button>
        </div>

        {/* ── Footer ── */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "13px",
            color: "#94A3B8",
            fontWeight: 400,
          }}
        >
          Não tem uma conta?{" "}
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "#0EA5E9",
              cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: "13px",
              padding: 0,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            Criar conta grátis
          </button>
        </p>
      </div>
    </div>
  );
}
