# Error Handling Tests - Quick Reference Guide

## Quick Test Execution

### Run All Error Handling Tests
```bash
npm run test:e2e tests/e2e/error-handling.spec.ts
```

### Run Specific Test Suites

#### Network Errors
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Network Errors"
```

#### Database/Supabase Errors
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Database/Supabase"
```

#### Authentication Errors
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Authentication Errors"
```

#### Permission Errors
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Permission Errors"
```

#### Form Validation
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Form Validation"
```

#### Runtime Errors
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Runtime Errors"
```

#### Error Boundary
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Error Boundary"
```

#### Error Recovery
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Error Recovery"
```

#### Toast Notifications
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Toast/Notification"
```

#### Rate Limiting
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "Rate Limiting"
```

## Run Individual Tests

### Specific HTTP Error
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "should handle 500"
```

### Session Expiration
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "session expiration"
```

### Error Boundary Display
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "display error boundary UI"
```

### Form Validation
```bash
npx playwright test tests/e2e/error-handling.spec.ts -g "validate email"
```

## Debug Mode

### Run with UI Mode (Visual Debugging)
```bash
npm run test:e2e:ui tests/e2e/error-handling.spec.ts
```

### Run with Inspector (Step-through Debugging)
```bash
npx playwright test tests/e2e/error-handling.spec.ts --debug
```

### Run with Trace Viewer
```bash
npx playwright test tests/e2e/error-handling.spec.ts --trace on
npx playwright show-report
```

## Browser-Specific Testing

### Chrome Only
```bash
npx playwright test tests/e2e/error-handling.spec.ts --project=chromium
```

### Firefox Only
```bash
npx playwright test tests/e2e/error-handling.spec.ts --project=firefox
```

### Safari Only
```bash
npx playwright test tests/e2e/error-handling.spec.ts --project=webkit
```

## Test Error Scenarios

### Error Code Reference

| HTTP Code | Test Name | What It Tests |
|-----------|-----------|---------------|
| 500 | `should handle 500 Internal Server Error` | Server crashes, database errors |
| 503 | `should handle 503 Service Unavailable` | Service down, maintenance mode |
| 408 | `should handle network timeout` | Slow responses, connection issues |
| 401 | `should redirect on session expiration` | Expired JWT, invalid session |
| 403 | `should handle 403 Forbidden` | Permission denied, RBAC |
| 409 | `should handle database constraint violations` | Unique violations, FK constraints |
| 429 | `should handle 429 Too Many Requests` | Rate limiting |
| 504 | `should handle Supabase query timeout` | Database query timeout |

### Supabase Error Codes

| Code | Test | Description |
|------|------|-------------|
| 23505 | Database constraint violations | Unique constraint violation |
| 42501 | RLS policy violations | Row-level security policy |
| PGRST_CONNECTION_ERROR | Supabase connection failure | Database connection issues |

## Common Test Patterns

### Check Error UI Display
```typescript
const hasError = await page.isVisible('text=/error|failed|something went wrong/i')
expect(hasError).toBeTruthy()
```

### Mock API Error
```typescript
await page.route('**/api/endpoint', (route) => {
  route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Error message' })
  })
})
```

### Track Console Errors
```typescript
const errors: string[] = []
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    errors.push(msg.text())
  }
})
```

### Verify Error Toast
```typescript
const hasToast = await page.isVisible('[role="alert"]') ||
                 await page.isVisible('[data-sonner-toast]')
expect(hasToast).toBeTruthy()
```

## Troubleshooting

### Tests Failing?

1. **Check if dev server is running**:
   ```bash
   npm run dev
   ```

2. **Check environment variables**:
   ```bash
   # Ensure .env.local has required Supabase config
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Clear Playwright cache**:
   ```bash
   npx playwright install
   ```

4. **Run single test to debug**:
   ```bash
   npx playwright test tests/e2e/error-handling.spec.ts -g "specific test name" --debug
   ```

### Common Issues

#### Timeout Errors
- Increase timeout in test:
  ```typescript
  test('test name', async ({ page }) => {
    test.setTimeout(60000) // 60 seconds
  })
  ```

#### Element Not Found
- Check if selectors match your UI
- Use `page.pause()` to inspect page during test
- Verify route mocking is working

#### Flaky Tests
- Add explicit waits: `await page.waitForTimeout(1000)`
- Use `page.waitForSelector()` instead of `isVisible()`
- Check for race conditions in async operations

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Error Handling Tests
  run: npm run test:e2e tests/e2e/error-handling.spec.ts
```

### Only Run on Error Handling Changes
```yaml
- name: Check for error handling changes
  id: changed-files
  uses: tj-actions/changed-files@v35
  with:
    files: |
      src/components/admin/ErrorBoundary.tsx
      tests/e2e/error-handling.spec.ts

- name: Run tests
  if: steps.changed-files.outputs.any_changed == 'true'
  run: npm run test:e2e tests/e2e/error-handling.spec.ts
```

## Performance Benchmarks

Expected test execution times:
- **Network Errors**: ~30-45 seconds
- **Database Errors**: ~15-20 seconds
- **Authentication Errors**: ~20-30 seconds
- **Permission Errors**: ~15-20 seconds
- **Form Validation**: ~25-35 seconds
- **Runtime Errors**: ~15-20 seconds
- **Error Boundary**: ~30-40 seconds
- **Error Recovery**: ~20-30 seconds
- **Toast Notifications**: ~15-20 seconds
- **Rate Limiting**: ~10-15 seconds

**Total Suite**: ~4-6 minutes (all 41 tests)

## Test Reports

### View HTML Report
```bash
npx playwright show-report
```

### Generate Custom Report
```bash
npx playwright test tests/e2e/error-handling.spec.ts --reporter=json > error-test-results.json
```

### Screenshots on Failure
Screenshots are automatically saved to `test-results/` on failure.

## Best Practices

1. **Run before committing error handling changes**
2. **Run full suite before releases**
3. **Check error messages are user-friendly**
4. **Verify error logging in console**
5. **Test on multiple browsers**
6. **Update tests when error handling logic changes**
7. **Add new tests for new error scenarios**

## Quick Validation Checklist

Before deploying error handling changes:
- [ ] All 41 tests pass
- [ ] Error messages are user-friendly
- [ ] No stack traces visible in production mode
- [ ] Error boundary catches React errors
- [ ] Network errors don't crash the app
- [ ] Session expiration redirects properly
- [ ] Form validation shows inline errors
- [ ] Rate limiting is respected
- [ ] Retry mechanisms work correctly
- [ ] Error toasts display appropriately

---

**Last Updated**: 2025-10-09
**Total Tests**: 41
**Test Suites**: 11
**Average Execution Time**: 4-6 minutes
