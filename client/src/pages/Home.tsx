import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Settings,
  Package,
  BarChart2,
  ClipboardList,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <DashboardLayout>
      <HomeContent />
    </DashboardLayout>
  );
}

function getGreeting(): string {
  // Brasília timezone is UTC-3 (or UTC-2 during daylight saving)
  const brasiliaNow = new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
  const hour = brasiliaNow.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
}

function HomeContent() {
  const { user } = useAuth();
  const productsQuery = trpc.tiktok.getProducts.useQuery(undefined, {
    enabled: !!user,
  });

  const [, navigate] = useLocation();
  const greeting = getGreeting();

  const products = productsQuery.data ?? [];
  const totalProducts = products.length;
  const totalSkus = products.reduce(
    (acc: number, p: any) => acc + (p.skuCount ?? 0),
    0,
  );
  const totalStock = products.reduce(
    (acc: number, p: any) => acc + (p.totalStock ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          {greeting}, {user?.name?.split(" ")[0] ?? "usuário"}
        </h1>
        <p className="text-lg text-gray-600">
          Painel de controle da integração TikTok Shop
        </p>
      </div>

      {/* Stats Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Produtos"
          value={productsQuery.isLoading ? null : totalProducts.toString()}
          description="Sincronizados"
          icon={<Package className="h-8 w-8" />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="SKUs"
          value={productsQuery.isLoading ? null : totalSkus.toString()}
          description="Cadastrados"
          icon={<TrendingUp className="h-8 w-8" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Estoque"
          value={productsQuery.isLoading ? null : totalStock.toString()}
          description="Unidades totais"
          icon={<RefreshCw className="h-8 w-8" />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Margem Média"
          value="—"
          description="De lucro"
          icon={<BarChart2 className="h-8 w-8" />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            title="Configurar Integração"
            description="Credenciais e webhooks do TikTok Shop"
            onClick={() => navigate("/settings")}
            icon={<Settings className="h-6 w-6" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <ActionCard
            title="Gerenciar Produtos"
            description="Sincronize produtos e configure custos"
            onClick={() => navigate("/products")}
            icon={<Package className="h-6 w-6" />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <ActionCard
            title="Análise Financeira"
            description="Visualize lucro e margem de produtos"
            onClick={() => navigate("/analytics")}
            icon={<BarChart2 className="h-6 w-6" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          <ActionCard
            title="Histórico de Sync"
            description="Acompanhe alterações de estoque"
            onClick={() => navigate("/sync-logs")}
            icon={<ClipboardList className="h-6 w-6" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
      </div>

      {/* Setup Banner */}
      {!productsQuery.isLoading && totalProducts === 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex-shrink-0">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl text-gray-900 mb-3">
                Primeiros passos
              </h3>
              <p className="text-base text-gray-700 mb-6">
                Comece configurando suas credenciais do TikTok Shop para sincronizar seus produtos e começar a gerenciar seu estoque.
              </p>
              <Button 
                onClick={() => navigate("/settings")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6"
              >
                Configurar Agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string | null;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {title}
        </p>
        <div className={`p-3 ${iconBg} rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </div>
      {value === null ? (
        <Skeleton className="h-10 w-24 mb-3 rounded" />
      ) : (
        <p className="text-4xl font-bold text-gray-900 mb-3">{value}</p>
      )}
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  onClick,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  description: string;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-6 text-left shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${iconBg} rounded-lg ${iconColor}`}>
          {icon}
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
