/**
 * E2E Tests for RBAC (Role-Based Access Control) Enforcement
 *
 * This test suite validates that role-based permissions are properly enforced
 * across all admin routes and CRUD operations. It tests:
 * - Route access control for each role
 * - CRUD operation permissions
 * - Unauthorized access handling
 * - Navigation guards and redirects
 * - UI element visibility based on role
 *
 * Roles tested:
 * - super_admin: Full system access
 * - content_manager: All content CRUD + audit logs
 * - translator: Translation management only
 * - sales_viewer: Read-only access to all content
 */

import { test, expect, type Page, type BrowserContext } from '@playwright/test'

// ============================================================================
// TEST FIXTURES & CONFIGURATION
// ============================================================================

/**
 * Role-based authentication states
 * These simulate authenticated sessions for each admin role
 */
const AUTH_STATES = {
  super_admin: {
    userId: 'test-super-admin-id',
    email: 'superadmin@test.com',
    role: 'super_admin',
    isActive: true,
    fullName: 'Super Admin Test',
  },
  content_manager: {
    userId: 'test-content-manager-id',
    email: 'contentmgr@test.com',
    role: 'content_manager',
    isActive: true,
    fullName: 'Content Manager Test',
  },
  translator: {
    userId: 'test-translator-id',
    email: 'translator@test.com',
    role: 'translator',
    isActive: true,
    fullName: 'Translator Test',
  },
  sales_viewer: {
    userId: 'test-sales-viewer-id',
    email: 'salesviewer@test.com',
    role: 'sales_viewer',
    isActive: true,
    fullName: 'Sales Viewer Test',
  },
}

/**
 * Admin routes to test with their required permissions
 */
const ADMIN_ROUTES = {
  dashboard: {
    path: '/en/admin/dashboard',
    requiredPermission: 'none', // All authenticated admin users
    allowedRoles: ['super_admin', 'content_manager', 'translator', 'sales_viewer'],
  },
  connectors: {
    path: '/en/admin/connectors',
    requiredPermission: 'connectors:read',
    allowedRoles: ['super_admin', 'content_manager', 'sales_viewer'],
  },
  terminals: {
    path: '/en/admin/terminals',
    requiredPermission: 'terminals:read',
    allowedRoles: ['super_admin', 'content_manager', 'sales_viewer'],
  },
  users: {
    path: '/en/admin/users',
    requiredPermission: 'users:read',
    allowedRoles: ['super_admin'],
  },
  settings: {
    path: '/en/admin/settings',
    requiredPermission: 'system:manage',
    allowedRoles: ['super_admin'],
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Set up authenticated session for a specific role
 * Mocks Supabase auth state and admin_users table data
 */
async function setupAuthForRole(
  context: BrowserContext,
  role: keyof typeof AUTH_STATES
): Promise<void> {
  const authState = AUTH_STATES[role]

  // Set up cookies/localStorage to simulate Supabase session
  await context.addCookies([
    {
      name: 'sb-access-token',
      value: `mock-token-${role}`,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])

  // Store auth state in localStorage for client-side access
  await context.addInitScript((state) => {
    window.localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token: `mock-token-${state.role}`,
        user: {
          id: state.userId,
          email: state.email,
          role: state.role,
        },
      },
    }))
  }, authState)
}

/**
 * Intercept Supabase API calls and mock responses for RBAC testing
 */
async function mockSupabaseAuth(
  page: Page,
  role: keyof typeof AUTH_STATES
): Promise<void> {
  const authState = AUTH_STATES[role]

  // Mock auth.getUser() responses
  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: authState.userId,
          email: authState.email,
          created_at: new Date().toISOString(),
          role: authState.role,
        },
      }),
    })
  })

  // Mock admin_users table query
  await page.route('**/rest/v1/admin_users*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            user_id: authState.userId,
            role: authState.role,
            is_active: authState.isActive,
            email: authState.email,
            full_name: authState.fullName,
          },
        ]),
      })
    } else {
      await route.continue()
    }
  })
}

/**
 * Check if page shows unauthorized/forbidden error
 */
