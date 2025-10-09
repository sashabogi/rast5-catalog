# Admin Authentication - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migration

```bash
# Navigate to project directory
cd /Users/sashabogojevic/Documents/GitHub/UPDATED\ Rast\ 5/rast5-catalog

# Apply migration using Supabase CLI
supabase db push
```

**Or manually in Supabase SQL Editor:**
- Open: https://app.supabase.com/project/YOUR_PROJECT/sql
- Copy/paste SQL from: `/supabase/migrations/20250108000000_add_admin_roles.sql`
- Run the migration

### Step 2: Create Admin User

**A. Create User in Supabase Dashboard**
1. Go to: Authentication → Users
2. Click "Add User"
3. Email: `your-email@example.com`
4. Password: `your-secure-password`
5. Copy the User ID (UUID)

**B. Assign Admin Role**

In Supabase SQL Editor, run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('PASTE_USER_UUID_HERE', 'admin');
```

### Step 3: Test Login

```bash
# Start dev server
npm run dev

# Visit admin login
open http://localhost:3000/en/admin/login
```

Login with your credentials → You should see the admin dashboard!

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/src/lib/supabase/server.ts` | Server-side auth utilities |
| `/src/lib/auth/AuthProvider.tsx` | Client auth context |
| `/src/app/[locale]/admin/login/page.tsx` | Login page |
| `/src/app/[locale]/admin/dashboard/page.tsx` | Admin dashboard |
| `/supabase/migrations/20250108000000_add_admin_roles.sql` | Database schema |

---

## 🔐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🌐 Routes

### Public
- `/[locale]/admin/login` - Login page

### Protected (Admin Only)
- `/[locale]/admin/dashboard` - Main dashboard
- `/[locale]/admin/connectors` - Manage connectors
- `/[locale]/admin/terminals` - Manage terminals
- `/[locale]/admin/videos` - Video library
- `/[locale]/admin/translations` - Translations

---

## 🔧 Common Commands

```bash
# Install dependencies (already done)
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Apply Supabase migration
supabase db push

# View Supabase logs
supabase logs
```

---

## 🛠️ Add More Admins

```sql
-- Replace with actual user UUID
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

---

## ❓ Troubleshooting

### Can't login?
1. Check user exists in Supabase Auth
2. Verify user has admin role in `user_roles` table
3. Check environment variables are set

### Access denied?
1. Confirm user_id in user_roles matches auth.users
2. Verify role is exactly 'admin' (lowercase)
3. Check RLS policies are enabled

### Redirect loop?
1. Clear browser cookies
2. Verify Supabase URL and keys in .env.local
3. Check migration was applied successfully

---

## 📚 Full Documentation

- Setup Guide: `/ADMIN_AUTH_SETUP.md`
- Implementation Report: `/ADMIN_AUTH_IMPLEMENTATION_REPORT.md`
- Migration SQL: `/supabase/migrations/20250108000000_add_admin_roles.sql`
- Admin User Script: `/supabase/scripts/create_admin_user.sql`

---

## ✅ Verification Checklist

- [ ] Migration applied to Supabase
- [ ] Admin user created with role
- [ ] Can login at `/en/admin/login`
- [ ] Dashboard loads successfully
- [ ] Logout works correctly
- [ ] Non-admins cannot access admin routes

---

**Need Help?** Check the full documentation or review the implementation report.
