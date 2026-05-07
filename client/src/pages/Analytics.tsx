import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormatting } from "@/hooks/useFormatting";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export default function Analytics() {
  return (
    <DashboardLayout>
      <AnalyticsContent />
    </DashboardLayout>
  );
}

type Period = "7d" | "30d" | "90d";

function AnalyticsContent() {
  const { user } = useAuth();
  const { formatCurrency } = useFormatting();
  const [period, setPeriod] = useState<Period>("7d");

  if (!user) return null;

  // Dados estáticos de demonstração (sem Math.random)
  const dailyMetrics = [
    { date: "30/04", custo: 1200, receita: 3500, lucro: 2300 },
    { date: "01/05", custo: 1350, receita: 3800, lucro: 2450 },
    { date: "02/05", custo: 1100, receita: 3200, lucro: 2100 },
    { date: "03/05", custo: 1400, receita: 4100, lucro: 2700 },
    { date: "04/05", custo: 1250, receita: 3600, lucro: 2350 },
    { date: "05/05", custo: 1500, receita: 4300, lucro: 2800 },
    { date: "06/05", custo: 1320, receita: 3950, lucro: 2630 },
  ];

  // Dados fixos para tabela (sem Math.random!)
  const productProfitability = [
    {
      name: "Produto A",
      margem: 45,
      lucro: 1200,
      custo: 55,
      preco: 100,
    },
    {
      name: "Produto B",
      margem: 38,
      lucro: 950,
      custo: 62,
      preco: 100,
    },
    {
      name: "Produto C",
      margem: 52,
      lucro: 1500,
      custo: 48,
      preco: 100,
    },
    {
      name: "Produto D",
      margem: 35,
      lucro: 800,
      custo: 65,
      preco: 100,
    },
  ];

  const chartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const kpis = [
    {
      title: "Lucro Hoje",
      value: formatCurrency(2800),
      trend: +12,
      description: "Estimado",
    },
    {
      title: "Custo Hoje",
      value: formatCurrency(1500),
      trend: +5,
      description: "Total",
    },
    {
      title: "Margem Média",
      value: "42%",
      trend: +3,
      description: "Todos os produtos",
    },
    {
      title: "Receita Hoje",
      value: formatCurrency(4300),
      trend: +8,
      description: "Estimada",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Análise Financeira
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Lucratividade e tendências dos seus produtos
          </p>
        </div>

        {/* Period selector */}
        <div className="flex rounded-md border border-border overflow-hidden">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "90 dias"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Lucro vs Custo Diário
            </CardTitle>
            <CardDescription className="text-xs">Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    fontSize: 12,
                    border: "0.5px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke="#10b981"
                  name="Lucro"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="custo"
                  stroke="#ef4444"
                  name="Custo"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Diária</CardTitle>
            <CardDescription className="text-xs">Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    fontSize: 12,
                    border: "0.5px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="receita" fill="#3b82f6" name="Receita" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Margem por Produto
            </CardTitle>
            <CardDescription className="text-xs">Top 4 produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={productProfitability} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    fontSize: 12,
                    border: "0.5px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="margem" fill="#f59e0b" name="Margem %" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Distribuição de Lucro
            </CardTitle>
            <CardDescription className="text-xs">Por produto</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={productProfitability}
                  dataKey="lucro"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={true}
                >
                  {productProfitability.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    fontSize: 12,
                    border: "0.5px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Products Table — sem Math.random! */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Produtos por Lucratividade
          </CardTitle>
          <CardDescription className="text-xs">
            Ordenados por margem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Produto
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Custo Unit.
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Preço
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Margem
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Lucro Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {productProfitability.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/50 hover:bg-muted/50 even:bg-muted/20"
                  >
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">
                      {formatCurrency(product.custo)}
                    </td>
                    <td className="text-right py-3 px-4 text-muted-foreground">
                      {formatCurrency(product.preco)}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span
                        className={`font-semibold ${
                          product.margem >= 40
                            ? "text-green-600"
                            : product.margem >= 25
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {product.margem}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      {formatCurrency(product.lucro)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({
  title,
  value,
  description,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  trend: number;
}) {
  const isPositive = trend >= 0;

  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-semibold text-foreground mt-2">{value}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          <span
            className={`text-xs font-medium flex items-center gap-0.5 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {trend}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
