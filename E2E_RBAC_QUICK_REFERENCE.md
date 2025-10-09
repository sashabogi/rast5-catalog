# E2E RBAC Test Suite - Quick Reference

**File:** `/tests/e2e/rbac-enforcement.spec.ts`

---

## Quick Start

### Run All Tests
```bash
npm run test:e2e tests/e2e/rbac-enforcement.spec.ts
```

### Run in UI Mode (Debugging)
```bash
npm run test:e2e:ui tests/e2e/rbac-enforcement.spec.ts
```

### Run Specific Suite
```bash
# Route access tests
npx playwright test --grep "Route Access Control"

# CRUD permission tests
npx playwright test --grep "CRUD Operations"

# Security tests
npx playwright test --grep "Unauthorized Access"

# Navigation guard tests
npx playwright test --grep "Navigation Guards"

# UI visibility tests
npx playwright test --grep "UI Element Visibility"
```

### Run Tests for Specific Role
```bash
npx playwright test --grep "Super Admin"
npx playwright test --grep "Content Manager"
npx playwright test --grep "Translator"
npx playwright test --grep "Sales Viewer"
```

---

## Test Statistics

| Metric | Count |
|--------|-------|
| **Total Test Cases** | 49 |
| **Test Suites** | 11 |
| **Lines of Code** | 1,017 |
| **Browser Variants** | 3 (Chromium, Firefox, WebKit) |
| **Total Executions** | 147 (49 × 3 browsers) |

---

## Test Breakdown

### By Category

```
Route Access Control        20 tests
CRUD Operations            12 tests
Unauthorized Access         6 tests
Navigation Guards           4 tests
UI Element Visibility       7 tests
                          ──────────
TOTAL                      49 tests
```

### By Role

```
super_admin                12 tests
content_manager            10 tests
translator                  6 tests
sales_viewer                8 tests
security/anonymous         13 tests
                          ──────────
TOTAL                      49 tests
```

---

## Permission Matrix

| Role | Dashboard | Connectors | Terminals | Users | Settings |
|------|-----------|------------|-----------|-------|----------|
| **super_admin** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **content_manager** | ✅ Full | ✅ Full | ✅ Full | ❌ None | ❌ None |
| **translator** | ✅ View | ❌ None | ❌ None | ❌ None | ❌ None |
| **sales_viewer** | ✅ View | 👁️ Read | 👁️ Read | ❌ None | ❌ None |

**Legend:**
- ✅ Full = CREATE, READ, UPDATE, DELETE
- 👁️ Read = READ only
- ❌ None = Access denied

---

## CRUD Permission Tests

### Connectors
- ✅ Super admin: CREATE, UPDATE, DELETE
- ✅ Content manager: CREATE, UPDATE, DELETE
- ✅ Sales viewer: READ only (no action buttons)
- ❌ Translator: No access

### Terminals
- ✅ Super admin: CREATE, UPDATE, DELETE
- ✅ Content manager: CREATE, UPDATE, DELETE
- ✅ Sales viewer: READ only (no action buttons)
- ❌ Translator: No access

### Users
- ✅ Super admin: CREATE, UPDATE, DELETE
- ❌ All other roles: No access

### Settings
- ✅ Super admin: Full access
- ❌ All other roles: No access

---

## Security Test Scenarios

1. **Unauthenticated Access**
   - Anonymous users → Redirect to login

2. **Inactive Admin Users**
   - Inactive users → Denied access

3. **Expired Sessions**
   - Expired tokens → Redirect to login

4. **Invalid Tokens**
   - Invalid auth → Rejected

5. **Middleware Protection**
   - Routes blocked before page load

6. **API Authorization**
   - Headers validated on all requests

---

## Helper Functions

### `setupAuthForRole(context, role)`
Configure authenticated session for testing

**Usage:**
```typescript
await setupAuthForRole(context, 'super_admin')
```

### `mockSupabaseAuth(page, role)`
Mock Supabase API responses

**Usage:**
```typescript
await mockSupabaseAuth(page, 'content_manager')
```

### `expectUnauthorizedError(page)`
Assert 403/Forbidden error displayed

**Usage:**
```typescript
await expectUnauthorizedError(page)
```

