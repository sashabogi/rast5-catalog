# E2E Tests - Quick Reference Guide

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test login-flow.spec.ts
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```

### Run Single Test by Name
```bash
npx playwright test -g "should lock account after 5 failed attempts"
```

### Debug Mode
```bash
npx playwright test --debug
```

### Generate and View HTML Report
```bash
npx playwright test
npx playwright show-report
```

## Test Files

### `/tests/e2e/login-flow.spec.ts`
Comprehensive tests for admin login flow with rate limiting:
- Basic authentication (6 tests)
- Successful login flow (3 tests)
- Rate limiting enforcement (7 tests)
- Lockout timer behavior (3 tests)
- Rate limit reset (2 tests)
- Cross-tab behavior (2 tests)
- Session persistence (2 tests)
- Network requests (3 tests)
- Error message display (5 tests)
- Accessibility (3 tests)
- Responsive design (3 tests)

**Total: 39 unique tests**

### `/tests/e2e/error-handling.spec.ts`
Comprehensive tests for error handling and error boundaries:
- Network errors (5 tests)
- Database/Supabase errors (3 tests)
- Authentication errors (4 tests)
- Permission errors (3 tests)
- Form validation errors (5 tests)
- Runtime errors (4 tests)
- Error Boundary behavior (6 tests)
- Error recovery (4 tests)
- Toast/Notification errors (3 tests)
- Production vs Development (2 tests)
- Rate limiting (2 tests)

**Total: 41 unique tests**

**Documentation**:
- [Error Handling Test Summary](./ERROR_HANDLING_TEST_SUMMARY.md)
- [Error Handling Quick Reference](./ERROR_HANDLING_QUICK_REFERENCE.md)

### `/tests/e2e/rbac-enforcement.spec.ts`
Tests role-based access control and permission enforcement.

### `/tests/e2e/user-management.spec.ts`
Tests user CRUD operations and management features.

## Test Structure

```typescript
test.describe('Test Group', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  })

  test('should do something', async ({ page }) => {
    // Test implementation
  })
})
```

## Common Playwright Patterns

### Navigation
```typescript
await page.goto('/en/admin/login')
await page.waitForURL('/admin/dashboard')
```

### Element Selection
```typescript
await page.getByRole('button', { name: /sign in/i })
await page.getByLabel(/email/i)
await page.getByPlaceholder(/admin@example.com/i)
await page.getByText(/too many login attempts/i)
```

### User Interactions
```typescript
await page.getByLabel(/email/i).fill('admin@example.com')
await page.getByRole('button').click()
await page.keyboard.press('Enter')
```

### Assertions
```typescript
await expect(page.getByRole('heading')).toBeVisible()
await expect(page.getByRole('button')).toBeDisabled()
await expect(page).toHaveURL('/admin/dashboard')
```

### Waiting
```typescript
await page.waitForTimeout(1000)
await page.waitForSelector('.loading')
await page.waitForLoadState('networkidle')
```

## Test Data Configuration

Tests use these credentials:
- **Valid Admin Email**: `admin@example.com`
- **Valid Admin Password**: `SecurePassword123!`
- **Invalid Email**: `wrong@example.com`
- **Invalid Password**: `wrongpassword`

Rate limiting settings:
- **Max Attempts**: 5
- **Lockout Duration**: 15 minutes

## Environment Setup

### Prerequisites
1. Node.js installed
2. Playwright installed: `npm install`
3. Browsers installed: `npx playwright install`

### Environment Variables
Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Start Dev Server
Tests automatically start dev server (configured in `playwright.config.ts`)

Or start manually:
```bash
npm run dev
```

## Debugging Tests

### Visual Debugging
```bash
npx playwright test --debug
```

### Trace Viewer
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Screenshots on Failure
Automatically captured in `test-results/` directory

### Verbose Output
```bash
npx playwright test --reporter=list
```

## Best Practices

### 1. Test Isolation
- Clear storage between tests
- Don't rely on test execution order
- Use `beforeEach()` for setup

### 2. Selectors
- Prefer semantic selectors: `getByRole()`, `getByLabel()`
- Avoid CSS selectors when possible
- Use accessible locators

### 3. Assertions
- Use `expect()` from `@playwright/test`
- Add meaningful timeout values
- Test both positive and negative scenarios

### 4. Async/Await
- Always await page interactions
- Use `waitFor()` for dynamic content
- Handle promises properly

### 5. Error Handling
- Use `.catch()` for expected failures
- Document backend dependencies
- Test error states

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Troubleshooting

### Tests Failing
1. Check dev server is running
2. Verify environment variables
3. Clear browser storage
4. Update Playwright: `npm install @playwright/test@latest`

### Timeout Errors
1. Increase timeout in test: `{ timeout: 30000 }`
2. Check network speed
3. Verify selectors are correct

### Element Not Found
1. Wait for element to appear
2. Check selector is correct
3. Verify page loaded completely

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Generation](https://playwright.dev/docs/codegen)

## Test Coverage Report

Run tests with coverage:
```bash
npm run test:e2e
```

View HTML report:
```bash
npx playwright show-report
```

## Contributing

When adding new tests:
1. Follow existing test structure
2. Use helper functions for common operations
3. Add descriptive test names
4. Document backend dependencies
5. Test on all browsers
6. Update this README

## Questions?

For issues or questions about E2E tests, refer to:
- `E2E_LOGIN_TESTS_SUMMARY.md` - Comprehensive test documentation
- `playwright.config.ts` - Playwright configuration
- Project documentation in repository root
