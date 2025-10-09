/**
 * Permission Utilities for RBAC System
 *
 * This module provides a comprehensive permission management system for role-based access control.
 * It defines permissions for different user roles and provides utilities to check and enforce them.
 *
 * @example
 * ```typescript
 * import { hasPermission, requirePermission, canManageContent } from '@/lib/auth/permissions';
 *
 * // Check if user has permission
 * if (hasPermission(user, 'connectors:create')) {
 *   // User can create connectors
 * }
 *
 * // Require permission (throws error if lacking)
 * requirePermission(user, 'users:delete');
 *
 * // Use helper functions
 * if (canManageContent(user)) {
 *   // User can manage some content
 * }
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * All possible user roles in the system
 * Matches the role enum in admin_users table
 */
export type Role = 'super_admin' | 'content_manager' | 'translator' | 'sales_viewer';

/**
 * All possible permissions in the system
 * Organized by resource category
 */
export type Permission =
  // Connector Management
  | 'connectors:create'
  | 'connectors:read'
  | 'connectors:update'
  | 'connectors:delete'
  // Terminal Management
  | 'terminals:create'
  | 'terminals:read'
  | 'terminals:update'
  | 'terminals:delete'
  // Keying Document Management
  | 'keying_docs:create'
  | 'keying_docs:read'
  | 'keying_docs:update'
  | 'keying_docs:delete'
  // Translation Management
  | 'translations:create'
  | 'translations:read'
  | 'translations:update'
  | 'translations:delete'
  // User Management
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  // Audit Log Access
  | 'audit_logs:read'
  // System Settings
  | 'system:manage';

/**
 * User object shape for permission checking
 * Minimal interface required for permission utilities
 */
export interface PermissionUser {
  id: string;
  role: Role;
  email?: string;
}

/**
 * Permission map type definition
 */
type PermissionMap = Record<Role, ReadonlyArray<Permission>>;

// ============================================================================
// Permission Map
// ============================================================================

/**
 * Comprehensive permission map for all roles
 *
 * Role Hierarchy:
 * 1. super_admin: Full system access including user management and system settings
 * 2. content_manager: Manage all content (connectors, terminals, keying docs, translations) + audit logs
 * 3. translator: Manage translations only
 * 4. sales_viewer: Read-only access to all content
 */
export const PERMISSION_MAP: PermissionMap = {
  /**
   * Super Admin: Full system access
   * Can perform all operations including user management and system configuration
   */
  super_admin: [
    // Connector Management
    'connectors:create',
    'connectors:read',
    'connectors:update',
    'connectors:delete',
    // Terminal Management
    'terminals:create',
    'terminals:read',
    'terminals:update',
    'terminals:delete',
    // Keying Document Management
    'keying_docs:create',
    'keying_docs:read',
    'keying_docs:update',
    'keying_docs:delete',
    // Translation Management
    'translations:create',
    'translations:read',
    'translations:update',
    'translations:delete',
    // User Management
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    // Audit Log Access
    'audit_logs:read',
    // System Settings
    'system:manage',
  ],

  /**
   * Content Manager: Manage all content types
   * Can create, read, update, and delete connectors, terminals, keying docs, and translations
   * Can access audit logs but cannot manage users or system settings
   */
  content_manager: [
    // Connector Management
    'connectors:create',
    'connectors:read',
    'connectors:update',
    'connectors:delete',
    // Terminal Management
    'terminals:create',
    'terminals:read',
    'terminals:update',
    'terminals:delete',
    // Keying Document Management
    'keying_docs:create',
    'keying_docs:read',
    'keying_docs:update',
    'keying_docs:delete',
    // Translation Management
    'translations:create',
    'translations:read',
    'translations:update',
    'translations:delete',
    // Audit Log Access
    'audit_logs:read',
  ],

  /**
   * Translator: Manage translations only
   * Can create, read, update, and delete translations
   * No access to other content types or system functions
   */
  translator: [
    'translations:create',
    'translations:read',
    'translations:update',
    'translations:delete',
  ],

  /**
   * Sales Viewer: Read-only access to all content
   * Can view all content but cannot modify anything
   * No access to user management, audit logs, or system settings
   */
  sales_viewer: [
    'connectors:read',
    'terminals:read',
    'keying_docs:read',
    'translations:read',
  ],
};

