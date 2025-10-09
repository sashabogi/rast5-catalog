/**
 * Unit Tests for Permission Utilities
 *
 * Comprehensive test suite for RBAC permission system
 */

import {
  hasPermission,
  requirePermission,
  canManageContent,
  isSuperAdmin,
  canAccessAuditLogs,
  canManageUsers,
  canManageSystem,
  getPermissionsForRole,
  hasAllPermissions,
  hasAnyPermission,
  canAccessConnectors,
  canAccessTerminals,
  canAccessKeyingDocs,
  canAccessTranslations,
  canAccessUsers,
  type PermissionUser,
  type Role,
  type Permission,
} from '../permissions';

// ============================================================================
// Test Data
// ============================================================================

const mockUsers: Record<Role, PermissionUser> = {
  super_admin: { id: '1', role: 'super_admin', email: 'admin@test.com' },
  content_manager: { id: '2', role: 'content_manager', email: 'content@test.com' },
  translator: { id: '3', role: 'translator', email: 'translator@test.com' },
  sales_viewer: { id: '4', role: 'sales_viewer', email: 'sales@test.com' },
};

// ============================================================================
// hasPermission() Tests
// ============================================================================

describe('hasPermission()', () => {
  describe('super_admin permissions', () => {
    const user = mockUsers.super_admin;

    it('should have all connector permissions', () => {
      expect(hasPermission(user, 'connectors:create')).toBe(true);
      expect(hasPermission(user, 'connectors:read')).toBe(true);
      expect(hasPermission(user, 'connectors:update')).toBe(true);
      expect(hasPermission(user, 'connectors:delete')).toBe(true);
    });

    it('should have all terminal permissions', () => {
      expect(hasPermission(user, 'terminals:create')).toBe(true);
      expect(hasPermission(user, 'terminals:read')).toBe(true);
      expect(hasPermission(user, 'terminals:update')).toBe(true);
      expect(hasPermission(user, 'terminals:delete')).toBe(true);
    });

    it('should have all keying_docs permissions', () => {
      expect(hasPermission(user, 'keying_docs:create')).toBe(true);
      expect(hasPermission(user, 'keying_docs:read')).toBe(true);
      expect(hasPermission(user, 'keying_docs:update')).toBe(true);
      expect(hasPermission(user, 'keying_docs:delete')).toBe(true);
    });

    it('should have all translation permissions', () => {
      expect(hasPermission(user, 'translations:create')).toBe(true);
      expect(hasPermission(user, 'translations:read')).toBe(true);
      expect(hasPermission(user, 'translations:update')).toBe(true);
      expect(hasPermission(user, 'translations:delete')).toBe(true);
    });

    it('should have all user management permissions', () => {
      expect(hasPermission(user, 'users:create')).toBe(true);
      expect(hasPermission(user, 'users:read')).toBe(true);
      expect(hasPermission(user, 'users:update')).toBe(true);
      expect(hasPermission(user, 'users:delete')).toBe(true);
    });

    it('should have audit log and system permissions', () => {
      expect(hasPermission(user, 'audit_logs:read')).toBe(true);
      expect(hasPermission(user, 'system:manage')).toBe(true);
    });
  });

  describe('content_manager permissions', () => {
    const user = mockUsers.content_manager;

    it('should have all content permissions', () => {
      expect(hasPermission(user, 'connectors:create')).toBe(true);
      expect(hasPermission(user, 'terminals:delete')).toBe(true);
      expect(hasPermission(user, 'keying_docs:update')).toBe(true);
      expect(hasPermission(user, 'translations:read')).toBe(true);
    });

    it('should have audit log access', () => {
      expect(hasPermission(user, 'audit_logs:read')).toBe(true);
    });

    it('should NOT have user management permissions', () => {
      expect(hasPermission(user, 'users:create')).toBe(false);
      expect(hasPermission(user, 'users:read')).toBe(false);
      expect(hasPermission(user, 'users:update')).toBe(false);
      expect(hasPermission(user, 'users:delete')).toBe(false);
    });

    it('should NOT have system management permission', () => {
      expect(hasPermission(user, 'system:manage')).toBe(false);
    });
  });

  describe('translator permissions', () => {
    const user = mockUsers.translator;

    it('should have all translation permissions', () => {
      expect(hasPermission(user, 'translations:create')).toBe(true);
      expect(hasPermission(user, 'translations:read')).toBe(true);
      expect(hasPermission(user, 'translations:update')).toBe(true);
      expect(hasPermission(user, 'translations:delete')).toBe(true);
    });

    it('should NOT have connector permissions', () => {
      expect(hasPermission(user, 'connectors:create')).toBe(false);
      expect(hasPermission(user, 'connectors:read')).toBe(false);
      expect(hasPermission(user, 'connectors:update')).toBe(false);
      expect(hasPermission(user, 'connectors:delete')).toBe(false);
    });

    it('should NOT have terminal permissions', () => {
      expect(hasPermission(user, 'terminals:create')).toBe(false);
      expect(hasPermission(user, 'terminals:read')).toBe(false);
    });

    it('should NOT have keying_docs permissions', () => {
      expect(hasPermission(user, 'keying_docs:create')).toBe(false);
      expect(hasPermission(user, 'keying_docs:read')).toBe(false);
    });

    it('should NOT have user management or audit log access', () => {
      expect(hasPermission(user, 'users:create')).toBe(false);
      expect(hasPermission(user, 'audit_logs:read')).toBe(false);
      expect(hasPermission(user, 'system:manage')).toBe(false);
    });
  });

  describe('sales_viewer permissions', () => {
    const user = mockUsers.sales_viewer;

    it('should have read-only access to all content', () => {
      expect(hasPermission(user, 'connectors:read')).toBe(true);
      expect(hasPermission(user, 'terminals:read')).toBe(true);
      expect(hasPermission(user, 'keying_docs:read')).toBe(true);
      expect(hasPermission(user, 'translations:read')).toBe(true);
    });

    it('should NOT have create permissions', () => {
      expect(hasPermission(user, 'connectors:create')).toBe(false);
      expect(hasPermission(user, 'terminals:create')).toBe(false);
      expect(hasPermission(user, 'keying_docs:create')).toBe(false);
      expect(hasPermission(user, 'translations:create')).toBe(false);
    });

    it('should NOT have update permissions', () => {
      expect(hasPermission(user, 'connectors:update')).toBe(false);
      expect(hasPermission(user, 'terminals:update')).toBe(false);
      expect(hasPermission(user, 'keying_docs:update')).toBe(false);
      expect(hasPermission(user, 'translations:update')).toBe(false);
    });

    it('should NOT have delete permissions', () => {
      expect(hasPermission(user, 'connectors:delete')).toBe(false);
      expect(hasPermission(user, 'terminals:delete')).toBe(false);
      expect(hasPermission(user, 'keying_docs:delete')).toBe(false);
      expect(hasPermission(user, 'translations:delete')).toBe(false);
    });

    it('should NOT have audit log, user management, or system access', () => {
      expect(hasPermission(user, 'audit_logs:read')).toBe(false);
      expect(hasPermission(user, 'users:create')).toBe(false);
      expect(hasPermission(user, 'system:manage')).toBe(false);
    });
  });

  describe('null/undefined user handling', () => {
    it('should return false for null user', () => {
      expect(hasPermission(null, 'connectors:read')).toBe(false);
    });

    it('should return false for undefined user', () => {
      expect(hasPermission(undefined, 'connectors:read')).toBe(false);
    });
  });
});

