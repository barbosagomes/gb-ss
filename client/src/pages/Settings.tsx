import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Copy, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  const [appKey, setAppKey] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isSandbox, setIsSandbox] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getConfigQuery = trpc.tiktok.getAppConfig.useQuery();
  const saveConfigMutation = trpc.tiktok.saveAppConfig.useMutation();

  const webhookBase = `${window.location.origin}/api/webhooks/tiktok`;
  const webhookInventory = `${webhookBase}/inventory-changed`;
  const webhookOrder = `${webhookBase}/order-status-change`;

  useEffect(() => {
    if (getConfigQuery.data) {
      setAppKey(getConfigQuery.data.appKey || "");
      setRedirectUrl(getConfigQuery.data.redirectUrl || "");
      setIsSandbox(getConfigQuery.data.isSandbox);
      // Secret nunca é retornado — mantemos vazio; placeholder indica se já existe
    }
  }, [getConfigQuery.data]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!appKey.trim()) newErrors.appKey = "App Key é obrigatória";
    if (!appSecret.trim() && !appSecret)
      newErrors.appSecret = "App Secret é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveConfig = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await saveConfigMutation.mutateAsync({
        appKey,
        appSecret,
        redirectUrl,
        isSandbox,
      });
      toast.success("Configurações salvas com sucesso!");
      setAppSecret(""); // limpar após salvar por segurança
      getConfigQuery.refetch();
    } catch (error) {
      toast.error(
        `Erro ao salvar: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const hasExistingConfig = !!getConfigQuery.data?.appKey;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Credenciais e preferências de ambiente do TikTok Shop
        </p>
      </div>

      {/* TikTok Shop Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Credenciais do TikTok Shop</CardTitle>
          <CardDescription>
            Obtidas no{" "}
            <a
              href="https://partner.tiktokshop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              TikTok Shop Partner Center
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* App Key */}
          <div className="space-y-2">
            <Label htmlFor="appKey">
              App Key <span className="text-destructive">*</span>
            </Label>
            <Input
              id="appKey"
              placeholder="Insira sua App Key"
              value={appKey}
              onChange={(e) => {
                setAppKey(e.target.value);
                if (errors.appKey)
                  setErrors((prev) => ({ ...prev, appKey: "" }));
              }}
              className={`font-mono text-sm ${errors.appKey ? "border-destructive" : ""}`}
            />
            {errors.appKey && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.appKey}
              </p>
            )}
          </div>

          {/* App Secret */}
          <div className="space-y-2">
            <Label htmlFor="appSecret">
              App Secret <span className="text-destructive">*</span>
            </Label>
            <Input
              id="appSecret"
              type="password"
              placeholder="Insira sua App Secret"
              value={appSecret}
              onChange={(e) => {
                setAppSecret(e.target.value);
                if (errors.appSecret)
                  setErrors((prev) => ({ ...prev, appSecret: "" }));
              }}
              className={`font-mono text-sm ${errors.appSecret ? "border-destructive" : ""}`}
            />
            {errors.appSecret && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.appSecret}
              </p>
            )}

          </div>

          {/* Redirect URL */}
          <div className="space-y-2">
            <Label htmlFor="redirectUrl">Redirect URL</Label>
            <Input
              id="redirectUrl"
              placeholder={`${window.location.origin}/api/oauth/callback`}
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              URL de callback para autorização OAuth
            </p>
          </div>

          {/* Environment Toggle */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="sandbox" className="text-sm font-medium">
                Ambiente Sandbox
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {isSandbox
                  ? "Usando ambiente de testes"
                  : "Usando produção — cuidado!"}
              </p>
            </div>
            <Switch
              id="sandbox"
              checked={isSandbox}
              onCheckedChange={setIsSandbox}
            />
          </div>

          <Button
            onClick={handleSaveConfig}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>

      {/* OAuth Status — só mostra se já configurado */}
      {hasExistingConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Status da Autorização</CardTitle>
            <CardDescription>
              Status da sua conexão com o TikTok Shop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OAuthStatus />
          </CardContent>
        </Card>
      )}

      {/* Webhook URLs — dinâmicas e com botão copiar */}
      {hasExistingConfig && (
        <Card>
          <CardHeader>
            <CardTitle>URLs de Webhook</CardTitle>
            <CardDescription>
              Configure no TikTok Shop Partner Center
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <WebhookUrl
              label="Inventory Changed (#68)"
              url={webhookInventory}
            />
            <WebhookUrl
              label="Order Status Change (#1)"
              url={webhookOrder}
            />
            <p className="text-xs text-muted-foreground">
              Copie as URLs acima para a seção de webhooks no Partner Center
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function WebhookUrl({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-muted-foreground">{label}</h4>
      <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2">
        <code className="text-xs flex-1 break-all font-mono">{url}</code>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 shrink-0"
          onClick={handleCopy}
          aria-label="Copiar URL"
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

function OAuthStatus() {
  const tokenStatusQuery = trpc.tiktok.getTokenStatus.useQuery();

  if (tokenStatusQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Verificando status...
      </div>
    );
  }

  if (!tokenStatusQuery.data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Aplicação não autorizada ainda.
        </p>
        <AuthorizeButton />
      </div>
    );
  }

  const { connected, sellerId, shopName, isExpired, expiresAt } =
    tokenStatusQuery.data;

  if (!connected) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">
          Não conectado. Autorize para continuar.
        </p>
        <AuthorizeButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 rounded-md">
        <p className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Conectado com sucesso
        </p>
      </div>
      <div className="space-y-2 text-sm">
        {sellerId && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              ID do Vendedor
            </span>
            <span className="font-mono text-xs">{sellerId}</span>
          </div>
        )}
        {shopName && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Nome da Loja</span>
            <span className="text-xs">{shopName}</span>
          </div>
        )}
        {expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Expira em</span>
            <span className="text-xs">
              {new Date(expiresAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
        {isExpired && (
          <p className="text-xs text-destructive">
            Token expirado. Reautorize para continuar.
          </p>
        )}
      </div>
      <AuthorizeButton variant="outline" />
    </div>
  );
}

function AuthorizeButton({
  variant = "default",
}: {
  variant?: "default" | "outline";
}) {
  const getAuthUrlQuery = trpc.tiktok.getAuthorizationUrl.useQuery();

  const handleAuthorize = () => {
    if (getAuthUrlQuery.data?.url) {
      window.location.href = getAuthUrlQuery.data.url;
    }
  };

  return (
    <Button
      onClick={handleAuthorize}
      disabled={getAuthUrlQuery.isLoading}
      variant={variant}
      className="w-full"
    >
      {getAuthUrlQuery.isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {getAuthUrlQuery.isLoading
        ? "Carregando..."
        : "Autorizar com TikTok Shop"}
    </Button>
  );
}
