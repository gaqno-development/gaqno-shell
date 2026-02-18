import type { ColumnDef } from "@gaqno-development/frontcore/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useNexAiRequests, type UsageRequestRow } from "../../hooks/useNexAiRequests";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function NexAiRequestsPage() {
  const {
    tenants,
    tenantsLoading,
    tenantId,
    setTenantId,
    from,
    setFrom,
    to,
    setTo,
    category,
    setCategory,
    data,
    loading,
    error,
    fetchRequests,
    total,
    start,
    end,
    hasNext,
    hasPrev,
    goPrev,
    goNext,
  } = useNexAiRequests();

  const columns: ColumnDef<UsageRequestRow, unknown>[] = [
    {
      id: "createdAt",
      header: "Data",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "tenantId",
      header: "Tenant",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs">
          {row.original.tenantId ?? "—"}
        </span>
      ),
    },
    {
      id: "category",
      header: "Categoria",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category ?? "—"}</span>
      ),
    },
    {
      id: "nexaiModel",
      header: "Modelo",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs truncate max-w-[200px] block">
          {row.original.nexaiModel ?? "—"}
        </span>
      ),
    },
    {
      id: "taskId",
      header: "Task ID",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs truncate max-w-[140px] block">
          {row.original.taskId ?? "—"}
        </span>
      ),
    },
    {
      id: "priceInCredits",
      header: "Créditos",
      meta: { align: "right" as const },
      cell: ({ row }) => (
        <span className="text-right">{row.original.priceInCredits ?? 0}</span>
      ),
    },
    {
      id: "userId",
      header: "Usuário",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs">
          {row.original.userId ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8" />
          Requisições NEX AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Todas as requisições ao gateway NEX AI por tenant e período
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Tenant, período e categoria. Deixe tenant em branco para ver todos.
          </CardDescription>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Tenant</label>
              <Select
                value={tenantId || "all"}
                onValueChange={(v) => setTenantId(v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tenants</SelectItem>
                  {(tenants ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">De</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 h-9 text-sm bg-background"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Até</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 h-9 text-sm bg-background"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Categoria</label>
              <Select
                value={category || "all"}
                onValueChange={(v) => setCategory(v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={fetchRequests}>
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tenantsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : loading && !data ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <>
              <DataTable<UsageRequestRow, unknown>
                columns={columns}
                data={data?.items ?? []}
                getRowId={(row) => row.id}
                enableSorting={false}
                enableFiltering={false}
                enableVisibility={false}
                showPagination={false}
                emptyMessage="Nenhuma requisição no período."
              />
              {total > 0 && (
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>
                    {start}–{end} de {total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasPrev}
                      onClick={goPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasNext}
                      onClick={goNext}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
