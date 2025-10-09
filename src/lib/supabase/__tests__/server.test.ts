/**
 * Unit Tests for Supabase Server Auth Utilities
 *
 * Tests for server-side authentication and authorization helpers
 */

import { getCurrentUser, isUserAdmin, getCurrentAdminUser, getCurrentAdminUserWithRole } from '../server'

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn().mockReturnValue([]),
    setAll: jest.fn(),
    set: jest.fn(),
  }),
}))

// Mock Supabase clients
const mockGetUser = jest.fn()
const mockFrom = jest.fn()
const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockSingle = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}))

// ============================================================================
// Test Data
// ============================================================================

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2025-01-01T00:00:00Z',
}

const mockAdminData = {
  role: 'super_admin',
  is_active: true,
}

const mockInactiveAdminData = {
  role: 'super_admin',
  is_active: false,
}

// ============================================================================
// Setup and Teardown
// ============================================================================

beforeEach(() => {
  jest.clearAllMocks()

  // Setup default mock chain for database queries
  mockFrom.mockReturnValue({
    select: mockSelect,
  })
  mockSelect.mockReturnValue({
    eq: mockEq,
  })
  mockEq.mockReturnValue({
    single: mockSingle,
  })
})

// ============================================================================
// getCurrentUser() Tests
// ============================================================================

describe('getCurrentUser()', () => {
  it('should return user when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const result = await getCurrentUser()

    expect(result).toEqual(mockUser)
    expect(mockGetUser).toHaveBeenCalledTimes(1)
  })

  it('should return null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await getCurrentUser()

    expect(result).toBeNull()
  })

  it('should return null when auth error occurs', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Authentication failed' },
    })

    const result = await getCurrentUser()

    expect(result).toBeNull()
  })

  it('should return null when user exists but error is present', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: { message: 'Some error' },
    })

    const result = await getCurrentUser()

    expect(result).toBeNull()
  })
})

// ============================================================================
// isUserAdmin() Tests
// ============================================================================

describe('isUserAdmin()', () => {
  it('should return true for active admin user', async () => {
    mockSingle.mockResolvedValue({
      data: mockAdminData,
      error: null,
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(true)
    expect(mockFrom).toHaveBeenCalledWith('admin_users')
    expect(mockSelect).toHaveBeenCalledWith('role, is_active')
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123')
    expect(mockSingle).toHaveBeenCalled()
  })

  it('should return false for inactive admin user', async () => {
    mockSingle.mockResolvedValue({
      data: mockInactiveAdminData,
      error: null,
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(false)
  })

  it('should return false when user not found in admin_users table', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(false)
  })

  it('should return false when database query fails', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(false)
  })

  it('should return false when exception is thrown', async () => {
    mockFrom.mockImplementation(() => {
      throw new Error('Unexpected error')
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(false)
  })

  it('should handle is_active = false correctly', async () => {
    mockSingle.mockResolvedValue({
      data: { ...mockAdminData, is_active: false },
      error: null,
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(false)
  })

  it('should handle null is_active as false', async () => {
    mockSingle.mockResolvedValue({
      data: { ...mockAdminData, is_active: null },
      error: null,
    })

    const result = await isUserAdmin('user-123')

    expect(result).toBe(false)
  })
})

// ============================================================================
// getCurrentAdminUser() Tests
// ============================================================================

describe('getCurrentAdminUser()', () => {
  it('should return user when authenticated and is admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: mockAdminData,
      error: null,
    })

    const result = await getCurrentAdminUser()

    expect(result).toEqual(mockUser)
  })

  it('should return null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await getCurrentAdminUser()

    expect(result).toBeNull()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('should return null when authenticated but not admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    const result = await getCurrentAdminUser()

    expect(result).toBeNull()
  })

  it('should return null when authenticated but admin is inactive', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: mockInactiveAdminData,
      error: null,
    })

    const result = await getCurrentAdminUser()

    expect(result).toBeNull()
  })
})

// ============================================================================
// getCurrentAdminUserWithRole() Tests
// ============================================================================

describe('getCurrentAdminUserWithRole()', () => {
  it('should return user with role for active admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: mockAdminData,
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result).toEqual({
      id: 'user-123',
      role: 'super_admin',
      email: 'test@example.com',
    })
  })

  it('should return null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result).toBeNull()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('should return null when user not in admin_users table', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result).toBeNull()
  })

  it('should return null when admin user is inactive', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: mockInactiveAdminData,
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result).toBeNull()
  })

  it('should return null when database query fails', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result).toBeNull()
  })

  it('should return null when exception is thrown', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockFrom.mockImplementation(() => {
      throw new Error('Unexpected error')
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result).toBeNull()
  })

  it('should include email in result', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: mockAdminData,
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result?.email).toBe('test@example.com')
  })

  it('should correctly map role from database', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: { role: 'content_manager', is_active: true },
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result?.role).toBe('content_manager')
  })

  it('should handle translator role', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: { role: 'translator', is_active: true },
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result?.role).toBe('translator')
  })

  it('should handle sales_viewer role', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: { role: 'sales_viewer', is_active: true },
      error: null,
    })

    const result = await getCurrentAdminUserWithRole()

    expect(result?.role).toBe('sales_viewer')
  })
})

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration: Auth flow', () => {
  it('should handle complete auth flow for super_admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: mockAdminData,
      error: null,
    })

    const user = await getCurrentUser()
    expect(user).toEqual(mockUser)

    const isAdmin = await isUserAdmin(user!.id)
    expect(isAdmin).toBe(true)

    const adminUser = await getCurrentAdminUser()
    expect(adminUser).toEqual(mockUser)

    const adminUserWithRole = await getCurrentAdminUserWithRole()
    expect(adminUserWithRole).toEqual({
      id: 'user-123',
      role: 'super_admin',
      email: 'test@example.com',
    })
  })

  it('should handle complete auth flow for non-admin user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    const user = await getCurrentUser()
    expect(user).toEqual(mockUser)

    const isAdmin = await isUserAdmin(user!.id)
    expect(isAdmin).toBe(false)

    const adminUser = await getCurrentAdminUser()
    expect(adminUser).toBeNull()

    const adminUserWithRole = await getCurrentAdminUserWithRole()
    expect(adminUserWithRole).toBeNull()
  })

  it('should handle complete auth flow for unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const user = await getCurrentUser()
    expect(user).toBeNull()

    const adminUser = await getCurrentAdminUser()
    expect(adminUser).toBeNull()

    const adminUserWithRole = await getCurrentAdminUserWithRole()
    expect(adminUserWithRole).toBeNull()
  })
})
