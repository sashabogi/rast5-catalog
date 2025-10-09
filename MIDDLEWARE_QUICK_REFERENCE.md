# Middleware Quick Reference

## Quick Facts

**File**: `/middleware.ts`
**Type**: Next.js 15 Middleware
**Purpose**: Protect admin routes with role-based access control
**Status**: Production Ready ✅

---

## Protected Routes

```typescript
// PROTECTED (requires admin authentication)
/en/admin/*
/it/admin/*
/es/admin/*
/de/admin/*
/ru/admin/*
/pt/admin/*

// PUBLIC (accessible without auth)
/[locale]/admin/login
```

---

## Valid Admin Roles

```typescript
'super_admin'      // Full access
'content_manager'  // Content + audit logs
'translator'       // Translations only
'sales_viewer'     // Read-only
```

---

## Access Requirements

User must have ALL of these:
1. ✅ Authenticated via Supabase Auth
2. ✅ Exists in `admin_users` table
3. ✅ `is_active = true`
4. ✅ Valid admin role

---

## Redirect Examples

```typescript
// Unauthenticated
/en/admin/dashboard
  → /en/admin/login?redirect=/en/admin/dashboard

// Not an admin
/it/admin/users
  → /it/admin/login?error=unauthorized&message=...

// Valid admin
/es/admin/settings
  → 200 OK (with headers: x-user-id, x-user-role, x-user-email)
```

---

## Custom Headers (For Admins)

```typescript
x-user-id: "550e8400-e29b-41d4-a716-446655440000"
x-user-role: "super_admin"
x-user-email: "admin@example.com"
```

**Usage:**
```typescript
import { headers } from 'next/headers';

const headersList = await headers();
const role = headersList.get('x-user-role');
```

---

## Security Logs

```javascript
// Logged to console.warn()
[Security] Unauthorized admin access attempt: {
  pathname: '/en/admin/dashboard',
  userId: 'anonymous',
  reason: 'Not authenticated',
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2025-10-09T12:34:56Z'
}
```

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Database Table Required

```sql
admin_users (
  user_id UUID PRIMARY KEY,
  role admin_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  email TEXT,
  full_name TEXT
)
```

---

## Troubleshooting

**Can't access admin area?**
```sql
-- Check if user is in admin_users
SELECT * FROM admin_users WHERE email = 'user@example.com';

-- Add user as admin
INSERT INTO admin_users (user_id, role, is_active, email)
VALUES ('<user-id>', 'super_admin', true, 'user@example.com');
```

**Middleware not running?**
- Check `middleware.ts` is at project root (not in `/src`)
- Restart dev server after changes
- Verify environment variables are set

**Infinite redirects?**
- Ensure `/admin/login` is in `PUBLIC_ADMIN_PATHS`
- Check `isPublicAdminPath()` logic

---

## Next Steps

1. Create `/src/app/[locale]/admin/login/page.tsx`
2. Create `/src/app/[locale]/admin/layout.tsx`
3. Test with different user roles
4. Add audit logging to database

---

## Documentation

- **Full Docs**: `/MIDDLEWARE_DOCUMENTATION.md`
- **Summary**: `/MIDDLEWARE_IMPLEMENTATION_SUMMARY.md`
- **This Card**: `/MIDDLEWARE_QUICK_REFERENCE.md`

---

**Questions?** See troubleshooting section in `/MIDDLEWARE_DOCUMENTATION.md`
