import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTenantCosts } from "@gaqno-development/frontcore/hooks/admin/useTenantCosts";
import type { ITenantCosts } from "@gaqno-development/frontcore/types/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  DataTableColumnHeader,
  Button,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { RefreshCw, DollarSign } from "lucide-react";

const columns: ColumnDef<ITenantCosts>[] = [
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
  },
  {
    accessorKey: "serviceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.category}</span>
    ),
  },
  {
    accessorKey: "costAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const cost = row.original;
      return (
        <span className="text-right tabular-nums">
          {cost.currency}{" "}
          {cost.costAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
];

interface TenantCostsSummaryProps {
  tenantId: string;
}

export function TenantCostsSummary({ tenantId }: TenantCostsSummaryProps) {
  const { costs, summary, isLoading, syncCosts } = useTenantCosts(tenantId);

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Summary
            </CardTitle>
            <CardDescription>Detailed breakdown of tenant costs</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => syncCosts()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {summary && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Monthly Cost
                </div>
                <div className="text-2xl font-bold">
                  {summary.currency}{" "}
                  {summary.totalMonthlyCost.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Active Costs
                </div>
                <div className="text-2xl font-bold">
                  {summary.activeCostsCount}
                </div>
              </div>
            </div>

            {costs.length > 0 ? (
              <div>
                <div className="text-sm font-medium mb-2">Cost Details</div>
                <DataTable
                  columns={columns}
                  data={costs}
                  getRowId={(row) => row.id}
                  showPagination={false}
                />
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No costs found for this tenant
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
