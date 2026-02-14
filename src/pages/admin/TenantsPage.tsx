import React from "react";
import { TenantsList } from "../../components/admin/TenantsList";

export default function TenantsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <TenantsList />
    </div>
  );
}