// ============================================================================
// requirePermission() Tests
// ============================================================================

describe('requirePermission()', () => {
  it('should not throw when user has permission', () => {
    const user = mockUsers.super_admin;
    expect(() => {
      requirePermission(user, 'connectors:create');
    }).not.toThrow();
  });

  it('should throw when user lacks permission', () => {
    const user = mockUsers.sales_viewer;
    expect(() => {
      requirePermission(user, 'connectors:create');
    }).toThrow("Permission denied: User with role 'sales_viewer' does not have permission 'connectors:create'");
  });

  it('should throw when user is null', () => {
    expect(() => {
      requirePermission(null, 'connectors:read');
    }).toThrow('Authentication required to access this resource');
  });

  it('should throw when user is undefined', () => {
    expect(() => {
      requirePermission(undefined, 'connectors:read');
    }).toThrow('Authentication required to access this resource');
  });

  it('should throw with correct error message for different permissions', () => {
    const user = mockUsers.translator;
    expect(() => {
      requirePermission(user, 'users:delete');
    }).toThrow("Permission denied: User with role 'translator' does not have permission 'users:delete'");
  });
});

// ============================================================================
// Helper Functions Tests
// ============================================================================

describe('canManageContent()', () => {
  it('should return true for super_admin', () => {
    expect(canManageContent(mockUsers.super_admin)).toBe(true);
  });

  it('should return true for content_manager', () => {
    expect(canManageContent(mockUsers.content_manager)).toBe(true);
  });

  it('should return true for translator (can manage translations)', () => {
    expect(canManageContent(mockUsers.translator)).toBe(true);
  });

  it('should return false for sales_viewer (read-only)', () => {
    expect(canManageContent(mockUsers.sales_viewer)).toBe(false);
  });

  it('should return false for null user', () => {
    expect(canManageContent(null)).toBe(false);
  });

  it('should return false for undefined user', () => {
    expect(canManageContent(undefined)).toBe(false);
  });
});

