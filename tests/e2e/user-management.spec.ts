/**
 * Playwright E2E Tests - Admin User Management
 *
 * Comprehensive end-to-end tests for the admin user management functionality.
 * Tests cover all CRUD operations, permissions, and UI interactions.
 *
 * @module tests/e2e/user-management.spec.ts
 */

import { test, expect, type Page } from '@playwright/test'

// =============================================================================
// TEST DATA & CONSTANTS
// =============================================================================

const TEST_USERS = {
  superAdmin: {
    email: 'super@example.com',
    password: 'superadmin123',
    full_name: 'Super Admin User',
    role: 'super_admin',
  },
  contentManager: {
    email: 'content@example.com',
    password: 'content123',
    full_name: 'Content Manager User',
    role: 'content_manager',
  },
  translator: {
    email: 'translator@example.com',
    password: 'translator123',
    full_name: 'Translator User',
    role: 'translator',
  },
  salesViewer: {
    email: 'sales@example.com',
    password: 'sales123',
    full_name: 'Sales Viewer User',
    role: 'sales_viewer',
  },
  newUser: {
    email: 'newuser@example.com',
    full_name: 'New Test User',
    password: 'newuser123',
    role: 'content_manager',
  },
}

const MOCK_USERS = [
  {
    id: '1',
    user_id: 'auth-1',
    email: TEST_USERS.superAdmin.email,
    full_name: TEST_USERS.superAdmin.full_name,
    role: 'super_admin',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'auth-2',
    email: TEST_USERS.contentManager.email,
    full_name: TEST_USERS.contentManager.full_name,
    role: 'content_manager',
    is_active: true,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'auth-3',
    email: TEST_USERS.translator.email,
    full_name: TEST_USERS.translator.full_name,
    role: 'translator',
    is_active: true,
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'auth-4',
    email: TEST_USERS.salesViewer.email,
    full_name: TEST_USERS.salesViewer.full_name,
    role: 'sales_viewer',
    is_active: false,
    created_at: '2025-01-04T00:00:00Z',
    updated_at: '2025-01-04T00:00:00Z',
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Set up authenticated session as super admin
 */
async function setupSuperAdminAuth(page: Page): Promise<void> {
  // Mock authentication by setting cookies/localStorage
  await page.context().addCookies([
    {
      name: 'sb-access-token',
      value: 'mock-super-admin-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Date.now() / 1000 + 3600,
    },
  ])

  // Mock localStorage with user session
  await page.addInitScript(() => {
    localStorage.setItem(
      'sb-auth-token',
      JSON.stringify({
        user: {
          id: 'auth-1',
          email: 'super@example.com',
          user_metadata: { role: 'super_admin' },
        },
      })
    )
  })
}

/**
 * Mock Supabase API responses
 */
async function mockSupabaseAPI(page: Page): Promise<void> {
  // Mock authentication check
  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'auth-1',
        email: TEST_USERS.superAdmin.email,
        user_metadata: { role: 'super_admin' },
      }),
    })
  })

  // Mock admin users list endpoint
  await page.route('**/rest/v1/admin_users*', async (route) => {
    const url = route.request().url()
    const method = route.request().method()

    if (method === 'GET') {
      // Check for filters in query params
      const urlObj = new URL(url)
      const searchParams = urlObj.searchParams
      let filteredUsers = [...MOCK_USERS]

      // Apply role filter
      const roleFilter = searchParams.get('role')
      if (roleFilter) {
        filteredUsers = filteredUsers.filter((u) => u.role === roleFilter)
      }

      // Apply status filter
      const statusFilter = searchParams.get('is_active')
      if (statusFilter !== null) {
        const isActive = statusFilter === 'true'
        filteredUsers = filteredUsers.filter((u) => u.is_active === isActive)
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filteredUsers),
      })
    } else if (method === 'POST') {
      // Create user
      const postData = route.request().postDataJSON()
      const newUser = {
        id: '5',
        user_id: 'auth-5',
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newUser),
      })
    } else if (method === 'PATCH') {
      // Update user
      const patchData = route.request().postDataJSON()
      const patchUrlObj = new URL(url)
      const userId = patchUrlObj.searchParams.get('id')
      const user = MOCK_USERS.find((u) => u.id === userId)
      if (user) {
        const updatedUser = { ...user, ...patchData, updated_at: new Date().toISOString() }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updatedUser),
        })
      }
    }
  })

  // Mock audit log endpoint
  await page.route('**/rest/v1/audit_logs*', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: '1', created_at: new Date().toISOString() }),
    })
  })
}

