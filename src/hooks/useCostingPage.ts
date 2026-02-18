import { useMemo, useState } from "react";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";

export function useCostingPage() {
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const [tenantId, setTenantId] = useState<string>("");

  const tenantList = useMemo(() => tenants ?? [], [tenants]);

  return {
    tenantsLoading,
    tenantId,
    setTenantId,
    tenantList,
  };
}
