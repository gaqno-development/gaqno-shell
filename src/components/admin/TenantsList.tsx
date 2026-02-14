import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";
import type { ITenant } from "@gaqno-development/frontcore/types/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  DataTableColumnHeader,
  Badge,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { Building2 } from "lucide-react";

function getStatusBadge(status: ITenant["status"]) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      );
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "trial":
      return <Badge variant="outline">Trial</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

const columns: ColumnDef<ITenant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "domain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Domain" />
    ),
    cell: ({ row }) => row.original.domain ?? "—",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    accessorKey: "user_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => {
      const t = row.original;
      return `${t.user_count ?? 0} / ${t.max_users ?? "—"}`;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleDateString("pt-BR")
        : "—",
  },
];

export function TenantsList() {
  const { tenants, isLoading } = useTenants();
  const list = tenants ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenants
          </CardTitle>
          <CardDescription>
            Organizations and tenants in the platform
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {list.length > 0 ? (
          <DataTable
            columns={columns}
            data={list}
            getRowId={(row) => row.id}
            emptyMessage="No tenants found."
          />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No tenants found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