describe('isSuperAdmin()', () => {
  it('should return true for super_admin', () => {
    expect(isSuperAdmin(mockUsers.super_admin)).toBe(true);
  });

  it('should return false for content_manager', () => {
    expect(isSuperAdmin(mockUsers.content_manager)).toBe(false);
  });

  it('should return false for translator', () => {
    expect(isSuperAdmin(mockUsers.translator)).toBe(false);
  });

  it('should return false for sales_viewer', () => {
    expect(isSuperAdmin(mockUsers.sales_viewer)).toBe(false);
  });

  it('should return false for null user', () => {
    expect(isSuperAdmin(null)).toBe(false);
  });

  it('should return false for undefined user', () => {
    expect(isSuperAdmin(undefined)).toBe(false);
  });
});

describe('canAccessAuditLogs()', () => {
  it('should return true for super_admin', () => {
    expect(canAccessAuditLogs(mockUsers.super_admin)).toBe(true);
  });

  it('should return true for content_manager', () => {
    expect(canAccessAuditLogs(mockUsers.content_manager)).toBe(true);
  });

  it('should return false for translator', () => {
    expect(canAccessAuditLogs(mockUsers.translator)).toBe(false);
  });

  it('should return false for sales_viewer', () => {
    expect(canAccessAuditLogs(mockUsers.sales_viewer)).toBe(false);
  });
});

describe('canManageUsers()', () => {
  it('should return true for super_admin', () => {
    expect(canManageUsers(mockUsers.super_admin)).toBe(true);
  });

  it('should return false for content_manager', () => {
    expect(canManageUsers(mockUsers.content_manager)).toBe(false);
  });

  it('should return false for translator', () => {
    expect(canManageUsers(mockUsers.translator)).toBe(false);
  });

  it('should return false for sales_viewer', () => {
    expect(canManageUsers(mockUsers.sales_viewer)).toBe(false);
  });

  it('should return false for null user', () => {
    expect(canManageUsers(null)).toBe(false);
  });
});

describe('canManageSystem()', () => {
  it('should return true for super_admin', () => {
    expect(canManageSystem(mockUsers.super_admin)).toBe(true);
  });

  it('should return false for content_manager', () => {
    expect(canManageSystem(mockUsers.content_manager)).toBe(false);
  });

  it('should return false for translator', () => {
    expect(canManageSystem(mockUsers.translator)).toBe(false);
  });

  it('should return false for sales_viewer', () => {
    expect(canManageSystem(mockUsers.sales_viewer)).toBe(false);
  });
});

// ============================================================================
// getPermissionsForRole() Tests
// ============================================================================