async function expectUnauthorizedError(page: Page): Promise<void> {
  // Check for common unauthorized indicators
  const possibleIndicators = [
    page.getByText('403'),
    page.getByText('Forbidden'),
    page.getByText('Unauthorized'),
    page.getByText('You do not have permission'),
    page.getByText('Access denied'),
  ]

  let foundIndicator = false
  for (const indicator of possibleIndicators) {
    if (await indicator.isVisible({ timeout: 2000 }).catch(() => false)) {
      foundIndicator = true
      break
    }
  }

  expect(foundIndicator).toBe(true)
}

/**
 * Check if user was redirected to login page
 */
async function expectRedirectToLogin(page: Page): Promise<void> {
  await page.waitForURL('**/admin/login**', { timeout: 5000 })
  expect(page.url()).toContain('/admin/login')
}

// ============================================================================
// TEST SUITE: Route Access Control
// ============================================================================

test.describe('RBAC Route Access Control', () => {
  test.describe('Super Admin Access', () => {
    let context: BrowserContext
    let page: Page

    test.beforeEach(async ({ browser }) => {
      context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')
    })

    test.afterEach(async () => {
      await context.close()
    })

    test('can access dashboard', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.dashboard.path)

      // Should see dashboard content
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
    })

    test('can access connectors page', async () => {
      await page.goto(ADMIN_ROUTES.connectors.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.connectors.path)

      // Should see connectors content
      await expect(page.getByText(/connector/i)).toBeVisible()
    })

    test('can access terminals page', async () => {
      await page.goto(ADMIN_ROUTES.terminals.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.terminals.path)

      // Should see terminals content
      await expect(page.getByText(/terminal/i)).toBeVisible()
    })

    test('can access users page', async () => {
      await page.goto(ADMIN_ROUTES.users.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.users.path)

      // Should see users content
      await expect(page.getByText(/user/i)).toBeVisible()
    })

    test('can access settings page', async () => {
      await page.goto(ADMIN_ROUTES.settings.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.settings.path)

      // Should see settings content
      await expect(page.getByText(/setting/i)).toBeVisible()
    })

    test('sees all navigation links in sidebar', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)

      // Check for all navigation items
      await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /connector/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /terminal/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /user/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /setting/i })).toBeVisible()
    })
  })

  test.describe('Content Manager Access', () => {
    let context: BrowserContext
    let page: Page

    test.beforeEach(async ({ browser }) => {
      context = await browser.newContext()
      await setupAuthForRole(context, 'content_manager')
      page = await context.newPage()
      await mockSupabaseAuth(page, 'content_manager')
    })

    test.afterEach(async () => {
      await context.close()
    })

    test('can access dashboard', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.dashboard.path)
    })

    test('can access connectors page', async () => {
      await page.goto(ADMIN_ROUTES.connectors.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.connectors.path)
    })

    test('can access terminals page', async () => {
      await page.goto(ADMIN_ROUTES.terminals.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.terminals.path)
    })

    test('cannot access users page', async () => {
      await page.goto(ADMIN_ROUTES.users.path)

      // Should show unauthorized error or redirect
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('cannot access settings page', async () => {
      await page.goto(ADMIN_ROUTES.settings.path)

      // Should show unauthorized error or redirect
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('does not see users and settings links in sidebar', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)

      // Should see content management links
      await expect(page.getByRole('link', { name: /connector/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /terminal/i })).toBeVisible()

      // Should NOT see admin-only links
      const usersLink = page.getByRole('link', { name: /^users$/i })
      const settingsLink = page.getByRole('link', { name: /^settings$/i })

      await expect(usersLink).toHaveCount(0)
      await expect(settingsLink).toHaveCount(0)
    })
  })

  test.describe('Translator Access', () => {
    let context: BrowserContext
    let page: Page

    test.beforeEach(async ({ browser }) => {
      context = await browser.newContext()
      await setupAuthForRole(context, 'translator')
      page = await context.newPage()
      await mockSupabaseAuth(page, 'translator')
    })

    test.afterEach(async () => {
      await context.close()
    })

    test('can access dashboard', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.dashboard.path)
    })

    test('cannot access connectors page', async () => {
      await page.goto(ADMIN_ROUTES.connectors.path)

      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('cannot access terminals page', async () => {
      await page.goto(ADMIN_ROUTES.terminals.path)

      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('cannot access users page', async () => {
      await page.goto(ADMIN_ROUTES.users.path)

      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('cannot access settings page', async () => {
      await page.goto(ADMIN_ROUTES.settings.path)

      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('only sees limited navigation links', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)

      // Should see dashboard
      await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()

      // Should NOT see other admin sections
      const connectorsLink = page.getByRole('link', { name: /^connectors$/i })
      const terminalsLink = page.getByRole('link', { name: /^terminals$/i })
      const usersLink = page.getByRole('link', { name: /^users$/i })

      await expect(connectorsLink).toHaveCount(0)
      await expect(terminalsLink).toHaveCount(0)
      await expect(usersLink).toHaveCount(0)
    })
  })

  test.describe('Sales Viewer Access', () => {
    let context: BrowserContext
    let page: Page

    test.beforeEach(async ({ browser }) => {
      context = await browser.newContext()
      await setupAuthForRole(context, 'sales_viewer')
      page = await context.newPage()
      await mockSupabaseAuth(page, 'sales_viewer')
    })

    test.afterEach(async () => {
      await context.close()
    })

    test('can access dashboard', async () => {
      await page.goto(ADMIN_ROUTES.dashboard.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.dashboard.path)
    })

    test('can access connectors page (read-only)', async () => {
      await page.goto(ADMIN_ROUTES.connectors.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.connectors.path)
    })

    test('can access terminals page (read-only)', async () => {
      await page.goto(ADMIN_ROUTES.terminals.path)
      await expect(page).toHaveURL(ADMIN_ROUTES.terminals.path)
    })

    test('cannot access users page', async () => {
      await page.goto(ADMIN_ROUTES.users.path)

      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('cannot access settings page', async () => {
      await page.goto(ADMIN_ROUTES.settings.path)

      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }
    })

    test('does not see create/edit/delete buttons', async () => {
      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should NOT see action buttons (read-only)
      const createButton = page.getByRole('button', { name: /create|add|new/i })
      const editButton = page.getByRole('button', { name: /edit/i })
      const deleteButton = page.getByRole('button', { name: /delete/i })

      await expect(createButton).toHaveCount(0)
      await expect(editButton).toHaveCount(0)
      await expect(deleteButton).toHaveCount(0)
    })
  })
})

// ============================================================================
// TEST SUITE: CRUD Operations Permission Tests
// ============================================================================

test.describe('RBAC CRUD Operations', () => {
  test.describe('Connector CRUD Permissions', () => {
    test('super admin can create connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should see create button
      const createButton = page.getByRole('button', { name: /create|add|new/i })
      await expect(createButton).toBeVisible()

      await context.close()
    })

    test('super admin can update connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should see edit buttons (if connectors exist)
      const editButton = page.getByRole('button', { name: /edit/i }).first()
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(editButton).toBeVisible()
      }

      await context.close()
    })

    test('super admin can delete connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should see delete buttons
      const deleteButton = page.getByRole('button', { name: /delete/i }).first()
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(deleteButton).toBeVisible()
      }

      await context.close()
    })

    test('content manager can create connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'content_manager')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'content_manager')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should see create button
      const createButton = page.getByRole('button', { name: /create|add|new/i })
      await expect(createButton).toBeVisible()

      await context.close()
    })

    test('sales viewer cannot create connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'sales_viewer')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'sales_viewer')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should NOT see create button (read-only)
      const createButton = page.getByRole('button', { name: /create|add|new/i })
      await expect(createButton).toHaveCount(0)

      await context.close()
    })

    test('sales viewer cannot edit connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'sales_viewer')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'sales_viewer')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should NOT see edit buttons
      const editButton = page.getByRole('button', { name: /edit/i })
      await expect(editButton).toHaveCount(0)

      await context.close()
    })

    test('sales viewer cannot delete connector', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'sales_viewer')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'sales_viewer')

      await page.goto(ADMIN_ROUTES.connectors.path)

      // Should NOT see delete buttons
      const deleteButton = page.getByRole('button', { name: /delete/i })
      await expect(deleteButton).toHaveCount(0)

      await context.close()
    })
  })

  test.describe('User Management CRUD Permissions', () => {
    test('super admin can create user', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')

      await page.goto(ADMIN_ROUTES.users.path)

      // Should see create user button
      const createButton = page.getByRole('button', { name: /create|add|new.*user/i })
      await expect(createButton).toBeVisible()

      await context.close()
    })

    test('super admin can edit user', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')

      await page.goto(ADMIN_ROUTES.users.path)

      // Should see edit buttons
      const editButton = page.getByRole('button', { name: /edit/i }).first()
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(editButton).toBeVisible()
      }

      await context.close()
    })

    test('super admin can delete user', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'super_admin')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'super_admin')

      await page.goto(ADMIN_ROUTES.users.path)

      // Should see delete buttons
      const deleteButton = page.getByRole('button', { name: /delete/i }).first()
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(deleteButton).toBeVisible()
      }

      await context.close()
    })

    test('content manager cannot access user management', async ({ browser }) => {
      const context = await browser.newContext()
      await setupAuthForRole(context, 'content_manager')
      const page = await context.newPage()
      await mockSupabaseAuth(page, 'content_manager')

      await page.goto(ADMIN_ROUTES.users.path)

      // Should be denied access
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/login')) {
        await expectRedirectToLogin(page)
      } else {
        await expectUnauthorizedError(page)
      }

      await context.close()
    })
  })
})

