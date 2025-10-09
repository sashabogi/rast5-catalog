/**
 * Admin RBAC Components
 *
 * This module exports server components for Role-Based Access Control (RBAC)
 * in the admin interface. These components provide declarative access control
 * by conditionally rendering content based on user roles and permissions.
 *
 * @example
 * ```tsx
 * import { RequireRole, RequirePermission, ErrorBoundary } from '@/components/admin'
 *
 * // Check for specific role
 * <RequireRole role="super_admin">
 *   <AdminOnlyFeature />
 * </RequireRole>
 *
 * // Check for specific permission
 * <RequirePermission permission="connectors:delete">
 *   <DeleteButton />
 * </RequirePermission>
 *
 * // Catch component errors
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

export { default as RequireRole } from './RequireRole'
export { default as RequirePermission } from './RequirePermission'
export { ErrorBoundary } from './ErrorBoundary'