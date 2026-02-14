import React from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { useDomains } from "@gaqno-development/frontcore/hooks/admin/useDomains";
import type { IDomain } from "@gaqno-development/frontcore/types/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  DataTableColumnHeader,
  Badge,
  Button,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { Globe, Plus, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DomainsListProps {
  tenantId?: string;
}

function getStatusBadge(domain: IDomain) {
  if (!domain.isActive) {
    return <Badge variant="secondary">Inactive</Badge>;
  }
  if (domain.isVerified) {
    return (
      <Badge variant="default" className="bg-green-500">
        Verified
      </Badge>
    );
  }
  return <Badge variant="outline">Unverified</Badge>;
}

function getSslBadge(status?: string) {
  switch (status) {
    case "valid":
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Valid
        </Badge>
      );
    case "expiring":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expiring
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">None</Badge>;
  }
}

export function DomainsList({ tenantId }: DomainsListProps) {
  const navigate = useNavigate();
  const { domains, isLoading, checkSsl } = useDomains(tenantId);

  const columns: ColumnDef<IDomain>[] = [
    {
      accessorKey: "domain",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Domain" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.domain}</span>
      ),
    },
    {
      accessorKey: "isVerified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => getStatusBadge(row.original),
    },
    {
      accessorKey: "sslCertificateStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SSL Status" />
      ),
      cell: ({ row }) =>
        getSslBadge(row.original.sslCertificateStatus ?? undefined),
    },
    {
      accessorKey: "sslLastCheckedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Checked" />
      ),
      cell: ({ row }) =>
        row.original.sslLastCheckedAt
          ? new Date(row.original.sslLastCheckedAt).toLocaleDateString()
          : "Never",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => checkSsl(row.original.id)}
          >
            <Shield className="h-4 w-4 mr-1" />
            Check SSL
          </Button>
        </div>
      ),
    },
  ];

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
              <Globe className="h-5 w-5" />
              Domains
            </CardTitle>
            <CardDescription>
              Manage tenant domains and SSL certificates
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/admin/domains/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {domains.length > 0 ? (
          <DataTable
            columns={columns}
            data={domains}
            getRowId={(row) => row.id}
            emptyMessage="No domains found. Add your first domain to get started."
          />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No domains found. Add your first domain to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