describe('getPermissionsForRole()', () => {
  it('should return correct permissions for super_admin', () => {
    const permissions = getPermissionsForRole('super_admin');
    expect(permissions).toContain('connectors:create');
    expect(permissions).toContain('users:delete');
    expect(permissions).toContain('system:manage');
    expect(permissions).toContain('audit_logs:read');
    expect(permissions.length).toBe(22); // All permissions
  });

  it('should return correct permissions for content_manager', () => {
    const permissions = getPermissionsForRole('content_manager');
    expect(permissions).toContain('connectors:create');
    expect(permissions).toContain('translations:delete');
    expect(permissions).toContain('audit_logs:read');
    expect(permissions).not.toContain('users:create');
    expect(permissions).not.toContain('system:manage');
    expect(permissions.length).toBe(17); // All content + audit logs
  });

  it('should return correct permissions for translator', () => {
    const permissions = getPermissionsForRole('translator');
    expect(permissions).toContain('translations:create');
    expect(permissions).toContain('translations:read');
    expect(permissions).toContain('translations:update');
    expect(permissions).toContain('translations:delete');
    expect(permissions.length).toBe(4);
  });

  it('should return correct permissions for sales_viewer', () => {
    const permissions = getPermissionsForRole('sales_viewer');
    expect(permissions).toContain('connectors:read');
    expect(permissions).toContain('terminals:read');
    expect(permissions).toContain('keying_docs:read');
    expect(permissions).toContain('translations:read');
    expect(permissions).not.toContain('connectors:create');
    expect(permissions.length).toBe(4);
  });
});

// ============================================================================
// hasAllPermissions() and hasAnyPermission() Tests
// ============================================================================

describe('hasAllPermissions()', () => {
  it('should return true when user has all permissions', () => {
    const user = mockUsers.super_admin;
    const permissions: Permission[] = ['connectors:create', 'users:delete', 'system:manage'];
    expect(hasAllPermissions(user, permissions)).toBe(true);
  });

  it('should return false when user lacks one permission', () => {
    const user = mockUsers.content_manager;
    const permissions: Permission[] = ['connectors:create', 'users:delete'];
    expect(hasAllPermissions(user, permissions)).toBe(false);
  });

  it('should return true for empty permission array', () => {
    const user = mockUsers.sales_viewer;
    expect(hasAllPermissions(user, [])).toBe(true);
  });

  it('should return false for null user', () => {
    const permissions: Permission[] = ['connectors:read'];
    expect(hasAllPermissions(null, permissions)).toBe(false);
  });
});

describe('hasAnyPermission()', () => {
  it('should return true when user has at least one permission', () => {
    const user = mockUsers.content_manager;
    const permissions: Permission[] = ['connectors:create', 'users:delete'];
    expect(hasAnyPermission(user, permissions)).toBe(true);
  });

  it('should return false when user has none of the permissions', () => {
    const user = mockUsers.sales_viewer;
    const permissions: Permission[] = ['connectors:create', 'users:delete', 'system:manage'];
    expect(hasAnyPermission(user, permissions)).toBe(false);
  });

  it('should return true when user has all permissions', () => {
    const user = mockUsers.super_admin;
    const permissions: Permission[] = ['connectors:create', 'users:delete'];
    expect(hasAnyPermission(user, permissions)).toBe(true);
  });

  it('should return false for empty permission array', () => {
    const user = mockUsers.super_admin;
    expect(hasAnyPermission(user, [])).toBe(false);
  });

  it('should return false for null user', () => {
    const permissions: Permission[] = ['connectors:read'];
    expect(hasAnyPermission(null, permissions)).toBe(false);
  });
});

// ============================================================================
// Resource-Specific Permission Helpers Tests
// ============================================================================