// ============================================================================
// Core Permission Functions
// ============================================================================

/**
 * Check if a user has a specific permission
 *
 * @param user - The user object to check permissions for
 * @param permission - The permission to check
 * @returns true if the user has the permission, false otherwise
 *
 * @example
 * ```typescript
 * const user = { id: '123', role: 'content_manager' };
 *
 * if (hasPermission(user, 'connectors:create')) {
 *   console.log('User can create connectors');
 * }
 *
 * if (!hasPermission(user, 'users:delete')) {
 *   console.log('User cannot delete users');
 * }
 * ```
 */
export function hasPermission(
  user: PermissionUser | null | undefined,
  permission: Permission
): boolean {
  // Handle null/undefined user gracefully
  if (!user) {
    return false;
  }

  // Get permissions for user's role
  const rolePermissions = PERMISSION_MAP[user.role];

  // Check if permission exists in role's permission array
  return rolePermissions.includes(permission);
}

/**
 * Require a user to have a specific permission
 * Throws an error if the user lacks the permission
 *
 * @param user - The user object to check permissions for
 * @param permission - The permission to require
 * @throws Error if user is null/undefined or lacks the permission
 *
 * @example
 * ```typescript
 * // In API route
 * export async function DELETE(request: Request) {
 *   const user = await getCurrentUser();
 *
 *   // Will throw if user lacks permission
 *   requirePermission(user, 'connectors:delete');
 *
 *   // Proceed with deletion
 *   await deleteConnector(id);
 * }
 * ```
 */