/**
 * Navigate to user management page
 */
async function navigateToUsersPage(page: Page): Promise<void> {
  await page.goto('/en/admin/users')
  await page.waitForLoadState('networkidle')
}

/**
 * Wait for table to load
 */
async function waitForTableLoad(page: Page): Promise<void> {
  await page.waitForSelector('table', { state: 'visible' })
  await expect(page.locator('table tbody tr')).toHaveCount(MOCK_USERS.length, { timeout: 5000 })
}

// =============================================================================
// TEST SUITE
// =============================================================================

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authentication and mocks
    await setupSuperAdminAuth(page)
    await mockSupabaseAPI(page)
    await navigateToUsersPage(page)
  })

  // ===========================================================================
  // PAGE LOAD & DISPLAY TESTS
  // ===========================================================================

  test('should display page header and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('User Management')
    await expect(page.locator('text=Manage admin users, roles, and permissions')).toBeVisible()
  })

  test('should display list of admin users', async ({ page }) => {
    await waitForTableLoad(page)

    // Check table headers
    await expect(page.locator('table th:has-text("Name")')).toBeVisible()
    await expect(page.locator('table th:has-text("Email")')).toBeVisible()
    await expect(page.locator('table th:has-text("Role")')).toBeVisible()
    await expect(page.locator('table th:has-text("Status")')).toBeVisible()
    await expect(page.locator('table th:has-text("Created")')).toBeVisible()
    await expect(page.locator('table th:has-text("Actions")')).toBeVisible()

    // Check all users are displayed
    for (const user of MOCK_USERS) {
      await expect(page.locator(`text=${user.email}`)).toBeVisible()
      await expect(page.locator(`text=${user.full_name}`)).toBeVisible()
    }
  })

  test('should display correct role badges', async ({ page }) => {
    await waitForTableLoad(page)

    // Check for role badges with correct styling
    await expect(page.locator('text=Super Admin').first()).toBeVisible()
    await expect(page.locator('text=Content Manager').first()).toBeVisible()
    await expect(page.locator('text=Translator').first()).toBeVisible()
    await expect(page.locator('text=Sales Viewer').first()).toBeVisible()
  })

  test('should display correct status badges', async ({ page }) => {
    await waitForTableLoad(page)

    // Count active and inactive badges
    const activeBadges = page.locator('text=Active')
    const inactiveBadges = page.locator('text=Inactive')

    await expect(activeBadges).toHaveCount(3) // 3 active users
    await expect(inactiveBadges).toHaveCount(1) // 1 inactive user
  })

  test('should display stats cards correctly', async ({ page }) => {
    await waitForTableLoad(page)

    // Check stats cards
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Active Users')).toBeVisible()
    await expect(page.locator('text=Inactive Users')).toBeVisible()

    // Check counts
    const totalCount = page.locator('text=Total Users').locator('..').locator('.text-2xl')
    const activeCount = page.locator('text=Active Users').locator('..').locator('.text-2xl')
    const inactiveCount = page.locator('text=Inactive Users').locator('..').locator('.text-2xl')

    await expect(totalCount).toContainText('4')
    await expect(activeCount).toContainText('3')
    await expect(inactiveCount).toContainText('1')
  })

  // ===========================================================================
  // SEARCH & FILTER TESTS
  // ===========================================================================

  test('should search users by email', async ({ page }) => {
    await waitForTableLoad(page)

    // Enter search term
    const searchInput = page.locator('input[placeholder*="Search by email or name"]')
    await searchInput.fill('content@example.com')

    // Wait for filter to apply
    await page.waitForTimeout(300)

    // Should only show content manager
    await expect(page.locator(`text=${TEST_USERS.contentManager.email}`)).toBeVisible()
    await expect(page.locator(`text=${TEST_USERS.superAdmin.email}`)).not.toBeVisible()
  })

  test('should search users by name', async ({ page }) => {
    await waitForTableLoad(page)

    // Enter search term
    const searchInput = page.locator('input[placeholder*="Search by email or name"]')
    await searchInput.fill('Translator')

    // Wait for filter to apply
    await page.waitForTimeout(300)

    // Should only show translator
    await expect(page.locator(`text=${TEST_USERS.translator.full_name}`)).toBeVisible()
    await expect(page.locator(`text=${TEST_USERS.superAdmin.full_name}`)).not.toBeVisible()
  })

  test('should filter users by role', async ({ page }) => {
    await waitForTableLoad(page)

    // Open role filter dropdown
    const roleFilter = page.locator('button:has-text("Filter by role"), button:has-text("All Roles")').first()
    await roleFilter.click()

    // Select super_admin
    await page.locator('text=Super Admin').last().click()

    // Wait for filter to apply
    await page.waitForTimeout(300)

    // Should only show super admin
    await expect(page.locator(`text=${TEST_USERS.superAdmin.email}`)).toBeVisible()
    await expect(page.locator(`text=${TEST_USERS.contentManager.email}`)).not.toBeVisible()
  })

  test('should filter users by active status', async ({ page }) => {
    await waitForTableLoad(page)

    // Open status filter dropdown
    const statusFilter = page.locator('button:has-text("Filter by status"), button:has-text("All Status")').first()
    await statusFilter.click()

    // Select inactive
    await page.locator('text=Inactive').last().click()

    // Wait for filter to apply
    await page.waitForTimeout(300)

    // Should only show inactive user (sales viewer)
    await expect(page.locator(`text=${TEST_USERS.salesViewer.email}`)).toBeVisible()
    await expect(page.locator(`text=${TEST_USERS.superAdmin.email}`)).not.toBeVisible()
  })

  test('should clear filters button', async ({ page }) => {
    await waitForTableLoad(page)

    // Apply search filter
    const searchInput = page.locator('input[placeholder*="Search by email or name"]')
    await searchInput.fill('nonexistent')
    await page.waitForTimeout(300)

    // Should show no results and clear filters button
    await expect(page.locator('text=No users found')).toBeVisible()
    await expect(page.locator('text=Clear filters')).toBeVisible()

    // Click clear filters
    await page.locator('text=Clear filters').click()

    // All users should be visible again
    await expect(page.locator('table tbody tr')).toHaveCount(MOCK_USERS.length)
  })

  test('should combine search and filters', async ({ page }) => {
    await waitForTableLoad(page)

    // Search for 'user'
    const searchInput = page.locator('input[placeholder*="Search by email or name"]')
    await searchInput.fill('User')

    // Filter by active status
    const statusFilter = page.locator('button:has-text("Filter by status"), button:has-text("All Status")').first()
    await statusFilter.click()
    await page.locator('text=Active').last().click()

    await page.waitForTimeout(300)

    // Should show active users with "User" in their name
    await expect(page.locator(`text=${TEST_USERS.superAdmin.full_name}`)).toBeVisible()
    await expect(page.locator(`text=${TEST_USERS.salesViewer.full_name}`)).not.toBeVisible()
  })

  // ===========================================================================
  // CREATE USER TESTS
  // ===========================================================================

  test('should open create user dialog', async ({ page }) => {
    // Click create user button
    await page.locator('button:has-text("Create User")').click()

    // Dialog should be visible
    await expect(page.locator('text=Create New User')).toBeVisible()
    await expect(page.locator('text=Add a new admin user to the system')).toBeVisible()

    // Form fields should be visible
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('label:has-text("Full Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Password")')).toBeVisible()
    await expect(page.locator('label:has-text("Role")')).toBeVisible()
    await expect(page.locator('label:has-text("Account is active")')).toBeVisible()
  })

  test('should create new admin user with valid data', async ({ page }) => {
    // Mock the create user API call
    await page.route('**/auth/v1/admin/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'auth-5',
            email: TEST_USERS.newUser.email,
          },
        }),
      })
    })

    // Open dialog
    await page.locator('button:has-text("Create User")').click()

    // Fill form
    await page.locator('input#email').fill(TEST_USERS.newUser.email)
    await page.locator('input#full_name').fill(TEST_USERS.newUser.full_name)
    await page.locator('input#password').fill(TEST_USERS.newUser.password)

    // Select role
    await page.locator('button[id="role"]').click()
    await page.locator('text=Content Manager').last().click()

    // Submit form
    await page.locator('button[type="submit"]:has-text("Create User")').click()

    // Success toast should appear
    await expect(page.locator('text=has been created successfully')).toBeVisible({ timeout: 5000 })

    // Dialog should close
    await expect(page.locator('text=Create New User')).not.toBeVisible()
  })

  test('should validate required fields in create form', async ({ page }) => {
    // Open dialog
    await page.locator('button:has-text("Create User")').click()

    // Try to submit empty form
    await page.locator('button[type="submit"]:has-text("Create User")').click()

    // Validation errors should appear
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Full name is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should validate email format in create form', async ({ page }) => {
    // Open dialog
    await page.locator('button:has-text("Create User")').click()

    // Enter invalid email
    await page.locator('input#email').fill('invalid-email')
    await page.locator('input#full_name').fill('Test User')
    await page.locator('input#password').fill('password123')

    // Submit form
    await page.locator('button[type="submit"]:has-text("Create User")').click()

    // Email validation error should appear
    await expect(page.locator('text=Invalid email format')).toBeVisible()
  })

  test('should validate password length in create form', async ({ page }) => {
    // Open dialog
    await page.locator('button:has-text("Create User")').click()

    // Enter short password
    await page.locator('input#email').fill('test@example.com')
    await page.locator('input#full_name').fill('Test User')
    await page.locator('input#password').fill('short')

    // Submit form
    await page.locator('button[type="submit"]:has-text("Create User")').click()

    // Password validation error should appear
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
  })

  test('should show loading state during user creation', async ({ page }) => {
    // Open dialog
    await page.locator('button:has-text("Create User")').click()

    // Fill valid form
    await page.locator('input#email').fill(TEST_USERS.newUser.email)
    await page.locator('input#full_name').fill(TEST_USERS.newUser.full_name)
    await page.locator('input#password').fill(TEST_USERS.newUser.password)

    // Mock slow API response
    await page.route('**/auth/v1/admin/users', async (route) => {
      await page.waitForTimeout(2000)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'auth-5', email: TEST_USERS.newUser.email } }),
      })
    })

    // Submit form
    await page.locator('button[type="submit"]:has-text("Create User")').click()

    // Loading spinner should be visible
    await expect(page.locator('button[type="submit"] svg.animate-spin')).toBeVisible()

    // Submit button should be disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('should cancel create user dialog', async ({ page }) => {
    // Open dialog
    await page.locator('button:has-text("Create User")').click()

    // Fill some data
    await page.locator('input#email').fill('test@example.com')

    // Click cancel
    await page.locator('button:has-text("Cancel")').click()

    // Dialog should close
    await expect(page.locator('text=Create New User')).not.toBeVisible()

    // Reopen dialog - form should be reset
    await page.locator('button:has-text("Create User")').click()
    await expect(page.locator('input#email')).toHaveValue('')
  })

  // ===========================================================================
  // EDIT USER TESTS
  // ===========================================================================

  test('should navigate to edit user page', async ({ page }) => {
    await waitForTableLoad(page)

    // Mock the single user fetch
    await page.route('**/rest/v1/admin_users?id=eq.2', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_USERS[1]]),
      })
    })

    // Click edit button for content manager
    const row = page.locator('table tbody tr', { hasText: TEST_USERS.contentManager.email })
    await row.locator('button[title="Edit user"]').click()

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/admin\/users\/2/)
    await expect(page.locator('h1:has-text("Edit User")')).toBeVisible()
  })

  test('should display user data in edit form', async ({ page }) => {
    // Navigate directly to edit page
    await page.route('**/rest/v1/admin_users?id=eq.2', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_USERS[1]]),
      })
    })

    await page.goto('/en/admin/users/2')
    await page.waitForLoadState('networkidle')

    // Email should be read-only
    const emailInput = page.locator('input[value*="content@example.com"]')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toBeDisabled()

    // Other fields should be editable
    await expect(page.locator('input[value*="Content Manager User"]')).toBeVisible()
    await expect(page.locator('input[value*="Content Manager User"]')).not.toBeDisabled()
  })

  test('should update user successfully', async ({ page }) => {
    // Setup edit page
    await page.route('**/rest/v1/admin_users?id=eq.2', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_USERS[1]]),
      })
    })

    await page.goto('/en/admin/users/2')
    await page.waitForLoadState('networkidle')

    // Modify full name
    const nameInput = page.locator('input[value*="Content Manager User"]')
    await nameInput.clear()
    await nameInput.fill('Updated Content Manager')

    // Mock update API
    await page.route('**/rest/v1/admin_users?id=eq.2', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...MOCK_USERS[1],
            full_name: 'Updated Content Manager',
            updated_at: new Date().toISOString(),
          }),
        })
      }
    })

    // Submit form
    await page.locator('button:has-text("Save Changes")').click()

    // Success toast should appear
    await expect(page.locator('text=User updated successfully')).toBeVisible({ timeout: 5000 })
  })

  test('should detect unsaved changes', async ({ page }) => {
    // Setup edit page
    await page.route('**/rest/v1/admin_users?id=eq.2', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_USERS[1]]),
      })
    })

    await page.goto('/en/admin/users/2')
    await page.waitForLoadState('networkidle')

    // Make a change
    const nameInput = page.locator('input[value*="Content Manager User"]')
    await nameInput.clear()
    await nameInput.fill('Modified Name')

    // Try to cancel - should show confirmation
    await page.locator('button:has-text("Cancel")').click()

    // Confirmation dialog should appear
    // (Implementation may vary based on confirmation approach)
    const confirmButton = page.locator('button:has-text("Discard"), button:has-text("Yes")')
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click()
    }

    // Should navigate back to users list
    await expect(page).toHaveURL(/\/admin\/users$/)
  })

  // ===========================================================================
  // DELETE USER TESTS
  // ===========================================================================

  test('should open delete confirmation dialog', async ({ page }) => {
    await waitForTableLoad(page)

    // Click delete button for translator
    const row = page.locator('table tbody tr', { hasText: TEST_USERS.translator.email })
    await row.locator('button[title="Deactivate user"]').click()

    // Delete dialog should be visible
    await expect(page.locator('text=Delete User')).toBeVisible()
    await expect(page.locator('text=Are you sure')).toBeVisible()
    await expect(page.locator(`text=${TEST_USERS.translator.email}`)).toBeVisible()
  })

  test('should delete user successfully', async ({ page }) => {
    await waitForTableLoad(page)

    // Mock delete API
    await page.route('**/rest/v1/admin_users?id=eq.3', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...MOCK_USERS[2],
            is_active: false,
            updated_at: new Date().toISOString(),
          }),
        })
      }
    })

    // Click delete button
    const row = page.locator('table tbody tr', { hasText: TEST_USERS.translator.email })
    await row.locator('button[title="Deactivate user"]').click()

    // Confirm deletion
    await page.locator('button:has-text("Delete"), button:has-text("Confirm")').click()

    // Success toast should appear
    await expect(page.locator('text=has been deactivated')).toBeVisible({ timeout: 5000 })

    // Dialog should close
    await expect(page.locator('text=Delete User')).not.toBeVisible()
  })

  test('should cancel delete action', async ({ page }) => {
    await waitForTableLoad(page)

    // Click delete button
    const row = page.locator('table tbody tr', { hasText: TEST_USERS.translator.email })
    await row.locator('button[title="Deactivate user"]').click()

    // Cancel deletion
    await page.locator('button:has-text("Cancel")').click()

    // Dialog should close
    await expect(page.locator('text=Delete User')).not.toBeVisible()

    // User should still be in table
    await expect(page.locator(`text=${TEST_USERS.translator.email}`)).toBeVisible()
  })

  // ===========================================================================
  // RESTORE USER TESTS
  // ===========================================================================

  test('should display restore button for inactive users', async ({ page }) => {
    await waitForTableLoad(page)

    // Inactive user should have restore button
    const inactiveRow = page.locator('table tbody tr', { hasText: TEST_USERS.salesViewer.email })
    await expect(inactiveRow.locator('button:has-text("Restore")')).toBeVisible()

    // Active users should have edit/delete buttons
    const activeRow = page.locator('table tbody tr', { hasText: TEST_USERS.superAdmin.email })
    await expect(activeRow.locator('button[title="Edit user"]')).toBeVisible()
    await expect(activeRow.locator('button[title="Deactivate user"]')).toBeVisible()
  })

  test('should restore inactive user successfully', async ({ page }) => {
    await waitForTableLoad(page)

    // Mock restore API
    await page.route('**/rest/v1/admin_users?id=eq.4', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...MOCK_USERS[3],
            is_active: true,
            updated_at: new Date().toISOString(),
          }),
        })
      }
    })

    // Click restore button
    const inactiveRow = page.locator('table tbody tr', { hasText: TEST_USERS.salesViewer.email })
    await inactiveRow.locator('button:has-text("Restore")').click()

    // Success toast should appear
    await expect(page.locator('text=has been restored')).toBeVisible({ timeout: 5000 })
  })

  // ===========================================================================
  // REFRESH FUNCTIONALITY TESTS
  // ===========================================================================

  test('should refresh user list', async ({ page }) => {
    await waitForTableLoad(page)

    // Click refresh button
    const refreshButton = page.locator('button[title="Refresh"]')
    await refreshButton.click()

    // Loading spinner should appear briefly
    await expect(refreshButton.locator('svg.animate-spin')).toBeVisible({ timeout: 1000 })

    // Table should reload
    await waitForTableLoad(page)
  })

  // ===========================================================================
  // PAGINATION TESTS
  // ===========================================================================

  test('should handle pagination controls', async ({ page }) => {
    // Mock large dataset
    const largeUserSet = Array.from({ length: 25 }, (_, i) => ({
      id: `user-${i}`,
      user_id: `auth-${i}`,
      email: `user${i}@example.com`,
      full_name: `User ${i}`,
      role: 'sales_viewer' as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    await page.route('**/rest/v1/admin_users*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeUserSet),
      })
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Check if pagination controls exist (if implemented)
    const nextButton = page.locator('button:has-text("Next"), button[aria-label="Next page"]')
    if (await nextButton.isVisible({ timeout: 1000 })) {
      await nextButton.click()
      await expect(page.locator('text=user10@example.com')).toBeVisible()
    }
  })

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/rest/v1/admin_users*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Error toast should appear
    await expect(page.locator('text=Failed to load users')).toBeVisible({ timeout: 5000 })
  })

  test('should handle network errors', async ({ page }) => {
    // Mock network failure
    await page.route('**/rest/v1/admin_users*', async (route) => {
      await route.abort('failed')
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Error message should appear
    await expect(page.locator('text=An error occurred')).toBeVisible({ timeout: 5000 })
  })

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  test('should support keyboard navigation', async ({ page }) => {
    await waitForTableLoad(page)

    // Tab through interactive elements
    await page.keyboard.press('Tab') // Search input
    await page.keyboard.press('Tab') // Role filter
    await page.keyboard.press('Tab') // Status filter
    await page.keyboard.press('Tab') // Refresh button
    await page.keyboard.press('Tab') // Create User button

    // Create User button should be focused
    const createButton = page.locator('button:has-text("Create User")')
    await expect(createButton).toBeFocused()

    // Press Enter to open dialog
    await page.keyboard.press('Enter')
    await expect(page.locator('text=Create New User')).toBeVisible()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await waitForTableLoad(page)

    // Check for ARIA labels on buttons
    const refreshButton = page.locator('button[title="Refresh"]')
    await expect(refreshButton).toHaveAttribute('title', 'Refresh')

    const editButtons = page.locator('button[title="Edit user"]')
    await expect(editButtons.first()).toHaveAttribute('title', 'Edit user')
  })

  // ===========================================================================
  // RESPONSIVE DESIGN TESTS
  // ===========================================================================

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await waitForTableLoad(page)

    // Page should still be usable
    await expect(page.locator('h1:has-text("User Management")')).toBeVisible()
    await expect(page.locator('button:has-text("Create User")')).toBeVisible()

    // Table should be scrollable
    const table = page.locator('table')
    await expect(table).toBeVisible()
  })

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await waitForTableLoad(page)

    // All elements should be visible
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()
    await expect(page.locator('button:has-text("Create User")')).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })
})
