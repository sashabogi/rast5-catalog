-- Script to create an admin user
-- INSTRUCTIONS:
-- 1. First, create a user in Supabase Auth (via Dashboard or API)
-- 2. Get the user's UUID from the auth.users table
-- 3. Replace 'YOUR_USER_UUID_HERE' below with the actual UUID
-- 4. Run this script in Supabase SQL Editor

-- Example: Create user via SQL (optional - can also use Dashboard)
-- This will only work if you have direct access to auth schema
/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), -- This will be your user UUID
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
*/

-- Step 1: Assign admin role to existing user
-- Replace YOUR_USER_UUID_HERE with the actual user UUID
INSERT INTO public.user_roles (user_id, role)
VALUES (
  'YOUR_USER_UUID_HERE',  -- Replace with actual UUID
  'admin'
)
ON CONFLICT (user_id)
DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Step 2: Verify the admin user was created
SELECT
  ur.id,
  ur.user_id,
  ur.role,
  au.email,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin';

-- Step 3: Test the is_admin function
-- Replace YOUR_USER_UUID_HERE with the actual user UUID
SELECT public.is_admin('YOUR_USER_UUID_HERE') as is_admin;

-- NOTES:
-- - The user must exist in auth.users before running this script
-- - If you get an error, ensure the migration 20250108000000_add_admin_roles.sql was run first
-- - For security, always use strong passwords and enable email confirmation in production
