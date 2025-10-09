import { Suspense } from 'react'
import { Metadata } from 'next'
import RequirePermission from '@/components/admin/RequirePermission'
import UserManagement from './UserManagement'

export const metadata: Metadata = {
  title: 'User Management | Admin',
  description: 'Manage admin users and their permissions',
}

/**
 * User Management Page
 *
 * This page displays the admin user list with full CRUD capabilities.
 * Access requires 'users:read' permission.
 */
export default async function UsersPage() {
  return (
    <RequirePermission
      permission="users:read"
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You do not have permission to view user management.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage admin users, roles, and permissions.
          </p>
        </div>

        {/* User Management Component */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          }
        >
          <UserManagement />
        </Suspense>
      </div>
    </RequirePermission>
  )
}
