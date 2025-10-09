# Admin Authentication Setup Guide

This guide explains how to set up and use the admin authentication system for the RAST 5 Catalog.

## Overview

The admin authentication system uses Supabase Auth with role-based access control (RBAC). Only users with the 'admin' role can access the admin panel.

## Prerequisites

- Supabase project set up and configured
- Environment variables configured in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Installation Steps

### 1. Install Dependencies

The required dependencies have been installed:
- `@supabase/ssr` - Server-side Supabase client
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation

### 2. Run Database Migration

Apply the user roles migration to your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL file
# Located at: supabase/migrations/20250108000000_add_admin_roles.sql
```

Alternatively, run the SQL directly in Supabase SQL Editor:

```sql
-- See: /supabase/migrations/20250108000000_add_admin_roles.sql
```

This migration creates:
- `user_role` enum type ('admin', 'editor', 'viewer')
- `user_roles` table with RLS policies
- `is_admin()` function for role checking
- Automatic timestamp updates

### 3. Create Your First Admin User

#### Step 1: Sign Up a User in Supabase

Option A - Using Supabase Dashboard:
1. Go to Authentication > Users in Supabase Dashboard
2. Click "Add User"
3. Enter email and password
4. Note the user's UUID

Option B - Using Supabase Auth API:
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'admin@example.com',
  password: 'your-secure-password'
})
```

#### Step 2: Assign Admin Role

Run this SQL in Supabase SQL Editor (replace with your user's UUID):

```sql
-- Replace 'YOUR_USER_UUID' with the actual user UUID
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

Or use the provided script:

```bash
# Located at: /supabase/scripts/create_admin_user.sql
```

### 4. Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin login page:
   ```
   http://localhost:3000/en/admin/login
   ```

3. Log in with your admin credentials

4. You should be redirected to:
   ```
   http://localhost:3000/en/admin/dashboard
   ```

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   └── admin/
│   │       ├── layout.tsx          # Auth check & admin layout
│   │       ├── login/
│   │       │   └── page.tsx        # Login page
│   │       └── dashboard/
│   │           └── page.tsx        # Admin dashboard
│   └── api/
│       └── auth/
│           └── logout/
│               └── route.ts        # Logout API endpoint
├── components/
│   ├── admin/
│   │   └── AdminNavbar.tsx         # Admin navigation
│   └── ui/
│       └── form.tsx                # Form components
├── lib/
│   ├── auth/
│   │   └── AuthProvider.tsx        # Auth context provider
│   └── supabase/
│       ├── client.ts               # Client-side Supabase
│       └── server.ts               # Server-side Supabase
└── types/
    ├── auth.ts                      # Auth types
    └── database.ts                  # Database types

supabase/
└── migrations/
    └── 20250108000000_add_admin_roles.sql
```

## Usage

### Protected Admin Routes

All routes under `/[locale]/admin/*` (except `/admin/login`) are protected and require:
1. Valid authentication
2. 'admin' role in the `user_roles` table

### Authentication Flow

1. User visits `/en/admin/dashboard`
2. Server-side check in `admin/layout.tsx` verifies auth & admin role
3. If not authenticated or not admin → redirect to `/en/admin/login`
4. User logs in with email/password
5. System checks `user_roles` table for admin role
6. If admin → redirect to `/en/admin/dashboard`
7. If not admin → show access denied error

### Adding More Admins

To grant admin access to additional users:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

### Logout

Users can logout from:
- Admin navbar logout button
- API endpoint: `POST /api/auth/logout`

## Security Features

1. **Row Level Security (RLS)**: All user_roles queries are protected by RLS policies
2. **Server-side Auth Checks**: Admin routes verify authentication server-side
3. **Role-based Access**: Only users with 'admin' role can access admin panel
4. **Secure Password Storage**: Supabase Auth handles password hashing
5. **Session Management**: Automatic session refresh with Supabase SSR

## Troubleshooting

### Issue: "Access denied" after login
- Verify the user has an entry in `user_roles` table with role='admin'
- Check Supabase logs for RLS policy errors

### Issue: Redirect loop
- Clear browser cookies and cache
- Verify Supabase environment variables are correct
- Check that migration was applied successfully

### Issue: "User not found" error
- Ensure user exists in Supabase Auth
- Verify email confirmation (if enabled in Supabase Auth settings)

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

1. Customize the admin dashboard layout
2. Add admin pages for:
   - Connector management
   - Terminal management
   - Video library
   - Translation management
3. Implement additional roles (editor, viewer) with granular permissions
4. Add audit logging for admin actions

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review Next.js 15 docs: https://nextjs.org/docs
- Check migration SQL for database schema details
