import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useFormatting } from "@/hooks/useFormatting";
import { useState } from "react";

export default function Alerts() {
  return (
    <DashboardLayout>
      <AlertsContent />
    </DashboardLayout>
  );
}

type AlertType = "error" | "warning" | "info" | "success";
type FilterType = "all" | "unread" | AlertType;

interface Alert {
  id: number;
  type: AlertType;
  title: string;
  description: string;
  timestamp: Date;
  severity: string;
  read: boolean;
  action: string;
}

function AlertsContent() {
  const { user } = useAuth();
  const { formatDate } = useFormatting();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "error",
      title: "Erro na Sincronização de Estoque",
      description:
        "SKU003 não foi encontrado no banco de dados. Verifique a configuração.",
      timestamp: new Date(Date.now() - 30 * 60000),
      severity: "high",
      read: false,
      action: "Revisar",
    },
    {
      id: 2,
      type: "warning",
      title: "Margem de Lucro Baixa",
      description:
        "Produto B tem margem de lucro de apenas 15%. Considere revisar o preço.",
      timestamp: new Date(Date.now() - 1 * 60 * 60000),
      severity: "medium",
      read: false,
      action: "Editar Preço",
    },
    {
      id: 3,
      type: "info",
      title: "Sincronização Completada",
      description: "Todos os 45 produtos foram sincronizados com sucesso.",
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      severity: "low",
      read: true,
      action: "Ver Detalhes",
    },
    {
      id: 4,
      type: "warning",
      title: "Estoque Baixo",
      description:
        "Produto A - Tamanho M tem apenas 5 unidades em estoque.",
      timestamp: new Date(Date.now() - 3 * 60 * 60000),
      severity: "medium",
      read: true,
      action: "Repor",
    },
    {
      id: 5,
      type: "error",
      title: "Falha na Conexão com TikTok Shop",
      description:
        "Não foi possível conectar à API. Verifique suas credenciais.",
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      severity: "high",
      read: true,
      action: "Configurar",
    },
  ]);

  const [notifSettings, setNotifSettings] = useState({
    syncErrors: true,
    lowMargin: true,
    lowStock: true,
    dailySummary: true,
  });

  const unreadCount = alerts.filter((a) => !a.read).length;
  const errorCount = alerts.filter((a) => a.type === "error").length;
  const warningCount = alerts.filter((a) => a.type === "warning").length;

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !a.read;
    return a.type === activeFilter;
  });

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const deleteAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getAlertBadge = (type: AlertType) => {
    const map = {
      error: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      success:
        "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    };
    const labels = {
      error: "Erro",
      warning: "Aviso",
      info: "Informação",
      success: "Sucesso",
    };
    return (
      <Badge className={`${map[type]} border-0 text-xs`}>{labels[type]}</Badge>
    );
  };

  const getBorderColor = (type: AlertType) => {
    switch (type) {
      case "error":
        return "border-l-red-500";
      case "warning":
        return "border-l-yellow-500";
      case "info":
        return "border-l-blue-500";
      case "success":
        return "border-l-green-500";
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Alertas e Notificações
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie alertas da sua integração
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          Marcar todos como lido
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Não lidos</p>
              <p className="text-2xl font-semibold mt-1">{unreadCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção
              </p>
            </div>
            <AlertCircle className="h-5 w-5 text-blue-500 opacity-60" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Erros</p>
              <p className="text-2xl font-semibold mt-1">{errorCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Críticos</p>
            </div>
            <AlertCircle className="h-5 w-5 text-red-500 opacity-60" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avisos</p>
              <p className="text-2xl font-semibold mt-1">{warningCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Recomendações
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-yellow-500 opacity-60" />
          </div>
        </div>
      </div>

      {/* Filters — com estado ativo */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: `Todos (${alerts.length})` },
            { key: "unread", label: `Não lidos (${unreadCount})` },
            { key: "error", label: `Erros (${errorCount})` },
            { key: "warning", label: `Avisos (${warningCount})` },
          ] as { key: FilterType; label: string }[]
        ).map(({ key, label }) => (
          <Button
            key={key}
            variant={activeFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Nenhum alerta encontrado
          </div>
        )}
        {filteredAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-opacity ${alert.read ? "opacity-60" : `border-l-4 ${getBorderColor(alert.type)}`}`}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium text-sm text-foreground">
                        {alert.title}
                      </h3>
                      {getAlertBadge(alert.type)}
                      {!alert.read && (
                        <div
                          className="w-1.5 h-1.5 bg-primary rounded-full"
                          aria-label="Não lido"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {formatDate(alert.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    {alert.action}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteAlert(alert.id)}
                    aria-label="Remover alerta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Settings — usando Switch do shadcn */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Configurações de Notificações
          </CardTitle>
          <CardDescription className="text-xs">
            Personalize como você recebe alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              {
                key: "syncErrors" as const,
                label: "Erros de Sincronização",
                desc: "Alertas quando houver erros na sincronização",
              },
              {
                key: "lowMargin" as const,
                label: "Margem de Lucro Baixa",
                desc: "Alertas quando margem estiver abaixo de 20%",
              },
              {
                key: "lowStock" as const,
                label: "Estoque Baixo",
                desc: "Alertas quando estoque estiver abaixo de 10 unidades",
              },
              {
                key: "dailySummary" as const,
                label: "Resumo Diário",
                desc: "Resumo diário de todas as atividades",
              },
            ] as {
              key: keyof typeof notifSettings;
              label: string;
              desc: string;
            }[]
          ).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <Label
                  htmlFor={`notif-${key}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Switch
                id={`notif-${key}`}
                checked={notifSettings[key]}
                onCheckedChange={(checked) =>
                  setNotifSettings((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