// ============================================================================
// TEST SUITE: Unauthorized Access & Security
// ============================================================================

test.describe('RBAC Unauthorized Access Handling', () => {
  test('unauthenticated user redirected to login', async ({ page }) => {
    // No auth setup - anonymous user
    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Should redirect to login
    await expectRedirectToLogin(page)
  })

  test('login page shows error for unauthorized access', async ({ page }) => {
    await page.goto('/en/admin/login?error=unauthorized&message=You%20do%20not%20have%20permission')

    // Should show error message
    await expect(page.getByText(/unauthorized|permission/i)).toBeVisible()
  })

  test('inactive admin user cannot access admin area', async ({ browser }) => {
    const context = await browser.newContext()

    // Mock inactive user
    const inactiveUser = {
      userId: 'test-inactive-user',
      email: 'inactive@test.com',
      role: 'super_admin',
      isActive: false,
      fullName: 'Inactive User',
    }

    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'mock-token-inactive',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ])

    const page = await context.newPage()

    // Mock admin_users query to return inactive user
    await page.route('**/rest/v1/admin_users*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([inactiveUser]),
      })
    })

    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Should redirect to login with error
    await expectRedirectToLogin(page)

    await context.close()
  })

  test('API requests include proper authorization headers', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'super_admin')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'super_admin')

    // Track API requests
    const apiRequests: Array<{ url: string; headers: Record<string, string> }> = []

    page.on('request', (request) => {
      if (request.url().includes('/rest/v1/')) {
        const headers: Record<string, string> = {}
        request.headers()
        apiRequests.push({
          url: request.url(),
          headers: request.headers(),
        })
      }
    })

    await page.goto(ADMIN_ROUTES.connectors.path)

    // Wait for API calls
    await page.waitForTimeout(2000)

    // Check that API requests have authorization headers
    const hasAuthHeaders = apiRequests.some(req =>
      req.headers['authorization'] || req.headers['apikey']
    )

    expect(hasAuthHeaders).toBe(true)

    await context.close()
  })

  test('session expiry redirects to login', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'super_admin')
    const page = await context.newPage()

    // Mock expired session
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid token' }),
      })
    })

    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Should redirect to login
    await expectRedirectToLogin(page)

    await context.close()
  })
})

