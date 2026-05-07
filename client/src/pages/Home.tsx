import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Package,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Plus,
  Filter,
  Download,
  Eye,
  MoreVertical,
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
  const brasiliaNow = new Date(
    new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
  );
  const hour = brasiliaNow.getHours();

  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
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
  const totalSkus = products.reduce((acc: number, p: any) => acc + (p.skuCount ?? 0), 0);
  const totalStock = products.reduce((acc: number, p: any) => acc + (p.totalStock ?? 0), 0);
  const lowStockCount = products.filter((p: any) => (p.totalStock ?? 0) < 10).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {greeting}, {user?.name?.split(" ")[0] ?? "usuário"}
          </h1>
          <p className="text-gray-600 mt-2">
            Painel de controle - TikTok Shop Sync
          </p>
        </div>
        <Button
          onClick={() => navigate("/products")}
          className="bg-pink-600 hover:bg-pink-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Sincronizar Produtos
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Produtos"
          value={productsQuery.isLoading ? null : totalProducts}
          subtitle="Sincronizados"
          icon={<Package className="w-6 h-6" />}
          color="bg-blue-50"
          iconColor="text-blue-600"
          trend="+12%"
        />
        <KPICard
          title="SKUs"
          value={productsQuery.isLoading ? null : totalSkus}
          subtitle="Variações"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-green-50"
          iconColor="text-green-600"
          trend="+8%"
        />
        <KPICard
          title="Estoque Total"
          value={productsQuery.isLoading ? null : totalStock}
          subtitle="Unidades"
          icon={<RefreshCw className="w-6 h-6" />}
          color="bg-purple-50"
          iconColor="text-purple-600"
          trend="+5%"
        />
        <KPICard
          title="Baixo Estoque"
          value={productsQuery.isLoading ? null : lowStockCount}
          subtitle="Produtos"
          icon={<AlertCircle className="w-6 h-6" />}
          color="bg-red-50"
          iconColor="text-red-600"
          trend={lowStockCount > 0 ? "⚠️ Atenção" : "✓ OK"}
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Produtos Recentes</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>

        {productsQuery.isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Estoque
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product: any, idx: number) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name || "Produto"}
                          </p>
                          <p className="text-xs text-gray-600">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.skuCount || 0} SKUs
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className={`h-2 rounded-full ${
                              (product.totalStock ?? 0) > 50
                                ? "bg-green-500"
                                : (product.totalStock ?? 0) > 20
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min((product.totalStock ?? 0) / 100, 1) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {product.totalStock ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.price ? `R$ ${product.price.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          (product.totalStock ?? 0) > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(product.totalStock ?? 0) > 0 ? "Em estoque" : "Fora de estoque"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Nenhum produto sincronizado</p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Sincronizar Primeiro Produto
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
          <h3 className="font-bold text-gray-900 mb-2">Sincronização Automática</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ative a sincronização automática para manter seu estoque sempre atualizado
          </p>
          <Button variant="outline" size="sm">
            Configurar
          </Button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">Relatórios</h3>
          <p className="text-sm text-gray-600 mb-4">
            Analise tendências de vendas e desempenho de produtos
          </p>
          <Button variant="outline" size="sm">
            Ver Relatórios
          </Button>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  color,
  iconColor,
  trend,
}: {
  title: string;
  value: number | null;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${color} rounded-lg ${iconColor}`}>{icon}</div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      {value === null ? (
        <Skeleton className="h-8 w-16 mb-2" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
      )}
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );
}
