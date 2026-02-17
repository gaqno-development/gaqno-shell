import React from "react";
import { UsageByUserView } from "@gaqno-development/frontcore/components/admin";

export default function AdminUsagePage() {
  return (
    <UsageByUserView
      noTenantDescription="Seu usuário não está associado a um tenant. Entre em contato com o administrador para visualizar o consumo."
      subtitle="Consumo e métricas atribuídas por usuário no tenant"
    />
  );
}
