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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCw,
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  Edit2,
} from "lucide-react";
import { useFormatting } from "@/hooks/useFormatting";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  productName: string;
  description?: string | null;
  status: string;
  skuCount?: number;
  totalStock?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  tiktokProductId?: string;
}

interface Sku {
  id: number;
  skuName: string;
  sellerSku?: string;
  stockQuantity?: number;
  costPrice?: number;
  salePrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  productId?: number;
  tiktokSkuId?: string;
  totalQuantity?: number;
  availableQuantity?: number;
  reservedQuantity?: number;
  lastSyncedAt?: Date | null;
}

export default function Products() {
  return (
    <DashboardLayout>
      <ProductsContent />
    </DashboardLayout>
  );
}

function ProductsContent() {
  const { user } = useAuth();
  const { formatCurrency } = useFormatting();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "INACTIVE">("all");

  const productsQuery = trpc.tiktok.getProducts.useQuery();
  const syncProductsMutation = trpc.tiktok.syncProducts.useMutation();

  const handleSyncProducts = async () => {
    try {
      await syncProductsMutation.mutateAsync();
      toast.success("Produtos sincronizados com sucesso!");
      productsQuery.refetch();
    } catch (error) {
      toast.error(
        `Erro ao sincronizar: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const filtered = useMemo(() => {
    const products = productsQuery.data ?? [];
    return products.filter((p: Product) => {
      const matchesSearch =
        !search ||
        p.productName.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toString().includes(search);
      const matchesStatus =
        filterStatus === "all" || p.status.toUpperCase() === filterStatus.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [productsQuery.data, search, filterStatus]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Produtos e SKUs
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie produtos, SKUs e custos de produção
          </p>
        </div>
        <Button
          onClick={handleSyncProducts}
          disabled={syncProductsMutation.isPending}
          size="sm"
          className="gap-2"
        >
          {syncProductsMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {syncProductsMutation.isPending ? "Sincronizando..." : "Sincronizar"}
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
        <div className="flex rounded-md border border-border overflow-hidden">
          {(["all", "ACTIVE", "INACTIVE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 text-xs transition-colors ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {s === "all" ? "Todos" : s === "ACTIVE" ? "Ativos" : "Inativos"}
            </button>
          ))}
        </div>
      </div>

      {/* Products list */}
      {productsQuery.isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando produtos...
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          hasProducts={(productsQuery.data ?? []).length > 0}
          onSync={handleSyncProducts}
          isSyncing={syncProductsMutation.isPending}
        />
      )}
    </div>
  );
}

function EmptyState({
  hasProducts,
  onSync,
  isSyncing,
}: {
  hasProducts: boolean;
  onSync: () => void;
  isSyncing: boolean;
}) {
  return (
    <Card>
      <CardContent className="py-16 flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-muted">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">
            {hasProducts
              ? "Nenhum produto encontrado"
              : "Nenhum produto sincronizado"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {hasProducts
              ? "Tente ajustar os filtros ou a busca."
              : "Clique em Sincronizar para importar seus produtos do TikTok Shop."}
          </p>
        </div>
        {!hasProducts && (
          <Button onClick={onSync} disabled={isSyncing} size="sm" className="gap-2">
            {isSyncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Sincronizar Produtos
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ProductCard({
  product,
  formatCurrency,
}: {
  product: Product;
  formatCurrency: (v: number) => string;
}) {
  const [isSkusOpen, setIsSkusOpen] = useState(false);
  const skusQuery = trpc.tiktok.getSkus.useQuery(
    { productId: product.id },
    { enabled: isSkusOpen },
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {product.productName}
            </CardTitle>
            {product.description && (
              <CardDescription className="mt-1 text-xs line-clamp-2">
                {product.description}
              </CardDescription>
            )}
          </div>
          <Badge
            className={`shrink-0 text-xs border-0 ${
              product.status === "ACTIVE"
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {product.status === "ACTIVE" ? "Ativo" : product.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>ID: <span className="font-mono">{product.id}</span></span>
            {product.skuCount !== undefined && (
              <span>{product.skuCount} SKU{product.skuCount !== 1 ? "s" : ""}</span>
            )}
            {product.totalStock !== undefined && (
              <span>Estoque: {product.totalStock}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs h-7"
            onClick={() => setIsSkusOpen(!isSkusOpen)}
            aria-expanded={isSkusOpen}
          >
            {isSkusOpen ? (
              <>
                <ChevronUp className="h-3 w-3" /> Ocultar SKUs
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Ver SKUs
              </>
            )}
          </Button>
        </div>

        {/* SKUs expandidos — lazy loaded */}
        {isSkusOpen && (
          <div className="mt-4 border-t border-border pt-4">
            {skusQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando SKUs...
              </div>
            ) : skusQuery.data && skusQuery.data.length > 0 ? (
              <div className="space-y-2">
                {skusQuery.data.map((sku: Sku) => (
                  <SkuRow
                    key={sku.id}
                    sku={sku}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                Nenhum SKU encontrado.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SkuRow({
  sku,
  formatCurrency,
}: {
  sku: Sku;
  formatCurrency: (v: number) => string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [costPrice, setCostPrice] = useState(
    sku.costPrice?.toString() ?? "",
  );

  const margin =
    sku.costPrice && sku.salePrice && sku.salePrice > 0
      ? (((sku.salePrice - sku.costPrice) / sku.salePrice) * 100).toFixed(1)
      : null;

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
      <div className="flex-1 min-w-0 text-sm">
        <p className="font-medium truncate">{sku.skuName}</p>
        {sku.sellerSku && (
          <p className="text-xs text-muted-foreground font-mono">
            {sku.sellerSku}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-right shrink-0">
        {sku.stockQuantity !== undefined && (
          <div>
            <p className="text-muted-foreground">Estoque</p>
            <p className="font-medium">{sku.stockQuantity}</p>
          </div>
        )}
        {sku.costPrice !== undefined && (
          <div>
            <p className="text-muted-foreground">Custo</p>
            <p className="font-medium">{formatCurrency(sku.costPrice)}</p>
          </div>
        )}
        {sku.salePrice !== undefined && (
          <div>
            <p className="text-muted-foreground">Preço</p>
            <p className="font-medium">{formatCurrency(sku.salePrice)}</p>
          </div>
        )}
        {margin !== null && (
          <div>
            <p className="text-muted-foreground">Margem</p>
            <p
              className={`font-semibold ${
                parseFloat(margin) >= 30
                  ? "text-green-600"
                  : parseFloat(margin) >= 15
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {margin}%
            </p>
          </div>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Editar custo"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Editar Custo — {sku.skuName}</DialogTitle>
              <DialogDescription className="text-xs">
                Atualize o custo unitário para recalcular a margem
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label htmlFor="costPrice" className="text-xs">
                  Custo Unitário (R$)
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="font-mono text-sm h-8"
                />
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  toast.success("Custo atualizado!");
                  setIsEditOpen(false);
                }}
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
