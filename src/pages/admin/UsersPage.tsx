import React from 'react'
import { UsersList } from '@gaqno-development/frontcore/components/admin'
import { useUserPermissions } from '@gaqno-development/frontcore/hooks/useUserPermissions'

export default function UsersPage() {
  const { hasPermission } = useUserPermissions()
  const canManage = hasPermission('admin.users.manage')

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <UsersList showTenantFilter={canManage} showCreateButton={canManage} />
    </div>
  )
}

