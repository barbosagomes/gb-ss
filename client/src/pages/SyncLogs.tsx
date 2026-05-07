import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormatting } from "@/hooks/useFormatting";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";

export default function SyncLogs() {
  return (
    <DashboardLayout>
      <SyncLogsContent />
    </DashboardLayout>
  );
}

interface SyncLog {
  id: number;
  timestamp: Date;
  type: string;
  status: "success" | "error" | "pending";
  skuId: string;
  skuName: string;
  previousQuantity: number;
  newQuantity: number;
  delta: number;
  source: string;
  message: string;
}

const PAGE_SIZE = 5;

function SyncLogsContent() {
  const { user } = useAuth();
  const { formatDate } = useFormatting();

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("24h");
  const [page, setPage] = useState(1);

  const allLogs: SyncLog[] = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 5 * 60000),
      type: "inventory_sync",
      status: "success",
      skuId: "SKU001",
      skuName: "Produto A - Tamanho M",
      previousQuantity: 100,
      newQuantity: 95,
      delta: -5,
      source: "tiktok_webhook",
      message: "Estoque sincronizado com sucesso",
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 15 * 60000),
      type: "inventory_sync",
      status: "success",
      skuId: "SKU002",
      skuName: "Produto B - Tamanho G",
      previousQuantity: 50,
      newQuantity: 48,
      delta: -2,
      source: "manual_update",
      message: "Estoque atualizado manualmente",
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 30 * 60000),
      type: "order_sync",
      status: "success",
      skuId: "SKU001",
      skuName: "Produto A - Tamanho M",
      previousQuantity: 105,
      newQuantity: 100,
      delta: -5,
      source: "order_placed",
      message: "Pedido recebido — estoque reservado",
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 45 * 60000),
      type: "inventory_sync",
      status: "error",
      skuId: "SKU003",
      skuName: "Produto C - Tamanho P",
      previousQuantity: 0,
      newQuantity: 0,
      delta: 0,
      source: "tiktok_webhook",
      message: "Erro: SKU não encontrado no banco de dados",
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 60 * 60000),
      type: "inventory_sync",
      status: "success",
      skuId: "SKU004",
      skuName: "Produto D - Tamanho G",
      previousQuantity: 200,
      newQuantity: 195,
      delta: -5,
      source: "tiktok_webhook",
      message: "Estoque sincronizado com sucesso",
    },
  ];

  const filtered = useMemo(() => {
    return allLogs.filter((log) => {
      if (filterType !== "all" && log.type !== filterType) return false;
      if (filterStatus !== "all" && log.status !== filterStatus) return false;
      if (filterSource !== "all" && log.source !== filterSource) return false;
      return true;
    });
  }, [filterType, filterStatus, filterSource]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusIcon = (status: SyncLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: SyncLog["status"]) => {
    const map = {
      success:
        "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      error: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
    };
    const labels = {
      success: "Sucesso",
      error: "Erro",
      pending: "Pendente",
    };
    return (
      <Badge className={`${map[status]} border-0 text-xs`}>
        {labels[status]}
      </Badge>
    );
  };

  const getSourceLabel = (source: string) => {
    const sources: Record<string, string> = {
      tiktok_webhook: "TikTok Webhook",
      manual_update: "Manual",
      order_placed: "Pedido",
      api_call: "API",
    };
    return sources[source] || source;
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Histórico de Sincronização
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Eventos de sincronização de estoque
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de Eventos", value: "1.245", sub: "Últimos 30 dias" },
          {
            label: "Taxa de Sucesso",
            value: "98,5%",
            sub: "Sincronizações OK",
          },
          { label: "Erros", value: "18", sub: "Requerem atenção" },
          { label: "Última Sync", value: "5 min", sub: "Atrás" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters — usando shadcn Select */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Tipo
              </label>
              <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="inventory_sync">Estoque</SelectItem>
                  <SelectItem value="order_sync">Pedidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Origem
              </label>
              <Select value={filterSource} onValueChange={(v) => { setFilterSource(v); setPage(1); }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="tiktok_webhook">TikTok Webhook</SelectItem>
                  <SelectItem value="manual_update">Manual</SelectItem>
                  <SelectItem value="order_placed">Pedido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Período
              </label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Eventos de Sincronização
          </CardTitle>
          <CardDescription className="text-xs">
            {filtered.length} evento{filtered.length !== 1 ? "s" : ""}{" "}
            encontrado{filtered.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: 700 }}>
              <thead className="border-b border-border">
                <tr>
                  {[
                    "Status",
                    "Data/Hora",
                    "SKU",
                    "Produto",
                    "Anterior",
                    "Novo",
                    "Delta",
                    "Origem",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`border-b border-border/40 hover:bg-muted/50 transition-colors ${
                      idx % 2 === 0 ? "" : "bg-muted/20"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs">
                      {log.skuId}
                    </td>
                    <td className="py-2.5 px-3 text-xs max-w-[180px] truncate">
                      {log.skuName}
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs">
                      {log.previousQuantity}
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs font-semibold">
                      {log.newQuantity}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-xs font-semibold ${
                          log.delta < 0
                            ? "text-red-600"
                            : log.delta > 0
                              ? "text-green-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {log.delta > 0 ? "+" : ""}
                        {log.delta}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {getSourceLabel(log.source)}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-sm text-muted-foreground"
                    >
                      Nenhum evento encontrado com os filtros selecionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação funcional */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}{" "}
              evento{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
