/**
 * RBAC Component Usage Examples
 *
 * This file demonstrates various ways to use the RequireRole and RequirePermission
 * components for implementing role-based access control in the admin interface.
 *
 * NOTE: These are example implementations. Use them as reference for your actual components.
 */

import { RequireRole, RequirePermission } from '@/components/admin'

// ============================================================================
// RequireRole Examples
// ============================================================================

/**
 * Example 1: Single Role Check
 * Only super admins can see the delete button
 */
export async function SuperAdminOnlySection() {
  return (
    <RequireRole role="super_admin">
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-bold text-red-900">Danger Zone</h3>
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
          Delete All Data
        </button>
      </div>
    </RequireRole>
  )
}

/**
 * Example 2: Multiple Roles with Fallback
 * Content managers and super admins can edit, others see a message
 */
export async function ContentEditSection() {
  return (
    <RequireRole
      role={["super_admin", "content_manager"]}
      fallback={
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-gray-600">
            You need content management privileges to edit this section.
          </p>
        </div>
      }
    >
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold text-blue-900">Content Editor</h3>
        <textarea className="mt-2 w-full p-2 border rounded" rows={4} />
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </div>
    </RequireRole>
  )
}

/**
 * Example 3: Translator-Only Section
 * Only translators can access translation tools
 */
export async function TranslationTools() {
  return (
    <RequireRole
      role="translator"
      fallback={<p className="text-sm text-gray-500">Translation tools are not available for your role.</p>}
    >
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="font-bold text-green-900">Translation Manager</h3>
        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
          Import Translations
        </button>
      </div>
    </RequireRole>
  )
}

// ============================================================================
// RequirePermission Examples
// ============================================================================

/**
 * Example 4: Single Permission Check
 * User must have connector deletion permission
 */
export async function ConnectorDeleteButton({ connectorId }: { connectorId: string }) {
  // connectorId would be used in actual implementation
  return (
    <RequirePermission permission="connectors:delete">
      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        Delete Connector
      </button>
    </RequirePermission>
  )
}

/**
 * Example 5: Multiple Permissions (Require Any)
 * User needs either create OR update permission for connectors
 */
export async function ConnectorForm() {
  return (
    <RequirePermission
      permission={["connectors:create", "connectors:update"]}
      requireAll={false}
      fallback={
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            You don&apos;t have permission to modify connectors.
          </p>
        </div>
      }
    >
      <form className="space-y-4 p-4 border rounded">
        <h3 className="font-bold">Connector Form</h3>
        <input type="text" placeholder="Connector Name" className="w-full p-2 border rounded" />
        <input type="text" placeholder="Model" className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Connector
        </button>
      </form>
    </RequirePermission>
  )
}

/**
 * Example 6: Multiple Permissions (Require All)
 * User must have BOTH create AND delete permissions for terminals
 */
export async function TerminalAdminPanel() {
  return (
    <RequirePermission
      permission={["terminals:create", "terminals:delete"]}
      requireAll={true}
      fallback={
        <div className="p-4 text-center text-gray-500">
          <p>Full terminal management access required.</p>
        </div>
      }
    >
      <div className="p-4 bg-purple-50 border border-purple-200 rounded">
        <h3 className="font-bold text-purple-900">Terminal Administration</h3>
        <div className="mt-4 space-x-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Create Terminal
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Delete Terminal
          </button>
        </div>
      </div>
    </RequirePermission>
  )
}

/**
 * Example 7: Audit Log Access
 * Only users with audit log permission can view logs
 */
export async function AuditLogViewer() {
  return (
    <RequirePermission
      permission="audit_logs:read"
      fallback={
        <div className="text-center py-8">
          <p className="text-gray-500">Audit logs are restricted.</p>
        </div>
      }
    >
      <div className="p-4 bg-gray-50 border rounded">
        <h3 className="font-bold mb-4">Recent Audit Logs</h3>
        <div className="space-y-2">
          <div className="p-2 bg-white border rounded">
            <span className="text-sm text-gray-600">2024-01-20 10:30</span>
            <p>User updated connector #123</p>
          </div>
          <div className="p-2 bg-white border rounded">
            <span className="text-sm text-gray-600">2024-01-20 10:25</span>
            <p>User created new terminal</p>
          </div>
        </div>
      </div>
    </RequirePermission>
  )
}

/**
 * Example 8: System Management
 * Only users with system management permission
 */
export async function SystemSettings() {
  return (
    <RequirePermission permission="system:manage">
      <div className="p-4 bg-orange-50 border border-orange-200 rounded">
        <h3 className="font-bold text-orange-900">System Configuration</h3>
        <div className="mt-4 space-y-2">
          <label className="block">
            <span className="text-sm font-medium">Database URL</span>
            <input type="text" className="mt-1 w-full p-2 border rounded" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">API Key</span>
            <input type="password" className="mt-1 w-full p-2 border rounded" />
          </label>
          <button className="px-4 py-2 bg-orange-600 text-white rounded">
            Update Settings
          </button>
        </div>
      </div>
    </RequirePermission>
  )
}

// ============================================================================
// Combined Examples
// ============================================================================

/**
 * Example 9: Nested Permission Checks
 * Different UI elements based on various permissions
 */
interface ConnectorData {
  id: string
  model: string
  display_name: string | null
  category: string
}

export async function ConnectorCard({ connector }: { connector: ConnectorData }) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{connector.display_name || connector.model}</h3>
      <p className="text-gray-600 mt-2">{connector.category}</p>

      <div className="mt-4 flex gap-2">
        {/* View button - everyone with read permission */}
        <RequirePermission permission="connectors:read">
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            View
          </button>
        </RequirePermission>

        {/* Edit button - need update permission */}
        <RequirePermission permission="connectors:update">
          <button className="px-3 py-1 bg-yellow-500 text-white rounded">
            Edit
          </button>
        </RequirePermission>

        {/* Delete button - need delete permission */}
        <RequirePermission permission="connectors:delete">
          <button className="px-3 py-1 bg-red-500 text-white rounded">
            Delete
          </button>
        </RequirePermission>
      </div>
    </div>
  )
}

/**
 * Example 10: Admin Dashboard with Role-Based Sections
 * Different dashboard sections based on user role
 */
export async function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Super Admin Section */}
      <RequireRole role="super_admin">
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="font-bold text-red-900">Super Admin Tools</h2>
          <p className="mt-2">User management, system settings, and more.</p>
        </div>
      </RequireRole>

      {/* Content Manager Section */}
      <RequireRole role={["super_admin", "content_manager"]}>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="font-bold text-blue-900">Content Management</h2>
          <p className="mt-2">Manage connectors, terminals, and keying documents.</p>
        </div>
      </RequireRole>

      {/* Translator Section */}
      <RequireRole role={["super_admin", "content_manager", "translator"]}>
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="font-bold text-green-900">Translation Center</h2>
          <p className="mt-2">Manage translations across all content.</p>
        </div>
      </RequireRole>

      {/* Sales Viewer Section - Everyone can see this */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <h2 className="font-bold text-gray-900">Sales Reports</h2>
        <p className="mt-2">View sales data and analytics.</p>
      </div>
    </div>
  )
}