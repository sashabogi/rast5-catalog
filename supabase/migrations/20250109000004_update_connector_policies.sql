-- =============================================
-- Migration: Update Connector RLS Policies
-- Phase: 2 - Work Package 1A (Database Foundation)
-- Purpose: Update RLS policies to use admin_users table with role-based permissions
-- =============================================

-- This migration updates all RLS policies across connectors, terminals,
-- and keying_documents tables to:
-- 1. Use the new admin_users table instead of user_roles
-- 2. Differentiate permissions by role type per PRD requirements
-- 3. Maintain public read access for the catalog

BEGIN;

-- =============================================
-- STEP 1: DROP OLD ADMIN POLICIES
-- =============================================

-- Drop old connector admin policies
DROP POLICY IF EXISTS "Admins can insert connectors" ON public.connectors;
DROP POLICY IF EXISTS "Admins can update connectors" ON public.connectors;
DROP POLICY IF EXISTS "Admins can delete connectors" ON public.connectors;

-- Drop old terminal admin policies
DROP POLICY IF EXISTS "Admins can insert terminals" ON public.terminals;
DROP POLICY IF EXISTS "Admins can update terminals" ON public.terminals;
DROP POLICY IF EXISTS "Admins can delete terminals" ON public.terminals;

-- Drop old keying_documents admin policies
DROP POLICY IF EXISTS "Admins can insert keying_documents" ON public.keying_documents;
DROP POLICY IF EXISTS "Admins can update keying_documents" ON public.keying_documents;
DROP POLICY IF EXISTS "Admins can delete keying_documents" ON public.keying_documents;

-- =============================================
-- STEP 2: CREATE HELPER FUNCTIONS FOR ROLE CHECKS
-- =============================================

-- Function to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_super_admin() IS 'Check if current user is an active super_admin';

-- Function to check if user is content_manager or higher
CREATE OR REPLACE FUNCTION public.can_manage_content()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'content_manager')
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.can_manage_content() IS 'Check if current user can manage catalog content (super_admin or content_manager)';

-- Function to check if user has read access (any active admin)
CREATE OR REPLACE FUNCTION public.has_admin_read_access()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.has_admin_read_access() IS 'Check if current user is any active admin user';

-- =============================================
-- STEP 3: CONNECTORS TABLE - NEW RLS POLICIES
-- =============================================

-- PUBLIC READ ACCESS (unchanged - catalog is public)
-- Existing policy should remain: "Public users can view all connectors"

-- SUPER ADMIN: Full CRUD access
CREATE POLICY "Super admins can insert connectors"
    ON public.connectors
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update connectors"
    ON public.connectors
    FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete connectors"
    ON public.connectors
    FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- CONTENT MANAGER: Create, Read, Update (no delete)
CREATE POLICY "Content managers can insert connectors"
    ON public.connectors
    FOR INSERT
    TO authenticated
    WITH CHECK (public.can_manage_content());

CREATE POLICY "Content managers can update connectors"
    ON public.connectors
    FOR UPDATE
    TO authenticated
    USING (public.can_manage_content())
    WITH CHECK (public.can_manage_content());

-- TRANSLATOR & SALES_VIEWER: Read-only (handled by existing public read policy)
-- They can view via the public read policy, no additional policies needed

-- =============================================
-- STEP 4: TERMINALS TABLE - NEW RLS POLICIES
-- =============================================

-- PUBLIC READ ACCESS (unchanged)
-- Existing policy should remain: "Public users can view all terminals"

-- SUPER ADMIN: Full CRUD access
CREATE POLICY "Super admins can insert terminals"
    ON public.terminals
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update terminals"
    ON public.terminals
    FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete terminals"
    ON public.terminals
    FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- CONTENT MANAGER: Create, Read, Update (no delete)
CREATE POLICY "Content managers can insert terminals"
    ON public.terminals
    FOR INSERT
    TO authenticated
    WITH CHECK (public.can_manage_content());

CREATE POLICY "Content managers can update terminals"
    ON public.terminals
    FOR UPDATE
    TO authenticated
    USING (public.can_manage_content())
    WITH CHECK (public.can_manage_content());

-- TRANSLATOR & SALES_VIEWER: Read-only (handled by existing public read policy)

-- =============================================
-- STEP 5: KEYING_DOCUMENTS TABLE - NEW RLS POLICIES
-- =============================================

-- PUBLIC READ ACCESS (unchanged)
-- Existing policy should remain: "Public users can view all keying_documents"

-- SUPER ADMIN: Full CRUD access
CREATE POLICY "Super admins can insert keying_documents"
    ON public.keying_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update keying_documents"
    ON public.keying_documents
    FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete keying_documents"
    ON public.keying_documents
    FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- CONTENT MANAGER: Create, Read, Update (no delete)
CREATE POLICY "Content managers can insert keying_documents"
    ON public.keying_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (public.can_manage_content());

CREATE POLICY "Content managers can update keying_documents"
    ON public.keying_documents
    FOR UPDATE
    TO authenticated
    USING (public.can_manage_content())
    WITH CHECK (public.can_manage_content());

-- TRANSLATOR & SALES_VIEWER: Read-only (handled by existing public read policy)

