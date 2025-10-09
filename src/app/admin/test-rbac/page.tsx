/**
 * Test Page for RBAC Components
 *
 * This page demonstrates the usage of RequireRole and RequirePermission components
 * in a real Next.js page. Visit /admin/test-rbac to see it in action.
 */

import { RequireRole, RequirePermission } from '@/components/admin'
import { getCurrentAdminUserWithRole } from '@/lib/supabase/server'

export default async function TestRBACPage() {
  // Get current user info for display
  const user = await getCurrentAdminUserWithRole()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">RBAC Component Test Page</h1>

      {/* Display current user info */}
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Current User</h2>
        {user ? (
          <div>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ) : (
          <p className="text-gray-500">Not authenticated or not an admin</p>
        )}
      </div>

      {/* Test RequireRole */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Role-Based Access Tests</h2>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Super Admin Only</h3>
          <RequireRole
            role="super_admin"
            fallback={<p className="text-red-500">❌ You are not a super admin</p>}
          >
            <p className="text-green-500">✅ You are a super admin!</p>
          </RequireRole>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Content Manager or Super Admin</h3>
          <RequireRole
            role={["super_admin", "content_manager"]}
            fallback={<p className="text-red-500">❌ You need content management access</p>}
          >
            <p className="text-green-500">✅ You can manage content!</p>
          </RequireRole>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Translator Only</h3>
          <RequireRole
            role="translator"
            fallback={<p className="text-red-500">❌ You are not a translator</p>}
          >
            <p className="text-green-500">✅ You are a translator!</p>
          </RequireRole>
        </div>
      </div>

      {/* Test RequirePermission */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Permission-Based Access Tests</h2>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Can Create Connectors</h3>
          <RequirePermission
            permission="connectors:create"
            fallback={<p className="text-red-500">❌ No permission to create connectors</p>}
          >
            <p className="text-green-500">✅ You can create connectors!</p>
          </RequirePermission>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Can Delete Users</h3>
          <RequirePermission
            permission="users:delete"
            fallback={<p className="text-red-500">❌ No permission to delete users</p>}
          >
            <p className="text-green-500">✅ You can delete users!</p>
          </RequirePermission>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Can Read OR Write Terminals (Any)</h3>
          <RequirePermission
            permission={["terminals:read", "terminals:create"]}
            requireAll={false}
            fallback={<p className="text-red-500">❌ No terminal access</p>}
          >
            <p className="text-green-500">✅ You have some terminal access!</p>
          </RequirePermission>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Can Create AND Delete Terminals (All)</h3>
          <RequirePermission
            permission={["terminals:create", "terminals:delete"]}
            requireAll={true}
            fallback={<p className="text-red-500">❌ You don&apos;t have full terminal management</p>}
          >
            <p className="text-green-500">✅ You have full terminal management!</p>
          </RequirePermission>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">System Management</h3>
          <RequirePermission
            permission="system:manage"
            fallback={<p className="text-red-500">❌ No system management access</p>}
          >
            <p className="text-green-500">✅ You can manage system settings!</p>
          </RequirePermission>
        </div>
      </div>

      {/* Practical Example: Action Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Practical Example: Connector Actions</h2>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-4">Available Actions for Connectors</h3>
          <div className="flex gap-2">
            <RequirePermission permission="connectors:read">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                View
              </button>
            </RequirePermission>

            <RequirePermission permission="connectors:create">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Create New
              </button>
            </RequirePermission>

            <RequirePermission permission="connectors:update">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Edit
              </button>
            </RequirePermission>

            <RequirePermission permission="connectors:delete">
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </RequirePermission>
          </div>

          {/* Show message if no permissions */}
          <RequirePermission
            permission={["connectors:read", "connectors:create", "connectors:update", "connectors:delete"]}
            requireAll={false}
            fallback={
              <p className="mt-4 text-gray-500 italic">
                You don&apos;t have any permissions for connector management.
              </p>
            }
          >
            {/* This renders nothing, just used for the fallback */}
            <></>
          </RequirePermission>
        </div>
      </div>
    </div>
  )
}