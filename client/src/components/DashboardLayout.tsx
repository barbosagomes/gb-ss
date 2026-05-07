import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import {
  Home,
  Package,
  BarChart2,
  Clock,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, navigate] = useLocation();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TikTok Stock Sync
          </h1>
          <p className="text-gray-600 mb-6">
            Faça login para acessar o painel de controle
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Package, label: "Produtos", href: "/products" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Clock, label: "Histórico", href: "/sync-logs" },
    { icon: Bell, label: "Alertas", href: "/alerts" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              TK
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-bold text-lg text-gray-900">TikTok</div>
                <div className="text-xs text-gray-600">Stock Sync</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 group"
              title={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"></div>              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-300 transition-colors duration-200 text-sm"
            >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
            title={sidebarOpen ? "Recolher" : "Expandir"}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            TikTok Stock Sync
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
