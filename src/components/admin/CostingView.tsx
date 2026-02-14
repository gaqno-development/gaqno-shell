import React from "react";
import { useAuth } from "@gaqno-development/frontcore/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { DollarSign } from "lucide-react";
import { TenantCostsSummary } from "./TenantCostsSummary";

interface CostingViewProps {
  tenantId?: string;
}

export function CostingView({ tenantId: tenantIdProp }: CostingViewProps) {
  const { user } = useAuth();
  const tenantId = tenantIdProp ?? user?.tenantId ?? "";

  if (!tenantId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Custos
          </CardTitle>
          <CardDescription>
            Associe-se a um tenant para ver custos.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    );
  }

  return <TenantCostsSummary tenantId={tenantId} />;
}
