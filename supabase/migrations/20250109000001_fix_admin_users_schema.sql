-- =============================================
-- Migration: Fix Admin Users Schema
-- Phase: 2 - Work Package 1A (Database Foundation)
-- Purpose: Rename user_roles to admin_users and align with PRD requirements
-- =============================================

-- IMPORTANT: This migration transforms the existing user_roles table
-- into the proper admin_users table per PRD specifications.
-- It maintains backward compatibility during the transition.

BEGIN;

-- =============================================
-- STEP 1: Drop old enum and create new admin_role enum
-- =============================================

-- First, we need to drop constraints and policies that depend on the old enum
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Drop the trigger that updates updated_at
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;

-- Remove the default value from role column first
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;

-- Store existing data temporarily by converting role to text
ALTER TABLE public.user_roles ALTER COLUMN role TYPE TEXT;

-- Drop the old enum (now safe since no dependencies)
DROP TYPE IF EXISTS user_role;

-- Create the new admin_role enum with correct values
CREATE TYPE admin_role AS ENUM (
    'super_admin',
    'content_manager',
    'translator',
    'sales_viewer'
);

-- Add comment to explain enum values
COMMENT ON TYPE admin_role IS 'Admin user roles: super_admin (full access), content_manager (manage content), translator (manage translations), sales_viewer (view sales data)';

-- =============================================
-- STEP 2: Rename table and update schema
-- =============================================

-- Rename the table
ALTER TABLE public.user_roles RENAME TO admin_users;

-- Rename the role column temporarily and add new full_name column
ALTER TABLE public.admin_users RENAME COLUMN role TO role_old;
ALTER TABLE public.admin_users ADD COLUMN role admin_role;

-- Add full_name column (required per PRD)
ALTER TABLE public.admin_users ADD COLUMN full_name TEXT;

-- Migrate existing data with default mappings
-- Map 'admin' -> 'super_admin', 'editor' -> 'content_manager', 'viewer' -> 'sales_viewer'
UPDATE public.admin_users
SET
    role = CASE
        WHEN role_old = 'admin' THEN 'super_admin'::admin_role
        WHEN role_old = 'editor' THEN 'content_manager'::admin_role
        WHEN role_old = 'viewer' THEN 'sales_viewer'::admin_role
        ELSE 'sales_viewer'::admin_role  -- default fallback
    END,
    full_name = COALESCE(
        (SELECT email FROM auth.users WHERE id = user_id),
        'Admin User'
    );

-- Make role NOT NULL and set default
ALTER TABLE public.admin_users ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.admin_users ALTER COLUMN role SET DEFAULT 'sales_viewer'::admin_role;

-- Make full_name NOT NULL (now that we've populated it)
ALTER TABLE public.admin_users ALTER COLUMN full_name SET NOT NULL;

-- Drop the old role_old column
ALTER TABLE public.admin_users DROP COLUMN role_old;

-- Add last_login_at column (per PRD requirements)
ALTER TABLE public.admin_users ADD COLUMN last_login_at TIMESTAMPTZ;

-- Add is_active column (per PRD requirements)
ALTER TABLE public.admin_users ADD COLUMN is_active BOOLEAN DEFAULT true;

-- =============================================
-- STEP 3: Rename indexes
-- =============================================

-- Rename existing indexes
ALTER INDEX IF EXISTS idx_user_roles_user_id RENAME TO idx_admin_users_user_id;
ALTER INDEX IF EXISTS idx_user_roles_role RENAME TO idx_admin_users_role;

-- Add new index for is_active + role combination (per PRD)
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active, role);

-- =============================================
-- STEP 4: Update is_admin() function
-- =============================================

-- Replace the function with new table name and enum (keep same parameter name for compatibility)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE admin_users.user_id = is_admin.user_id
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check admin role level
CREATE OR REPLACE FUNCTION public.has_admin_role(check_user_id UUID, min_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role::TEXT INTO user_role
    FROM public.admin_users
    WHERE user_id = check_user_id
    AND is_active = true;

    -- Role hierarchy: super_admin > content_manager > translator > sales_viewer
    RETURN CASE
        WHEN user_role = 'super_admin' THEN true
        WHEN user_role = 'content_manager' AND min_role IN ('content_manager', 'translator', 'sales_viewer') THEN true
        WHEN user_role = 'translator' AND min_role IN ('translator', 'sales_viewer') THEN true
        WHEN user_role = 'sales_viewer' AND min_role = 'sales_viewer' THEN true
        ELSE false
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.has_admin_role(UUID, TEXT) IS 'Check if user has at least the specified admin role level';

-- =============================================
-- STEP 5: Recreate RLS Policies
-- =============================================

-- Users can view their own role
CREATE POLICY "Users can view their own role"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Only super_admins can insert new admin users
CREATE POLICY "Super admins can insert admin users"
    ON public.admin_users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- Only super_admins can update admin users
CREATE POLICY "Super admins can update admin users"
    ON public.admin_users
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- Only super_admins can delete admin users
CREATE POLICY "Super admins can delete admin users"
    ON public.admin_users
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- =============================================
-- STEP 6: Recreate trigger for updated_at
-- =============================================

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STEP 7: Update table and column comments
-- =============================================

COMMENT ON TABLE public.admin_users IS 'Stores admin user role assignments and metadata for the admin backend system';
COMMENT ON COLUMN public.admin_users.user_id IS 'References the user in auth.users';
COMMENT ON COLUMN public.admin_users.role IS 'The admin role assigned to the user (super_admin, content_manager, translator, or sales_viewer)';
COMMENT ON COLUMN public.admin_users.full_name IS 'Full name of the admin user for display purposes';
COMMENT ON COLUMN public.admin_users.is_active IS 'Whether this admin user account is active';
COMMENT ON COLUMN public.admin_users.last_login_at IS 'Timestamp of the last successful login';

COMMIT;

-- =============================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =============================================
-- To rollback this migration, run:
/*
BEGIN;
-- Rename table back
ALTER TABLE public.admin_users RENAME TO user_roles;
-- Drop new columns
ALTER TABLE public.user_roles DROP COLUMN IF EXISTS full_name;
ALTER TABLE public.user_roles DROP COLUMN IF EXISTS is_active;
-- Drop new indexes
DROP INDEX IF EXISTS idx_admin_users_active;
-- Rename indexes back
ALTER INDEX IF EXISTS idx_admin_users_user_id RENAME TO idx_user_roles_user_id;
ALTER INDEX IF EXISTS idx_admin_users_role RENAME TO idx_user_roles_role;
-- Convert role back to text
ALTER TABLE public.user_roles ALTER COLUMN role TYPE TEXT;
-- Recreate old enum
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
-- Map roles back
UPDATE public.user_roles
SET role = CASE
    WHEN role = 'super_admin' THEN 'admin'
    WHEN role = 'content_manager' THEN 'editor'
    ELSE 'viewer'
END;
ALTER TABLE public.user_roles ALTER COLUMN role TYPE user_role USING role::user_role;
-- Drop new admin_role enum
DROP TYPE IF EXISTS admin_role;
-- Drop new functions
DROP FUNCTION IF EXISTS public.has_admin_role(UUID, TEXT);
COMMIT;
*/
