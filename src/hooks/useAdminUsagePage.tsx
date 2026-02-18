import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@gaqno-development/frontcore/hooks";
import { useTenantUsage } from "@gaqno-development/frontcore/hooks/admin/useTenantUsage";
import { useUsers } from "@gaqno-development/frontcore/hooks/admin/useUsers";
import { DataTableColumnHeader } from "@gaqno-development/frontcore/components/ui";

function getMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const name = d.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    options.push({ value: `${y}-${m}`, label: name });
  }
  return options;
}

function defaultPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function userDisplayName(u: {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return name || u.email || u.id;
}

export function useAdminUsagePage() {
  const { user } = useAuth();
  const tenantId = user?.tenantId ?? "";
  const [period, setPeriod] = useState(defaultPeriod());
  const {
    usage,
    isLoading,
    period: effectivePeriod,
  } = useTenantUsage(tenantId, period);
  const { users } = useUsers(undefined, undefined);

  const monthOptions = useMemo(() => getMonthOptions(), []);

  const userDisplayMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const u of users) {
      map[u.id] = userDisplayName(u);
    }
    return map;
  }, [users]);

  const { rows, metricColumns } = useMemo(() => {
    if (!usage?.metrics?.length)
      return {
        rows: [] as Record<string, number | string>[],
        metricColumns: [] as {
          key: string;
          serviceName: string;
          unit: string;
        }[],
      };
    const columns = usage.metrics
      .filter((m) => m.byUser != null)
      .map((m) => ({
        key: `${m.serviceName}-${m.metricKey}`,
        serviceName: m.serviceName,
        unit: m.unit,
      }));
    const userIdSet = new Set<string>();
    for (const m of usage.metrics) {
      if (m.byUser) {
        Object.keys(m.byUser).forEach((id) => userIdSet.add(id));
      }
    }
    const userIds = Array.from(userIdSet).sort();
    const rows = userIds.map((userId) => {
      const record: Record<string, number | string> = { userId };
      for (const m of usage.metrics) {
        if (m.byUser && m.byUser[userId] != null) {
          record[`${m.serviceName}-${m.metricKey}`] = m.byUser[userId];
        }
      }
      return record;
    });
    return { rows, metricColumns: columns };
  }, [usage]);

  const usageColumns = useMemo<ColumnDef<Record<string, number | string>>[]>(
    () => [
      {
        id: "userId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Usuário" />
        ),
        cell: ({ row }) => {
          const uid = row.original.userId as string;
          return (
            <span className="font-medium">
              {row.original.userId === user?.id ? (
                <span>Você ({user?.email ?? uid})</span>
              ) : (
                (userDisplayMap[uid] ?? String(uid))
              )}
            </span>
          );
        },
      },
      ...metricColumns.map((col) => ({
        id: col.key,
        header: () => (
          <span>
            {col.serviceName === "ai" ? "IA (tokens)" : col.serviceName} (
            {col.unit})
          </span>
        ),
        cell: ({
          row,
        }: {
          row: { original: Record<string, number | string> };
        }) =>
          typeof row.original[col.key] === "number"
            ? Number(row.original[col.key]).toLocaleString("pt-BR")
            : "—",
      })),
    ],
    [metricColumns, user, userDisplayMap]
  );

  return {
    tenantId,
    period: effectivePeriod,
    setPeriod,
    monthOptions,
    usage,
    isLoading,
    rows,
    usageColumns,
    user,
  };
}
