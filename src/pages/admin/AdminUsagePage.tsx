import React, { useMemo, useState } from 'react'
import { useAuth } from '@gaqno-development/frontcore/hooks'
import { useTenantUsage } from '@gaqno-development/frontcore/hooks/admin/useTenantUsage'
import { useUsers } from '@gaqno-development/frontcore/hooks/admin/useUsers'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gaqno-development/frontcore/components/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gaqno-development/frontcore/components/ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gaqno-development/frontcore/components/ui'
import { Skeleton } from '@gaqno-development/frontcore/components/ui/skeleton'
import { PieChart } from 'lucide-react'

function getMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const name = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    options.push({ value: `${y}-${m}`, label: name })
  }
  return options
}

function defaultPeriod(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function userDisplayName(
  u: { id: string; email?: string; firstName?: string | null; lastName?: string | null },
): string {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
  return name || u.email || u.id
}

export default function AdminUsagePage() {
  const { user } = useAuth()
  const tenantId = user?.tenantId ?? ''
  const [period, setPeriod] = useState(defaultPeriod())
  const { usage, isLoading, period: effectivePeriod } = useTenantUsage(tenantId, period)
  const { users } = useUsers(undefined, undefined)

  const monthOptions = useMemo(() => getMonthOptions(), [])

  const userDisplayMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const u of users) {
      map[u.id] = userDisplayName(u)
    }
    return map
  }, [users])

  const { rows, metricColumns } = useMemo(() => {
    if (!usage?.metrics?.length) return { rows: [], metricColumns: [] as { key: string; serviceName: string; unit: string }[] }
    const columns = usage.metrics
      .filter((m) => m.byUser != null)
      .map((m) => ({ key: `${m.serviceName}-${m.metricKey}`, serviceName: m.serviceName, unit: m.unit }))
    const userIdSet = new Set<string>()
    for (const m of usage.metrics) {
      if (m.byUser) {
        Object.keys(m.byUser).forEach((id) => userIdSet.add(id))
      }
    }
    const userIds = Array.from(userIdSet).sort()
    const rows = userIds.map((userId) => {
      const record: Record<string, number | string> = { userId }
      for (const m of usage.metrics) {
        if (m.byUser && m.byUser[userId] != null) {
          record[`${m.serviceName}-${m.metricKey}`] = m.byUser[userId]
        }
      }
      return record
    })
    return { rows, metricColumns: columns }
  }, [usage])

  if (!tenantId) {
    return (
      <div className="container mx-auto py-6 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PieChart className="h-8 w-8" />
            Uso por usuário
          </h1>
          <p className="text-muted-foreground mt-1">
            Consumo e métricas por usuário (administração)
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Consumo por usuário</CardTitle>
            <CardDescription>
              Seu usuário não está associado a um tenant. Entre em contato com o administrador para visualizar o consumo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PieChart className="h-8 w-8" />
          Uso por usuário
        </h1>
        <p className="text-muted-foreground mt-1">
          Consumo e métricas atribuídas por usuário no tenant
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Consumo por usuário</CardTitle>
              <CardDescription>
                Uso por serviço (IA, Omnichannel, etc.) no período selecionado
              </CardDescription>
            </div>
            <Select value={effectivePeriod} onValueChange={setPeriod}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">
              Nenhum uso registrado neste período. O consumo de IA (tokens) e outras ações é atribuído ao usuário ao usar os apps.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  {metricColumns.map((col) => (
                    <TableHead key={col.key}>
                      {col.serviceName === 'ai' ? 'IA (tokens)' : col.serviceName} ({col.unit})
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.userId as string}>
                    <TableCell className="font-medium">
                      {row.userId === user?.id ? (
                        <span>Você ({user?.email ?? row.userId})</span>
                      ) : (
                        userDisplayMap[row.userId as string] ?? String(row.userId)
                      )}
                    </TableCell>
                    {metricColumns.map((col) => (
                      <TableCell key={col.key}>
                        {typeof row[col.key] === 'number'
                          ? Number(row[col.key]).toLocaleString('pt-BR')
                          : '—'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
