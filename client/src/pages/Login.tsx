import { useState, useEffect } from "react";
import { Github, Chrome, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [greeting, setGreeting] = useState("Bem-vindo");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const brasiliaNow = new Date(
      new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    );
    const hour = brasiliaNow.getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Bom dia");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
  }, []);

  const handleGithubLogin = () => {
    setIsLoading(true);
    const redirectUri = `${window.location.origin}/api/oauth/github/callback`;
    const state = btoa(redirectUri);
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "Ov23li2gjbSYAvEN6Iua";

    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", "user:email");
    url.searchParams.set("state", state);

    window.location.href = url.toString();
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const redirectUri = `${window.location.origin}/api/oauth/google/callback`;
    const state = btoa(redirectUri);
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com";

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", state);

    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Left Section - Branding */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TikTok Stock</h1>
              <p className="text-sm text-gray-600">Sincronização inteligente</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{greeting}</p>
            <h2 className="text-4xl font-bold text-gray-900">Bem-vindo</h2>
            <p className="text-gray-600">
              Gerencie seu estoque do TikTok Shop com inteligência
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* GitHub Login */}
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-between gap-3 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                <span>Continuar com GitHub</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-between gap-3 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 group"
            >
              <div className="flex items-center gap-3">
                <Chrome className="w-5 h-5 text-blue-600" />
                <span>Continuar com Google</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Info */}
            <p className="text-center text-xs text-gray-600">
              Ao fazer login, você concorda com nossos{" "}
              <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
                Termos
              </a>{" "}
              e{" "}
              <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
                Privacidade
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">Real-time</div>
            <p className="text-xs text-gray-600">Sincronização</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
            <p className="text-xs text-gray-600">Seguro</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
            <p className="text-xs text-gray-600">Monitorado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
