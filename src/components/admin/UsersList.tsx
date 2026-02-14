import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useUsers } from "@gaqno-development/frontcore/hooks/admin/useUsers";
import type { IUserListItem } from "@gaqno-development/frontcore/hooks/admin/useUsers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  DataTableColumnHeader,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { Users } from "lucide-react";

function userDisplayName(u: IUserListItem): string {
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return name || u.email || u.id;
}

const columns: ColumnDef<IUserListItem>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{userDisplayName(row.original)}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => row.original.email ?? "—",
  },
];

export interface UsersListProps {
  showTenantFilter?: boolean;
  showCreateButton?: boolean;
}

export function UsersList(_props: UsersListProps) {
  const { users, isLoading } = useUsers(undefined, undefined);
  const list = users ?? [];

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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuários
        </CardTitle>
        <CardDescription>Usuários da plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {list.length > 0 ? (
          <DataTable
            columns={columns}
            data={list}
            getRowId={(row) => row.id}
            emptyMessage="Nenhum usuário encontrado."
          />
        ) : (
          <p className="text-muted-foreground text-sm py-4">
            Nenhum usuário encontrado.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