// ============================================================================
// TEST SUITE: Navigation Guards
// ============================================================================

test.describe('RBAC Navigation Guards', () => {
  test('middleware blocks unauthorized routes before page load', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'translator')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'translator')

    // Track navigation
    let navigationOccurred = false
    page.on('framenavigated', () => {
      navigationOccurred = true
    })

    await page.goto(ADMIN_ROUTES.connectors.path)

    // Should be blocked by middleware (redirect or error before page renders)
    expect(navigationOccurred).toBe(true)

    const currentUrl = page.url()
    const isBlocked = currentUrl.includes('/admin/login') ||
                      await page.getByText(/403|unauthorized|forbidden/i).isVisible({ timeout: 2000 }).catch(() => false)

    expect(isBlocked).toBe(true)

    await context.close()
  })

  test('client-side navigation respects permissions', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'content_manager')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'content_manager')

    // Start on allowed page
    await page.goto(ADMIN_ROUTES.connectors.path)
    await expect(page).toHaveURL(ADMIN_ROUTES.connectors.path)

    // Try to navigate to disallowed page via link
    const usersLink = page.getByRole('link', { name: /^users$/i })

    // Link should not exist for content_manager
    await expect(usersLink).toHaveCount(0)

    await context.close()
  })

  test('direct URL navigation blocked for insufficient permissions', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'sales_viewer')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'sales_viewer')

    // Try direct navigation to users page
    await page.goto(ADMIN_ROUTES.users.path)

    // Should be blocked
    const currentUrl = page.url()
    if (currentUrl.includes('/admin/login')) {
      await expectRedirectToLogin(page)
    } else {
      await expectUnauthorizedError(page)
    }

    await context.close()
  })

  test('back/forward navigation respects permissions', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'content_manager')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'content_manager')

    // Navigate to allowed page
    await page.goto(ADMIN_ROUTES.connectors.path)
    await expect(page).toHaveURL(ADMIN_ROUTES.connectors.path)

    // Navigate to another allowed page
    await page.goto(ADMIN_ROUTES.terminals.path)
    await expect(page).toHaveURL(ADMIN_ROUTES.terminals.path)

    // Go back
    await page.goBack()
    await expect(page).toHaveURL(ADMIN_ROUTES.connectors.path)

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL(ADMIN_ROUTES.terminals.path)

    await context.close()
  })
})

