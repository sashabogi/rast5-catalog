# Next.js 15 Middleware Documentation

## Overview

This document provides comprehensive documentation for the production-ready Next.js 15 middleware implementation that handles both internationalization (i18n) and admin authentication/authorization.

**File Location:** `/middleware.ts`

**Version:** 1.0.0
**Last Updated:** 2025-10-09

---

## Table of Contents

1. [Architecture](#architecture)
2. [Features](#features)
3. [Flow Diagrams](#flow-diagrams)
4. [Configuration](#configuration)
5. [Security Features](#security-features)
6. [Usage Examples](#usage-examples)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### Middleware Pipeline

The middleware implements a two-stage pipeline:

```
Request → Admin Middleware → i18n Middleware → Application
```

1. **Admin Middleware** (First Stage)
   - Runs only for `/[locale]/admin/*` paths
   - Checks authentication and authorization
   - Validates admin role and active status
   - Redirects unauthorized users
   - Logs security events

2. **i18n Middleware** (Second Stage)
   - Runs for all paths
   - Handles locale detection and routing
   - Manages locale-specific redirects

### Technology Stack

- **Next.js 15**: Latest Next.js with App Router
- **Supabase SSR**: Server-side authentication
- **next-intl**: Internationalization
- **TypeScript**: Type-safe implementation

---

## Features

### 1. Route Protection

Protects all admin routes while allowing public access to login pages:

**Protected Routes:**
- `/en/admin/*`
- `/it/admin/*`
- `/es/admin/*`
- `/de/admin/*`
- `/ru/admin/*`
- `/pt/admin/*`

**Public Routes:**
- `/[locale]/admin/login` - Admin login page

### 2. Multi-Locale Support

Supports 6 languages with automatic locale detection:

| Locale | Language   | Flag |
|--------|------------|------|
| `en`   | English    | 🇬🇧   |
| `it`   | Italiano   | 🇮🇹   |
| `es`   | Español    | 🇪🇸   |
| `de`   | Deutsch    | 🇩🇪   |
| `ru`   | Русский    | 🇷🇺   |
| `pt`   | Português  | 🇵🇹   |

### 3. Role-Based Access Control (RBAC)

Validates user roles against the `admin_users` table:

| Role              | Description                          | Admin Access |
|-------------------|--------------------------------------|--------------|
| `super_admin`     | Full system access                   | ✅           |
| `content_manager` | Manage content and translations      | ✅           |
| `translator`      | Manage translations only             | ✅           |
| `sales_viewer`    | Read-only access to content          | ✅           |

**Validation Criteria:**
- User must exist in `admin_users` table
- `is_active` must be `true`
- `role` must be one of the valid admin roles

### 4. Security Logging

Logs all unauthorized access attempts with:
- User ID (or 'anonymous')
- Pathname attempted
- Reason for denial
- IP address
- User agent
- Timestamp

---

## Flow Diagrams

### Authentication Flow

```
User visits: /en/admin/dashboard
       ↓
Is admin path?
  NO → Run i18n middleware → Allow access
  YES ↓
       ↓
Is public path (login)?
  YES → Run i18n middleware → Allow access
  NO ↓
       ↓
User authenticated?
  NO → Log attempt → Redirect to /en/admin/login?redirect=/en/admin/dashboard
  YES ↓
       ↓
Query admin_users table
       ↓
User exists in admin_users?
  NO → Log attempt → Redirect to /en/admin/login?error=unauthorized
  YES ↓
       ↓
User is_active = true?
  NO → Log attempt → Redirect to /en/admin/login?error=unauthorized
  YES ↓
       ↓
Valid admin role?
  NO → Log attempt → Redirect to /en/admin/login?error=unauthorized
  YES ↓
       ↓
Add custom headers (user-id, role, email)
       ↓
Allow access → Run i18n middleware → Continue to page
```

### Locale Preservation Flow

```
User visits: /it/admin/settings (not authenticated)
       ↓
Extract locale from path: 'it'
       ↓
Redirect to: /it/admin/login?redirect=/it/admin/settings
       ↓
User logs in successfully
       ↓
Redirect to: /it/admin/settings (locale preserved)
```

---

## Configuration

### Environment Variables

Required environment variables (in `.env.local`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Table: `admin_users`

The middleware queries this table to validate admin access:

```sql
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role enum
CREATE TYPE admin_role AS ENUM (
  'super_admin',
  'content_manager',
  'translator',
  'sales_viewer'
);
```

### Middleware Matcher

The middleware runs on these paths:

```typescript
matcher: [
  '/',
  '/(de|en|es|it|ru|pt)/:path*',
  '/((?!api|_next|_vercel|.*\\..*).*)',
]
```

**Excludes:**
- API routes (`/api/*`)
- Next.js internals (`/_next/*`, `/_vercel/*`)
- Static files (any path with a dot, e.g., `favicon.ico`, `image.png`)

---

## Security Features

### 1. Unauthorized Access Logging

All unauthorized access attempts are logged to the console with:

```javascript
{
  pathname: '/en/admin/dashboard',
  userId: 'anonymous' | '<user-id>',
  reason: 'Not authenticated' | 'Not an admin user' | 'Admin user is inactive',
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2025-10-09T12:00:00.000Z'
}
```

**Log Levels:**
- `console.warn()` for unauthorized attempts (security events)
- `console.log()` for successful admin access
- `console.error()` for database errors

### 2. Service Role Client

Uses Supabase service role key to bypass RLS (Row Level Security) for admin checks:

```typescript
const supabase = createSupabaseServiceClient()
// Bypasses RLS to check admin_users table
```

**Why?** Admin checks need to happen before user authorization, so we use the service client that has full database access.

### 3. Custom Headers

Adds custom headers to requests for authorized admin users:

| Header         | Value                    | Purpose                          |
|----------------|--------------------------|----------------------------------|
| `x-user-id`    | User's UUID              | Identify user in admin pages     |
| `x-user-role`  | Admin role               | Display role-specific UI         |
| `x-user-email` | User's email             | Display user info in admin panel |

These headers can be accessed in server components via `headers()`:

```typescript
import { headers } from 'next/headers';

export default async function AdminDashboard() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');

  // Use for role-specific rendering
}
```

### 4. Error Messages

Redirects include error context via query parameters:

**Unauthenticated:**
```
/en/admin/login?redirect=/en/admin/dashboard
```

**Unauthorized (not an admin):**
```
/en/admin/login?error=unauthorized&message=You+do+not+have+permission+to+access+the+admin+area
```

---

## Usage Examples

### Example 1: Accessing Admin Dashboard

```typescript
// User navigates to: /en/admin/dashboard

// Middleware checks:
// 1. Is admin path? YES
// 2. Is public path? NO
// 3. User authenticated? YES
// 4. User in admin_users? YES
// 5. User is_active? YES
// 6. Valid role? YES (super_admin)

// Result: Access granted
// Headers added:
// x-user-id: 12345-67890
// x-user-role: super_admin
// x-user-email: admin@example.com
```

### Example 2: Unauthenticated Access

```typescript
// User navigates to: /it/admin/settings
// User is NOT logged in

// Middleware checks:
// 1. Is admin path? YES
// 2. Is public path? NO
// 3. User authenticated? NO

// Result: Redirect to /it/admin/login?redirect=/it/admin/settings
// Security log: [Security] Unauthorized admin access attempt: { userId: 'anonymous', reason: 'Not authenticated' }
```

### Example 3: Non-Admin User

```typescript
// User navigates to: /de/admin/users
// User IS logged in but NOT in admin_users table

// Middleware checks:
// 1. Is admin path? YES
// 2. Is public path? NO
// 3. User authenticated? YES
// 4. User in admin_users? NO

// Result: Redirect to /de/admin/login?error=unauthorized&message=...
// Security log: [Security] Unauthorized admin access attempt: { userId: '12345', reason: 'User not found in admin_users' }
```

### Example 4: Inactive Admin User

```typescript
// User navigates to: /es/admin/dashboard
// User IS in admin_users but is_active = false

// Middleware checks:
// 1. Is admin path? YES
// 2. Is public path? NO
// 3. User authenticated? YES
// 4. User in admin_users? YES
// 5. User is_active? NO

// Result: Redirect to /es/admin/login?error=unauthorized&message=...
// Security log: [Security] Unauthorized admin access attempt: { userId: '12345', reason: 'Admin user is inactive' }
```

---

## Testing Guide

### Manual Testing

#### Test 1: Access admin area without authentication

```bash
# Expected: Redirect to login
curl -I http://localhost:3000/en/admin/dashboard
# Should return: 307 Redirect
# Location: /en/admin/login?redirect=/en/admin/dashboard
```

#### Test 2: Access admin area with valid admin user

```bash
# 1. Login first to get session cookie
# 2. Then access admin area
curl -I -H "Cookie: sb-access-token=..." http://localhost:3000/en/admin/dashboard
# Should return: 200 OK
```

#### Test 3: Access login page (public)

```bash
# Expected: Allow access (no redirect)
curl -I http://localhost:3000/en/admin/login
# Should return: 200 OK
```

#### Test 4: Locale preservation

```bash
# Access Italian admin area
curl -I http://localhost:3000/it/admin/settings
# Should redirect to: /it/admin/login?redirect=/it/admin/settings
# NOT: /en/admin/login
```

### Automated Testing

Create a test file: `__tests__/middleware.test.ts`

```typescript
import { NextRequest } from 'next/server';
import middleware from '../middleware';

describe('Admin Middleware', () => {
  it('should redirect unauthenticated users to login', async () => {
    const request = new NextRequest('http://localhost:3000/en/admin/dashboard');
    const response = await middleware(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get('location')).toContain('/en/admin/login');
  });

  it('should allow access to login page', async () => {
    const request = new NextRequest('http://localhost:3000/en/admin/login');
    const response = await middleware(request);

    expect(response.status).not.toBe(307);
  });

  it('should preserve locale in redirects', async () => {
    const request = new NextRequest('http://localhost:3000/it/admin/dashboard');
    const response = await middleware(request);

    expect(response.headers.get('location')).toContain('/it/admin/login');
  });
});
```

---

## Troubleshooting

### Issue 1: "Cannot access admin area even with valid credentials"

**Symptoms:**
- User can login successfully
- Gets redirected to login when accessing admin pages

**Possible Causes:**
1. User not in `admin_users` table
2. `is_active` is `false`
3. Invalid role

**Solution:**
```sql
-- Check if user exists in admin_users
SELECT * FROM admin_users WHERE user_id = '<user-id>';

-- Add user to admin_users if missing
INSERT INTO admin_users (user_id, role, is_active, email, full_name)
VALUES ('<user-id>', 'super_admin', true, 'user@example.com', 'User Name');

-- Activate user if inactive
UPDATE admin_users SET is_active = true WHERE user_id = '<user-id>';
```

### Issue 2: "Middleware not running"

**Symptoms:**
- No logs in console
- Admin areas accessible without authentication

**Possible Causes:**
1. Matcher configuration excludes admin paths
2. Middleware file in wrong location

**Solution:**
1. Ensure `middleware.ts` is at project root (not in `/src`)
2. Check matcher includes admin paths:
   ```typescript
   matcher: ['/', '/(de|en|es|it|ru|pt)/:path*', ...]
   ```

### Issue 3: "Environment variables not found"

**Symptoms:**
- Error: "Cannot read property 'NEXT_PUBLIC_SUPABASE_URL'"

**Solution:**
1. Ensure `.env.local` exists at project root
2. Verify all required variables are set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Restart development server after adding env vars

### Issue 4: "Locale detection not working"

**Symptoms:**
- Always defaults to English
- Locale not preserved in redirects

**Possible Causes:**
1. i18n middleware not running
2. Locale detection disabled

**Solution:**
1. Ensure i18n middleware runs after admin middleware
2. Check `localeDetection: true` in middleware config
3. Verify locales defined in `/src/i18n.ts`

### Issue 5: "Too many redirects"

**Symptoms:**
- Browser shows "ERR_TOO_MANY_REDIRECTS"

**Possible Causes:**
1. Login page is protected (not in PUBLIC_ADMIN_PATHS)
2. Infinite redirect loop

**Solution:**
1. Ensure login paths in `PUBLIC_ADMIN_PATHS`:
   ```typescript
   const PUBLIC_ADMIN_PATHS = ['/admin/login'];
   ```
2. Check `isPublicAdminPath()` function correctly identifies login pages

---

## Best Practices

### 1. Security

- **Never** expose service role key in client-side code
- **Always** validate user role on both middleware and API routes
- **Log** all unauthorized access attempts for security auditing
- **Use HTTPS** in production to protect session cookies

### 2. Performance

- Middleware runs on every request - keep it fast
- Use service client only when necessary (bypasses RLS)
- Cache admin user data if needed (consider Redis for high traffic)

### 3. Maintainability

- Keep middleware logic focused on authentication/authorization
- Complex business logic belongs in API routes or server components
- Document any changes to role permissions
- Version control middleware changes carefully

### 4. Error Handling

- Gracefully handle database errors (don't expose internals)
- Provide user-friendly error messages
- Log errors for debugging but don't leak sensitive info

---

## Next Steps

After implementing this middleware, consider:

1. **Create Admin Login Page** (`/src/app/[locale]/admin/login/page.tsx`)
2. **Create Admin Layout** with navigation and user info
3. **Implement Audit Logging** (full audit trail to database)
4. **Add Session Refresh** logic to prevent expired sessions
5. **Create 403 Forbidden Page** for better UX
6. **Add Rate Limiting** to prevent brute force attacks
7. **Implement 2FA** for super_admin accounts

---

## Additional Resources

- [Next.js 15 Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [RBAC Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)

---

## Version History

| Version | Date       | Changes                              |
|---------|------------|--------------------------------------|
| 1.0.0   | 2025-10-09 | Initial implementation               |

---

**Questions or Issues?**
Check the troubleshooting section or review security logs for detailed error information.
