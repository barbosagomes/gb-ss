import { useState, ReactNode } from "react";
import { trpc } from "@/lib/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface KpiCardData {
  label: string;
  value: string | number;
  sub: string;
  icon: ReactNode;
  bgColor: string;
  iconColor: string;
  accent: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon     = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const BoxIcon      = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const BarChartIcon = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const ClockIcon    = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const BellIcon     = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const SettingsIcon = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const LogOutIcon   = ({ s = 16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const TagIcon      = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const ArchiveIcon  = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>;
const PercentIcon  = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
const ChevronIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const PlugIcon     = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const BagIcon      = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const TrendingIcon = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const HistoryIcon  = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>;
const AlertIcon    = ({ s = 22 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><triangle points="10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { id: "inicio",        label: "Início",        icon: <HomeIcon /> },
  { id: "produtos",      label: "Produtos",       icon: <BoxIcon /> },
  { id: "analytics",     label: "Analytics",      icon: <BarChartIcon /> },
  { id: "historico",     label: "Histórico",      icon: <ClockIcon /> },
  { id: "alertas",       label: "Alertas",        icon: <BellIcon /> },
  { id: "configuracoes", label: "Configurações",  icon: <SettingsIcon /> },
];

interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
  user: { name: string; email: string; avatarUrl?: string } | null;
  alertCount?: number;
}

const Sidebar = ({ activeId, onNavigate, user, alertCount = 0 }: SidebarProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  // Iniciais do nome para o avatar fallback
  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo oficial: logo.png deve estar em client/public/logo.png */}
          <img
            src="/logo.png"
            alt="GB StockSync"
            width={36}
            height={36}
            style={{
              borderRadius: 9,
              flexShrink: 0,
              objectFit: "contain",
              background: "#1E293B",
            }}
            onError={e => {
              // Fallback inline se logo.png não for encontrado
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          {/* Fallback SVG (oculto por padrão) */}
          <div
            style={{
              display: "none",
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.12)",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M11 4C11 4 15 4 16 6.5C17 9 14.5 10 14.5 10L10 10L10 18C10 19.1 9.1 20 8 20C6.9 20 6 19.1 6 18C6 16.9 6.9 16 8 16L9 16L9 6Z" fill="white"/>
              <rect x="14" y="14" width="2" height="6" rx="0.5" fill="#22D3EE"/>
              <rect x="17" y="12" width="2" height="8" rx="0.5" fill="#A855F7"/>
            </svg>
          </div>

          <div>
            <div
              style={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                fontSize: 15,
                color: "#FFFFFF",
                letterSpacing: "-0.3px",
                lineHeight: 1.2,
              }}
            >
              StockSync
            </div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              TikTok Shop
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="sidebar-scroll" style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const isActive  = item.id === activeId;
          const isHovered = item.id === hoveredId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 9,
                border: "none",
                background: isActive
                  ? "rgba(14,165,233,0.15)"
                  : isHovered
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
                color: isActive ? "#38BDF8" : isHovered ? "#CBD5E1" : "#64748B",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s ease",
                marginBottom: 2,
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    background: "#0EA5E9",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <span style={{ opacity: isActive ? 1 : isHovered ? 0.8 : 0.6 }}>
                {item.icon}
              </span>
              {item.label}
              {item.id === "alertas" && alertCount > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#EF4444",
                    color: "#FFF",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 99,
                    padding: "1px 6px",
                    lineHeight: "16px",
                  }}
                >
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 8,
          }}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              width={34}
              height={34}
              style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0EA5E9, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontFamily: '"Syne", sans-serif',
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name ?? "Usuário"}
            </div>
            <div style={{ color: "#64748B", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email ?? ""}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 8,
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.06)",
            color: "#F87171",
            cursor: "pointer",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            fontWeight: 500,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.06)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.2)";
          }}
        >
          <LogOutIcon />
          Sair da conta
        </button>
      </div>
    </aside>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, icon, bgColor, iconColor, accent }: KpiCardData) => {
  const [hovered, setHovered] = useState(false);
  const isEmpty = value === 0 || value === "—";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${hovered ? accent : "#E2E8F0"}`,
        borderRadius: 14,
        padding: "20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        transition: "all 0.2s ease",
        boxShadow: hovered
          ? `0 4px 16px rgba(0,0,0,0.08), 0 0 0 3px ${accent}20`
          : "0 1px 3px rgba(0,0,0,0.05)",
        cursor: "default",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, color: "#64748B", marginBottom: 2 }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: 28,
            fontWeight: 800,
            color: isEmpty ? "#94A3B8" : "#0F172A",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}>{sub}</div>
      </div>
    </div>
  );
};

// ─── Quick Action Card ────────────────────────────────────────────────────────
const QuickActionCard = ({ label, description, icon, iconBg, iconColor, onClick }: QuickAction) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${hovered ? "#CBD5E1" : "#E2E8F0"}`,
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 11,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          flexShrink: 0,
          transition: "transform 0.18s ease",
          transform: hovered ? "scale(1.08)" : "none",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.4 }}>{description}</div>
      </div>
      <div
        style={{
          color: hovered ? "#0EA5E9" : "#CBD5E1",
          transition: "color 0.18s ease, transform 0.18s ease",
          transform: hovered ? "translateX(3px)" : "none",
        }}
      >
        <ChevronIcon />
      </div>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const KpiSkeleton = () => (
  <div
    style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 14,
      padding: "20px",
      display: "flex",
      gap: 16,
    }}
  >
    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F1F5F9", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      <div style={{ height: 12, width: "60%", borderRadius: 6, background: "#F1F5F9" }} />
      <div style={{ height: 24, width: "40%", borderRadius: 6, background: "#E2E8F0" }} />
      <div style={{ height: 10, width: "50%", borderRadius: 6, background: "#F1F5F9" }} />
    </div>
  </div>
);

