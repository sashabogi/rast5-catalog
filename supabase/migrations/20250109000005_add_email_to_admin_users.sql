-- =============================================
-- Migration: Add email column to admin_users
-- Phase: Hotfix - Missing column from previous migration
-- Purpose: Add email column that was omitted in 20250109000001
-- =============================================

BEGIN;

-- Add email column to admin_users table
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS email TEXT;

-- Populate email from auth.users for existing records
UPDATE public.admin_users au
SET email = (
    SELECT email
    FROM auth.users
    WHERE id = au.user_id
)
WHERE email IS NULL;

-- Make email NOT NULL after populating
ALTER TABLE public.admin_users
ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email
ALTER TABLE public.admin_users
ADD CONSTRAINT admin_users_email_unique UNIQUE (email);

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

COMMIT;
