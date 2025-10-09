/**
 * RequireRole Component
 *
 * A server component that conditionally renders content based on the current user's role.
 * This component checks if the authenticated user has one of the required roles
 * before rendering its children.
 *
 * @example
 * ```tsx
 * // Single role check
 * <RequireRole role="super_admin">
 *   <DeleteButton />
 * </RequireRole>
 *
 * // Multiple roles check
 * <RequireRole role={["super_admin", "content_manager"]} fallback={<p>Access Denied</p>}>
 *   <AdminPanel />
 * </RequireRole>
 * ```
 */

import { ReactNode } from 'react'
import { getCurrentAdminUserWithRole } from '@/lib/supabase/server'
import type { Role } from '@/lib/auth/permissions'

/**
 * Props for the RequireRole component
 */
interface RequireRoleProps {
  /**
   * The role(s) required to render the children.
   * Can be a single role or an array of roles.
   * If an array is provided, the user needs to have at least one of the roles.
   */
  role: Role | Role[]

  /**
   * The content to render if the user has the required role(s)
   */
  children: ReactNode

  /**
   * Optional content to render if the user lacks the required role(s)
   * If not provided, nothing will be rendered when access is denied
   */
  fallback?: ReactNode
}

/**
 * Server component that renders content conditionally based on user's role
 *
 * @param {RequireRoleProps} props - The component props
 * @returns {Promise<ReactNode>} The children if authorized, fallback if not authorized, or null
 */
export default async function RequireRole({
  role,
  children,
  fallback = null
}: RequireRoleProps): Promise<ReactNode> {
  // Get the current admin user with their role information
  const user = await getCurrentAdminUserWithRole()

  // If no user or user lacks role information, show fallback
  if (!user || !user.role) {
    return fallback
  }

  // Normalize role to array for easier comparison
  const requiredRoles = Array.isArray(role) ? role : [role]

  // Check if user's role matches any of the required roles
  const hasRequiredRole = requiredRoles.includes(user.role)

  // Render children if authorized, fallback otherwise
  return hasRequiredRole ? children : fallback
}