export function requirePermission(
  user: PermissionUser | null | undefined,
  permission: Permission
): void {
  if (!user) {
    throw new Error('Authentication required to access this resource');
  }

  if (!hasPermission(user, permission)) {
    throw new Error(
      `Permission denied: User with role '${user.role}' does not have permission '${permission}'`
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a user can manage any content
 * Returns true if user has create, update, or delete permissions for any content type
 *
 * @param user - The user object to check
 * @returns true if user can manage content, false otherwise
 *
 * @example
 * ```typescript
 * if (canManageContent(user)) {
 *   // Show content management UI
 * }
 * ```
 */
export function canManageContent(user: PermissionUser | null | undefined): boolean {
  if (!user) {
    return false;
  }

  // Check for any create, update, or delete permission
  const contentPermissions: Permission[] = [
    'connectors:create', 'connectors:update', 'connectors:delete',
    'terminals:create', 'terminals:update', 'terminals:delete',
    'keying_docs:create', 'keying_docs:update', 'keying_docs:delete',
    'translations:create', 'translations:update', 'translations:delete',
  ];

  return contentPermissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user is a super admin
 *
 * @param user - The user object to check
 * @returns true if user is a super admin, false otherwise
 *
 * @example
 * ```typescript
 * if (isSuperAdmin(user)) {
 *   // Show admin-only features
 * }
 * ```
 */
export function isSuperAdmin(user: PermissionUser | null | undefined): boolean {
  return user?.role === 'super_admin';
}

/**
 * Check if a user can access audit logs
 *
 * @param user - The user object to check
 * @returns true if user can access audit logs, false otherwise
 *
 * @example
 * ```typescript
 * if (canAccessAuditLogs(user)) {
 *   // Show audit log viewer
 * }
 * ```
 */
export function canAccessAuditLogs(user: PermissionUser | null | undefined): boolean {
  return hasPermission(user, 'audit_logs:read');
}

/**
 * Check if a user can manage users
 *
 * @param user - The user object to check
 * @returns true if user can manage users, false otherwise
 *
 * @example
 * ```typescript
 * if (canManageUsers(user)) {
 *   // Show user management interface
 * }
 * ```
 */
export function canManageUsers(user: PermissionUser | null | undefined): boolean {
  return hasPermission(user, 'users:create') ||
         hasPermission(user, 'users:update') ||
         hasPermission(user, 'users:delete');
}

/**
 * Check if a user can manage system settings
 *
 * @param user - The user object to check
 * @returns true if user can manage system settings, false otherwise
 *
 * @example
 * ```typescript
 * if (canManageSystem(user)) {
 *   // Show system settings
 * }
 * ```
 */
export function canManageSystem(user: PermissionUser | null | undefined): boolean {
  return hasPermission(user, 'system:manage');
}

/**
 * Get all permissions for a specific role
 * Useful for displaying role capabilities in UI
 *
 * @param role - The role to get permissions for
 * @returns Array of permissions for the role
 *
 * @example
 * ```typescript
 * const permissions = getPermissionsForRole('content_manager');
 * console.log(permissions); // ['connectors:create', 'connectors:read', ...]
 * ```
 */
export function getPermissionsForRole(role: Role): ReadonlyArray<Permission> {
  return PERMISSION_MAP[role];
}

/**
 * Check if a user has all of the specified permissions
 *
 * @param user - The user object to check
 * @param permissions - Array of permissions to check
 * @returns true if user has all permissions, false otherwise
 *
 * @example
 * ```typescript
 * if (hasAllPermissions(user, ['connectors:read', 'terminals:read'])) {
 *   // User can view both connectors and terminals
 * }
 * ```
 */
export function hasAllPermissions(
  user: PermissionUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) {
    return false;
  }

  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Check if a user has any of the specified permissions
 *
 * @param user - The user object to check
 * @param permissions - Array of permissions to check
 * @returns true if user has at least one permission, false otherwise
 *
 * @example
 * ```typescript
 * if (hasAnyPermission(user, ['users:create', 'users:update', 'users:delete'])) {
 *   // User can perform some user management actions
 * }
 * ```
 */
export function hasAnyPermission(
  user: PermissionUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) {
    return false;
  }

  return permissions.some(permission => hasPermission(user, permission));
}

// ============================================================================
// Resource-Specific Permission Helpers
// ============================================================================

/**
 * Check if a user can perform a specific action on connectors
 *
 * @param user - The user object to check
 * @param action - The action to check ('create' | 'read' | 'update' | 'delete')
 * @returns true if user can perform the action, false otherwise
 */
export function canAccessConnectors(
  user: PermissionUser | null | undefined,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  return hasPermission(user, `connectors:${action}`);
}

/**
 * Check if a user can perform a specific action on terminals
 *
 * @param user - The user object to check
 * @param action - The action to check ('create' | 'read' | 'update' | 'delete')
 * @returns true if user can perform the action, false otherwise
 */
export function canAccessTerminals(
  user: PermissionUser | null | undefined,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  return hasPermission(user, `terminals:${action}`);
}

/**
 * Check if a user can perform a specific action on keying documents
 *
 * @param user - The user object to check
 * @param action - The action to check ('create' | 'read' | 'update' | 'delete')
 * @returns true if user can perform the action, false otherwise
 */
export function canAccessKeyingDocs(
  user: PermissionUser | null | undefined,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  return hasPermission(user, `keying_docs:${action}`);
}

/**
 * Check if a user can perform a specific action on translations
 *
 * @param user - The user object to check
 * @param action - The action to check ('create' | 'read' | 'update' | 'delete')
 * @returns true if user can perform the action, false otherwise
 */
export function canAccessTranslations(
  user: PermissionUser | null | undefined,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  return hasPermission(user, `translations:${action}`);
}

/**
 * Check if a user can perform a specific action on users
 *
 * @param user - The user object to check
 * @param action - The action to check ('create' | 'read' | 'update' | 'delete')
 * @returns true if user can perform the action, false otherwise
 */
export function canAccessUsers(
  user: PermissionUser | null | undefined,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  return hasPermission(user, `users:${action}`);
}
