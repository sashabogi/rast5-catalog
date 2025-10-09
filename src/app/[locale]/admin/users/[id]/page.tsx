import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RequirePermission from '@/components/admin/RequirePermission'
import EditUserForm from './EditUserForm'
import { getAdminUserById } from '../actions'

export const metadata: Metadata = {
  title: 'Edit User | Admin',
  description: 'Edit admin user details and permissions',
}

interface EditUserPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Edit User Page
 *
 * This page allows editing an existing admin user's details.
 * Access requires 'users:update' permission.
 */
export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params

  // Fetch user data
  const result = await getAdminUserById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const user = result.data

  return (
    <RequirePermission
      permission="users:update"
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You do not have permission to edit users.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 max-w-2xl">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update user details, role, and status.
          </p>
        </div>

        {/* Edit Form */}
        <EditUserForm user={user} />
      </div>
    </RequirePermission>
  )
}
