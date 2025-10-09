/**
 * RequirePermission Component
 *
 * A server component that conditionally renders content based on the current user's permissions.
 * This component checks if the authenticated user has the required permission(s)
 * before rendering its children. It uses the RBAC permission system to validate access.
 *
 * @example
 * ```tsx
 * // Single permission check
 * <RequirePermission permission="connectors:delete">
 *   <DeleteButton />
 * </RequirePermission>
 *
 * // Multiple permissions check (requires any)
 * <RequirePermission
 *   permission={["connectors:create", "connectors:update"]}
 *   requireAll={false}
 *   fallback={<p>Insufficient permissions</p>}
 * >
 *   <EditForm />
 * </RequirePermission>
 *
 * // Multiple permissions check (requires all)
 * <RequirePermission
 *   permission={["connectors:create", "connectors:update"]}
 *   requireAll={true}
 * >
 *   <AdminForm />
 * </RequirePermission>
 * ```
 */

import { ReactNode } from 'react'
import { getCurrentAdminUserWithRole } from '@/lib/supabase/server'
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  type Permission
} from '@/lib/auth/permissions'

/**
 * Props for the RequirePermission component
 */
interface RequirePermissionProps {
  /**
   * The permission(s) required to render the children.
   * Can be a single permission or an array of permissions.
   */
  permission: Permission | Permission[]

  /**
   * When permission is an array, determines whether all permissions are required (true)
   * or if any single permission is sufficient (false).
   * Default: false (requires any permission)
   */
  requireAll?: boolean

  /**
   * The content to render if the user has the required permission(s)
   */
  children: ReactNode

  /**
   * Optional content to render if the user lacks the required permission(s)
   * If not provided, nothing will be rendered when access is denied
   */
  fallback?: ReactNode
}

/**
 * Server component that renders content conditionally based on user's permissions
 *
 * @param {RequirePermissionProps} props - The component props
 * @returns {Promise<ReactNode>} The children if authorized, fallback if not authorized, or null
 */
export default async function RequirePermission({
  permission,
  requireAll = false,
  children,
  fallback = null
}: RequirePermissionProps): Promise<ReactNode> {
  // Get the current admin user with their role information
  const user = await getCurrentAdminUserWithRole()

  // If no user, show fallback
  if (!user) {
    return fallback
  }

  // Determine if user has required permissions
  let hasRequiredPermissions: boolean

  if (Array.isArray(permission)) {
    // Multiple permissions - check based on requireAll flag
    if (requireAll) {
      // User must have ALL specified permissions
      hasRequiredPermissions = hasAllPermissions(user, permission)
    } else {
      // User needs at least ONE of the specified permissions
      hasRequiredPermissions = hasAnyPermission(user, permission)
    }
  } else {
    // Single permission check
    hasRequiredPermissions = hasPermission(user, permission)
  }

  // Render children if authorized, fallback otherwise
  return hasRequiredPermissions ? children : fallback
}