import React, { useState, useMemo } from "react";
import { CostingView } from "@gaqno-development/frontcore/components/admin";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { Skeleton } from "@gaqno-development/frontcore/components/ui";
import { DollarSign } from "lucide-react";

export default function CostingPage() {
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const [tenantId, setTenantId] = useState<string>("");

  const tenantList = useMemo(() => tenants ?? [], [tenants]);

  if (tenantsLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Custos, recargas e consumo
        </h1>
        <p className="text-muted-foreground mt-1">
          Estatísticas, gráficos e visão por tenant
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant</CardTitle>
          <CardDescription>
            Selecione o tenant para ver custos, recargas e consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={tenantId} onValueChange={setTenantId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione um tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenantList.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <CostingView tenantId={tenantId || undefined} />
    </div>
  );
}