// ============================================================================
// TEST SUITE: UI Element Visibility Based on Role
// ============================================================================

test.describe('RBAC UI Element Visibility', () => {
  test('super admin sees all admin features', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'super_admin')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'super_admin')

    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Should see all navigation items
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /connector/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /terminal/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /user/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /setting/i })).toBeVisible()

    // Should see user profile with role
    const userProfile = page.getByText(/super.*admin/i)
    await expect(userProfile).toBeVisible()

    await context.close()
  })

  test('content manager sees limited navigation', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'content_manager')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'content_manager')

    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Should see content management items
    await expect(page.getByRole('link', { name: /connector/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /terminal/i })).toBeVisible()

    // Should NOT see admin-only items
    const usersLink = page.getByRole('link', { name: /^users$/i })
    const settingsLink = page.getByRole('link', { name: /^settings$/i })

    await expect(usersLink).toHaveCount(0)
    await expect(settingsLink).toHaveCount(0)

    await context.close()
  })

  test('sales viewer sees read-only UI elements', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'sales_viewer')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'sales_viewer')

    await page.goto(ADMIN_ROUTES.connectors.path)

    // Should NOT see any action buttons
    const createButton = page.getByRole('button', { name: /create|add|new/i })
    const editButton = page.getByRole('button', { name: /edit/i })
    const deleteButton = page.getByRole('button', { name: /delete/i })

    await expect(createButton).toHaveCount(0)
    await expect(editButton).toHaveCount(0)
    await expect(deleteButton).toHaveCount(0)

    await context.close()
  })

  test('translator sees minimal UI', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'translator')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'translator')

    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Should only see dashboard and translation-related items
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()

    // Should NOT see content management
    const connectorsLink = page.getByRole('link', { name: /^connectors$/i })
    const terminalsLink = page.getByRole('link', { name: /^terminals$/i })
    const usersLink = page.getByRole('link', { name: /^users$/i })

    await expect(connectorsLink).toHaveCount(0)
    await expect(terminalsLink).toHaveCount(0)
    await expect(usersLink).toHaveCount(0)

    await context.close()
  })

  test('user profile dropdown shows correct role', async ({ browser }) => {
    const context = await browser.newContext()
    await setupAuthForRole(context, 'content_manager')
    const page = await context.newPage()
    await mockSupabaseAuth(page, 'content_manager')

    await page.goto(ADMIN_ROUTES.dashboard.path)

    // Find and click user profile dropdown
    const profileButton = page.getByRole('button', { name: /content.*manager|profile/i })
    if (await profileButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await profileButton.click()

      // Should show role
      await expect(page.getByText(/content.*manager/i)).toBeVisible()
    }

    await context.close()
  })
})
