import { useState, useEffect } from "react";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";
import { fetchSaasJson } from "@/utils/saas-api";

export interface AIModelsRegistry {
  image?: {
    providers: {
      id: string;
      name: string;
      models: { id: string; name: string }[];
    }[];
  };
  video?: {
    providers: {
      id: string;
      name: string;
      models: { id: string; name: string }[];
    }[];
  };
  audio?: {
    providers: {
      id: string;
      name: string;
      models: { id: string; name: string }[];
    }[];
  };
}

export interface AIModelsDefaults {
  image?: string;
  video?: string;
  audio?: string;
}

export interface AIModelsUsage {
  byCategory: Record<string, number>;
  byModel: Record<string, number>;
  totalCredits: number;
}

export function useAIModels() {
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const [tenantId, setTenantId] = useState<string>("");
  const [registry, setRegistry] = useState<AIModelsRegistry | null>(null);
  const [defaults, setDefaults] = useState<AIModelsDefaults | null>(null);
  const [usage, setUsage] = useState<AIModelsUsage | null>(null);
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingRegistry(true);
    fetchSaasJson<AIModelsRegistry>("/ai-models", {
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => {
        if (!cancelled) setRegistry(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setRegistry(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingRegistry(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!tenantId) {
      setDefaults(null);
      setUsage(null);
      return;
    }
    let cancelled = false;
    setLoadingDefaults(true);
    setLoadingUsage(true);
    fetchSaasJson<AIModelsDefaults>(
      `/ai-models/${encodeURIComponent(String(tenantId ?? ""))}/defaults`,
      { headers: { "Content-Type": "application/json" } }
    )
      .then((data) => {
        if (!cancelled) setDefaults(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setDefaults(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingDefaults(false);
      });
    fetchSaasJson<AIModelsUsage>(
      `/costs/ai-usage?tenant_id=${encodeURIComponent(String(tenantId ?? ""))}`,
      { headers: { "Content-Type": "application/json" } }
    )
      .then((data) => {
        if (!cancelled) setUsage(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setUsage(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingUsage(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const tenantList = tenants ?? [];

  return {
    tenantsLoading,
    tenantId,
    setTenantId,
    registry,
    defaults,
    usage,
    loadingRegistry,
    loadingDefaults,
    loadingUsage,
    tenantList,
  };
}