### `expectRedirectToLogin(page)`
Assert redirect to login page

**Usage:**
```typescript
await expectRedirectToLogin(page)
```

---

## Common Patterns

### Test Template for Route Access
```typescript
test('role can access page', async ({ browser }) => {
  const context = await browser.newContext()
  await setupAuthForRole(context, 'role_name')
  const page = await context.newPage()
  await mockSupabaseAuth(page, 'role_name')

  await page.goto('/en/admin/page-path')
  await expect(page).toHaveURL('/en/admin/page-path')

  await context.close()
})
```

### Test Template for CRUD Operations
```typescript
test('role can perform action', async ({ browser }) => {
  const context = await browser.newContext()
  await setupAuthForRole(context, 'role_name')
  const page = await context.newPage()
  await mockSupabaseAuth(page, 'role_name')

  await page.goto('/en/admin/page-path')

  const actionButton = page.getByRole('button', { name: /action/i })
  await expect(actionButton).toBeVisible()

  await context.close()
})
```

### Test Template for Denied Access
```typescript
test('role cannot access page', async ({ browser }) => {
  const context = await browser.newContext()
  await setupAuthForRole(context, 'role_name')
  const page = await context.newPage()
  await mockSupabaseAuth(page, 'role_name')

  await page.goto('/en/admin/restricted-page')

  const currentUrl = page.url()
  if (currentUrl.includes('/admin/login')) {
    await expectRedirectToLogin(page)
  } else {
    await expectUnauthorizedError(page)
  }

  await context.close()
})
```

---

## Debugging Tests

### Run Single Test
```bash
npx playwright test --grep "super admin can access dashboard"
```

### Run with Headed Browser
```bash
npx playwright test --headed tests/e2e/rbac-enforcement.spec.ts
```

### Run with Debug Mode
```bash
npx playwright test --debug tests/e2e/rbac-enforcement.spec.ts
```

### Generate Trace
```bash
npx playwright test --trace on tests/e2e/rbac-enforcement.spec.ts
npx playwright show-trace trace.zip
```

### View Test Report
```bash
npx playwright test tests/e2e/rbac-enforcement.spec.ts
npx playwright show-report
```

---

## Extending Tests

### Add New Role Test
1. Add role to `AUTH_STATES` object
2. Create new `test.describe` block
3. Add route access tests
4. Add CRUD permission tests
5. Update permission matrix

### Add New Route Test
1. Add route to `ADMIN_ROUTES` object
2. Add tests for each role
3. Test CRUD operations
4. Test UI element visibility

### Add New Permission Test
1. Identify permission to test
2. Add test in CRUD Operations suite
3. Test for allowed roles
4. Test for denied roles

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E RBAC Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e tests/e2e/rbac-enforcement.spec.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Troubleshooting

### Tests Fail with "Element not found"
- Check if page is fully loaded
- Increase timeout values
- Verify selectors match actual UI

### Tests Fail with "Navigation timeout"
- Check if dev server is running
- Verify baseURL in playwright.config.ts
- Check for console errors in app

### Mock Data Not Working
- Verify Supabase URL patterns in route mocking
- Check auth state matches expected format
- Review console logs for API calls

### Session Not Persisting
- Verify cookie domain matches test environment
- Check localStorage mock implementation
- Ensure context isolation is correct

---

## Best Practices

✅ **Always clean up contexts**
```typescript
test.afterEach(async () => {
  await context.close()
})
```

✅ **Use isolated contexts per test**
```typescript
const context = await browser.newContext()
```

✅ **Mock API responses consistently**
```typescript
await mockSupabaseAuth(page, role)
```

✅ **Handle async operations properly**
```typescript
await page.waitForURL('**/path**')
```

✅ **Assert with clear error messages**
```typescript
expect(hasAuth).toBe(true) // ✓
expect(apiRequests.some(r => r.headers.auth)).toBe(true) // ✓
```

---

## Support

For issues or questions:

1. Check test output and error messages
2. Review Playwright documentation: https://playwright.dev/
3. Verify mock data matches production schema
4. Check middleware.ts for auth logic
5. Review permissions.ts for permission definitions

---

**Last Updated:** 2025-10-09
**Version:** 1.0.0
**Status:** Production Ready
