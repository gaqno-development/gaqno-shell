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
import { PieChart } from "lucide-react";
import { useAdminUsagePage } from "../../hooks/useAdminUsagePage";

export default function AdminUsagePage() {
  const {
    tenantId,
    period,
    setPeriod,
    monthOptions,
    isLoading,
    rows,
    usageColumns,
  } = useAdminUsagePage();

  if (!tenantId) {
    return (
      <div className="container mx-auto py-6 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PieChart className="h-8 w-8" />
            Uso por usuário
          </h1>
          <p className="text-muted-foreground mt-1">
            Consumo e métricas por usuário (administração)
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Consumo por usuário</CardTitle>
            <CardDescription>
              Seu usuário não está associado a um tenant. Entre em contato com o
              administrador para visualizar o consumo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PieChart className="h-8 w-8" />
          Uso por usuário
        </h1>
        <p className="text-muted-foreground mt-1">
          Consumo e métricas atribuídas por usuário no tenant
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Consumo por usuário</CardTitle>
              <CardDescription>
                Uso por serviço (IA, Omnichannel, etc.) no período selecionado
              </CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">
              Nenhum uso registrado neste período. O consumo de IA (tokens) e
              outras ações é atribuído ao usuário ao usar os apps.
            </p>
          ) : (
            <DataTable
              columns={usageColumns}
              data={rows}
              getRowId={(row) => String(row.userId)}
              showPagination={true}
              emptyMessage="Nenhum uso registrado neste período."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