describe('canAccessConnectors()', () => {
  it('should allow super_admin all actions', () => {
    const user = mockUsers.super_admin;
    expect(canAccessConnectors(user, 'create')).toBe(true);
    expect(canAccessConnectors(user, 'read')).toBe(true);
    expect(canAccessConnectors(user, 'update')).toBe(true);
    expect(canAccessConnectors(user, 'delete')).toBe(true);
  });

  it('should allow sales_viewer only read', () => {
    const user = mockUsers.sales_viewer;
    expect(canAccessConnectors(user, 'read')).toBe(true);
    expect(canAccessConnectors(user, 'create')).toBe(false);
    expect(canAccessConnectors(user, 'update')).toBe(false);
    expect(canAccessConnectors(user, 'delete')).toBe(false);
  });

  it('should deny translator all connector actions', () => {
    const user = mockUsers.translator;
    expect(canAccessConnectors(user, 'create')).toBe(false);
    expect(canAccessConnectors(user, 'read')).toBe(false);
    expect(canAccessConnectors(user, 'update')).toBe(false);
    expect(canAccessConnectors(user, 'delete')).toBe(false);
  });
});

describe('canAccessTerminals()', () => {
  it('should allow content_manager all actions', () => {
    const user = mockUsers.content_manager;
    expect(canAccessTerminals(user, 'create')).toBe(true);
    expect(canAccessTerminals(user, 'read')).toBe(true);
    expect(canAccessTerminals(user, 'update')).toBe(true);
    expect(canAccessTerminals(user, 'delete')).toBe(true);
  });

  it('should allow sales_viewer only read', () => {
    const user = mockUsers.sales_viewer;
    expect(canAccessTerminals(user, 'read')).toBe(true);
    expect(canAccessTerminals(user, 'create')).toBe(false);
  });
});

describe('canAccessKeyingDocs()', () => {
  it('should allow content_manager all actions', () => {
    const user = mockUsers.content_manager;
    expect(canAccessKeyingDocs(user, 'create')).toBe(true);
    expect(canAccessKeyingDocs(user, 'read')).toBe(true);
    expect(canAccessKeyingDocs(user, 'update')).toBe(true);
    expect(canAccessKeyingDocs(user, 'delete')).toBe(true);
  });

  it('should deny translator all keying_docs actions', () => {
    const user = mockUsers.translator;
    expect(canAccessKeyingDocs(user, 'create')).toBe(false);
    expect(canAccessKeyingDocs(user, 'read')).toBe(false);
    expect(canAccessKeyingDocs(user, 'update')).toBe(false);
    expect(canAccessKeyingDocs(user, 'delete')).toBe(false);
  });
});

describe('canAccessTranslations()', () => {
  it('should allow translator all translation actions', () => {
    const user = mockUsers.translator;
    expect(canAccessTranslations(user, 'create')).toBe(true);
    expect(canAccessTranslations(user, 'read')).toBe(true);
    expect(canAccessTranslations(user, 'update')).toBe(true);
    expect(canAccessTranslations(user, 'delete')).toBe(true);
  });

  it('should allow sales_viewer only read', () => {
    const user = mockUsers.sales_viewer;
    expect(canAccessTranslations(user, 'read')).toBe(true);
    expect(canAccessTranslations(user, 'create')).toBe(false);
    expect(canAccessTranslations(user, 'update')).toBe(false);
    expect(canAccessTranslations(user, 'delete')).toBe(false);
  });
});

describe('canAccessUsers()', () => {
  it('should allow super_admin all user actions', () => {
    const user = mockUsers.super_admin;
    expect(canAccessUsers(user, 'create')).toBe(true);
    expect(canAccessUsers(user, 'read')).toBe(true);
    expect(canAccessUsers(user, 'update')).toBe(true);
    expect(canAccessUsers(user, 'delete')).toBe(true);
  });

  it('should deny content_manager all user actions', () => {
    const user = mockUsers.content_manager;
    expect(canAccessUsers(user, 'create')).toBe(false);
    expect(canAccessUsers(user, 'read')).toBe(false);
    expect(canAccessUsers(user, 'update')).toBe(false);
    expect(canAccessUsers(user, 'delete')).toBe(false);
  });

  it('should deny sales_viewer all user actions', () => {
    const user = mockUsers.sales_viewer;
    expect(canAccessUsers(user, 'create')).toBe(false);
    expect(canAccessUsers(user, 'read')).toBe(false);
    expect(canAccessUsers(user, 'update')).toBe(false);
    expect(canAccessUsers(user, 'delete')).toBe(false);
  });
});