-- =============================================
-- STEP 6: ADD POLICY COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON POLICY "Super admins can insert connectors" ON public.connectors IS
    'Super admins have full CREATE access to connectors';
COMMENT ON POLICY "Super admins can update connectors" ON public.connectors IS
    'Super admins have full UPDATE access to connectors';
COMMENT ON POLICY "Super admins can delete connectors" ON public.connectors IS
    'Super admins have full DELETE access to connectors';
COMMENT ON POLICY "Content managers can insert connectors" ON public.connectors IS
    'Content managers can CREATE connectors but cannot delete';
COMMENT ON POLICY "Content managers can update connectors" ON public.connectors IS
    'Content managers can UPDATE connectors but cannot delete';

COMMENT ON POLICY "Super admins can insert terminals" ON public.terminals IS
    'Super admins have full CREATE access to terminals';
COMMENT ON POLICY "Super admins can update terminals" ON public.terminals IS
    'Super admins have full UPDATE access to terminals';
COMMENT ON POLICY "Super admins can delete terminals" ON public.terminals IS
    'Super admins have full DELETE access to terminals';
COMMENT ON POLICY "Content managers can insert terminals" ON public.terminals IS
    'Content managers can CREATE terminals but cannot delete';
COMMENT ON POLICY "Content managers can update terminals" ON public.terminals IS
    'Content managers can UPDATE terminals but cannot delete';

COMMENT ON POLICY "Super admins can insert keying_documents" ON public.keying_documents IS
    'Super admins have full CREATE access to keying documents';
COMMENT ON POLICY "Super admins can update keying_documents" ON public.keying_documents IS
    'Super admins have full UPDATE access to keying documents';
COMMENT ON POLICY "Super admins can delete keying_documents" ON public.keying_documents IS
    'Super admins have full DELETE access to keying documents';
COMMENT ON POLICY "Content managers can insert keying_documents" ON public.keying_documents IS
    'Content managers can CREATE keying documents but cannot delete';
COMMENT ON POLICY "Content managers can update keying_documents" ON public.keying_documents IS
    'Content managers can UPDATE keying documents but cannot delete';

COMMIT;

-- =============================================
-- ROLE PERMISSION MATRIX (for reference)
-- =============================================
/*
┌──────────────────┬────────┬─────────┬────────┬────────┐
│ Role             │ Create │ Read    │ Update │ Delete │
├──────────────────┼────────┼─────────┼────────┼────────┤
│ super_admin      │   ✓    │    ✓    │   ✓    │   ✓    │
│ content_manager  │   ✓    │    ✓    │   ✓    │   ✗    │
│ translator       │   ✗    │    ✓    │   ✗    │   ✗    │
│ sales_viewer     │   ✗    │    ✓    │   ✗    │   ✗    │
│ (public/anon)    │   ✗    │    ✓    │   ✗    │   ✗    │
└──────────────────┴────────┴─────────┴────────┴────────┘

Applies to: connectors, terminals, keying_documents
*/

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- View all policies for catalog tables:
/*
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('connectors', 'terminals', 'keying_documents')
ORDER BY tablename, cmd, policyname;
*/

-- Test role-based access (run as different admin users):
/*
-- As super_admin:
SELECT public.is_super_admin();  -- Should return true
SELECT public.can_manage_content();  -- Should return true

-- As content_manager:
SELECT public.is_super_admin();  -- Should return false
SELECT public.can_manage_content();  -- Should return true

-- As translator or sales_viewer:
SELECT public.is_super_admin();  -- Should return false
SELECT public.can_manage_content();  -- Should return false
SELECT public.has_admin_read_access();  -- Should return true
*/

-- =============================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =============================================
/*
BEGIN;

-- Drop new policies
DROP POLICY IF EXISTS "Super admins can insert connectors" ON public.connectors;
DROP POLICY IF EXISTS "Super admins can update connectors" ON public.connectors;
DROP POLICY IF EXISTS "Super admins can delete connectors" ON public.connectors;
DROP POLICY IF EXISTS "Content managers can insert connectors" ON public.connectors;
DROP POLICY IF EXISTS "Content managers can update connectors" ON public.connectors;

DROP POLICY IF EXISTS "Super admins can insert terminals" ON public.terminals;
DROP POLICY IF EXISTS "Super admins can update terminals" ON public.terminals;
DROP POLICY IF EXISTS "Super admins can delete terminals" ON public.terminals;
DROP POLICY IF EXISTS "Content managers can insert terminals" ON public.terminals;
DROP POLICY IF EXISTS "Content managers can update terminals" ON public.terminals;

DROP POLICY IF EXISTS "Super admins can insert keying_documents" ON public.keying_documents;
DROP POLICY IF EXISTS "Super admins can update keying_documents" ON public.keying_documents;
DROP POLICY IF EXISTS "Super admins can delete keying_documents" ON public.keying_documents;
DROP POLICY IF EXISTS "Content managers can insert keying_documents" ON public.keying_documents;
DROP POLICY IF EXISTS "Content managers can update keying_documents" ON public.keying_documents;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.can_manage_content();
DROP FUNCTION IF EXISTS public.has_admin_read_access();

-- Recreate old policies (from 20250109000000_add_admin_write_policies.sql)
-- (Include the old policy recreation SQL here if needed)

COMMIT;
*/
