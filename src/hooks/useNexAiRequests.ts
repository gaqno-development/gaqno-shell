import { useCallback, useEffect, useState } from "react";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";
import { fetchSaasJson } from "@/utils/saas-api";

const PAGE_SIZE = 25;

export interface UsageRequestRow {
  id: string;
  tenantId: string | null;
  userId: string | null;
  taskId: string | null;
  category: string | null;
  nexaiModel: string | null;
  priceInCredits: number | null;
  createdAt: string;
}

function defaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

function defaultTo(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useNexAiRequests() {
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const [tenantId, setTenantId] = useState<string>("");
  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);
  const [category, setCategory] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<{
    items: UsageRequestRow[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("from", from);
      params.set("to", to);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(offset));
      if (tenantId) params.set("tenant_id", tenantId);
      if (category) params.set("category", category);
      const result = await fetchSaasJson<{
        items: UsageRequestRow[];
        total: number;
      }>(`/costs/ai-requests?${params.toString()}`);
      setData(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load requests"
      );
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [tenantId, from, to, category, offset]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const total = data?.total ?? 0;
  const start = offset + 1;
  const end = Math.min(offset + PAGE_SIZE, total);
  const hasNext = offset + PAGE_SIZE < total;
  const hasPrev = offset > 0;

  const setTenantIdAndResetOffset = useCallback((v: string) => {
    setTenantId(v);
    setOffset(0);
  }, []);

  const setFromAndResetOffset = useCallback((v: string) => {
    setFrom(v);
    setOffset(0);
  }, []);

  const setToAndResetOffset = useCallback((v: string) => {
    setTo(v);
    setOffset(0);
  }, []);

  const setCategoryAndResetOffset = useCallback((v: string) => {
    setCategory(v);
    setOffset(0);
  }, []);

  const goPrev = useCallback(
    () => setOffset((o) => Math.max(0, o - PAGE_SIZE)),
    []
  );
  const goNext = useCallback(() => setOffset((o) => o + PAGE_SIZE), []);

  return {
    tenants,
    tenantsLoading,
    tenantId,
    setTenantId: setTenantIdAndResetOffset,
    from,
    setFrom: setFromAndResetOffset,
    to,
    setTo: setToAndResetOffset,
    category,
    setCategory: setCategoryAndResetOffset,
    offset,
    setOffset,
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
    pageSize: PAGE_SIZE,
  };
}