// ─── Main Dashboard Layout ────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const [activeNav, setActiveNav] = useState("inicio");

  // ── Dados reais via tRPC ────────────────────────────────────────────────────
  // Troca pelos seus procedimentos reais quando a API estiver pronta.
  // Ex: const { data: stats } = trpc.dashboard.getStats.useQuery();
  //
  // Por ora usamos valores mock para garantir que a UI renderize corretamente.
  const { data: user } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    // Fallback silencioso — não bloqueia o layout
    onError: () => {},
  } as any);

  // KPI data — substitua pelos seus endpoints reais
  // Exemplo: const { data: kpiData, isLoading } = trpc.dashboard.kpis.useQuery();
  const isLoadingKpis = false; // trocar por isLoading do query real
  const kpis: KpiCardData[] = [
    {
      label: "Produtos",
      value: 0,        // TODO: kpiData?.totalProducts ?? 0
      sub: "Sincronizados com TikTok",
      icon: <BoxIcon s={22} />,
      bgColor: "#DCFCE7",
      iconColor: "#16A34A",
      accent: "#16A34A",
    },
    {
      label: "SKUs",
      value: 0,        // TODO: kpiData?.totalSkus ?? 0
      sub: "Variantes cadastradas",
      icon: <TagIcon s={22} />,
      bgColor: "#DBEAFE",
      iconColor: "#2563EB",
      accent: "#2563EB",
    },
    {
      label: "Alertas de Estoque",
      value: 0,        // TODO: kpiData?.stockAlerts ?? 0
      sub: "Itens com estoque baixo",
      icon: <AlertIcon s={22} />,
      bgColor: "#FEF3C7",
      iconColor: "#D97706",
      accent: "#D97706",
    },
    {
      label: "Vendas TikTok",
      value: "—",      // TODO: kpiData?.tikTokSales ?? "—"
      sub: "Últimas 24 horas",
      icon: <TrendingIcon s={22} />,
      bgColor: "#F3E8FF",
      iconColor: "#7C3AED",
      accent: "#7C3AED",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      label: "Configurar Integração",
      description: "Conecte e configure sua loja TikTok Shop.",
      icon: <PlugIcon />,
      iconBg: "#DCFCE7",
      iconColor: "#16A34A",
      onClick: () => setActiveNav("configuracoes"),
    },
    {
      label: "Gerenciar Produtos",
      description: "Cadastre, edite e sincronize seus produtos.",
      icon: <BagIcon />,
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      onClick: () => setActiveNav("produtos"),
    },
    {
      label: "Análise Financeira",
      description: "Acompanhe vendas, margens e desempenho.",
      icon: <TrendingIcon />,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      onClick: () => setActiveNav("analytics"),
    },
    {
      label: "Histórico de Sync",
      description: "Veja o histórico de sincronizações realizadas.",
      icon: <HistoryIcon />,
      iconBg: "#F3E8FF",
      iconColor: "#7C3AED",
      onClick: () => setActiveNav("historico"),
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const displayName = (user as any)?.name ?? (user as any)?.login ?? "Usuário";

  // Conta alertas para o badge da sidebar
  const alertCount = kpis.find(k => k.label === "Alertas de Estoque")?.value as number ?? 0;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      {/* ── Sidebar ── */}
      <Sidebar
        activeId={activeNav}
        onNavigate={setActiveNav}
        user={
          user
            ? {
                name:      (user as any).name ?? (user as any).login ?? "Usuário",
                email:     (user as any).email ?? "",
                avatarUrl: (user as any).avatarUrl ?? (user as any).avatar_url,
              }
            : null
        }
        alertCount={alertCount}
      />

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          padding: "36px 40px",
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        {/* ── Page header ── */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: 32,
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.6px",
            }}
          >
            {getGreeting()}, {displayName}
          </h1>
          <p style={{ color: "#64748B", margin: "6px 0 0 0", fontSize: 15, fontWeight: 400 }}>
            Painel de controle da integração TikTok Shop
          </p>
        </div>

        {/* ── KPI Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {isLoadingKpis
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : kpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)
          }
        </div>

        {/* ── Quick Access ── */}
        <div style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 16px 0",
              letterSpacing: "-0.3px",
            }}
          >
            Acesso Rápido
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 12,
            }}
          >
            {quickActions.map(action => (
              <QuickActionCard key={action.label} {...action} />
            ))}
          </div>
        </div>

        {/* ── Slot para conteúdo específico de cada página ── */}
        {children}
      </main>
    </div>
  );
}
