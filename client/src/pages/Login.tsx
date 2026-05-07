import { useState, useEffect } from "react";
import { Github, Chrome } from "lucide-react";

export default function Login() {
  const [greeting, setGreeting] = useState("Bem-vindo");

  useEffect(() => {
    // Get greeting based on Brasília timezone
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl font-bold text-white">TK</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TikTok Stock Sync</h1>
          <p className="text-slate-400 text-lg">{greeting}</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Faça login</h2>
            <p className="text-slate-400">
              Escolha seu método de autenticação para continuar
            </p>
          </div>

          {/* GitHub Login Button */}
          <button
            onClick={handleGithubLogin}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 mb-4 transition-colors duration-200 border border-slate-600 hover:border-slate-500"
          >
            <Github className="w-5 h-5" />
            Continuar com GitHub
          </button>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-slate-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200"
          >
            <Chrome className="w-5 h-5" />
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Info Text */}
          <p className="text-center text-slate-400 text-sm">
            Ao fazer login, você concorda com nossos{" "}
            <a href="#" className="text-pink-500 hover:text-pink-400">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="text-pink-500 hover:text-pink-400">
              Política de Privacidade
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Gerenciamento inteligente de estoque para TikTok Shop</p>
        </div>
      </div>
    </div>
  );
}
