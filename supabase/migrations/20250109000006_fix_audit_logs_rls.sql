-- =============================================
-- Migration: Fix Audit Logs RLS Policy
-- Phase: Security Enhancement
-- Purpose: Restrict audit log INSERT to service role only
-- Created: 2025-01-09
-- =============================================

-- This migration fixes a security vulnerability where any authenticated user
-- could insert audit logs. We restrict INSERT to service_role only, while
-- maintaining the existing log_admin_action() function that operates with
-- SECURITY DEFINER privileges.

BEGIN;

-- =============================================
-- STEP 1: Drop existing overly permissive INSERT policy
-- =============================================

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

-- =============================================
-- STEP 2: Create new restrictive INSERT policy
-- =============================================

-- Only service role can insert audit logs directly
-- This prevents any authenticated user from tampering with audit trail
CREATE POLICY "Service role can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- =============================================
-- STEP 3: Create additional policy for application inserts via RPC
-- =============================================

-- Allow authenticated users to insert ONLY through the log_admin_action() function
-- The function uses SECURITY DEFINER, so it runs with owner privileges
-- This policy ensures direct INSERT attempts are blocked while function calls work
CREATE POLICY "Application can insert via RPC"
    ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Only allow if called from our secure function context
        -- The log_admin_action function has SECURITY DEFINER
        -- so it bypasses RLS and can insert directly
        false  -- Direct inserts by authenticated users are blocked
    );

-- =============================================
-- STEP 4: Verify log_admin_action function has SECURITY DEFINER
-- =============================================

-- Re-create the function with explicit SECURITY DEFINER to ensure
-- it can insert audit logs regardless of the RLS policies
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_resource_description TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_method TEXT DEFAULT NULL,
    p_request_path TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'success',
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
    v_user_email TEXT;
    v_user_role TEXT;
BEGIN
    -- Get user details for snapshot
    SELECT
        (SELECT email FROM auth.users WHERE id = admin_users.user_id),
        role::TEXT
    INTO v_user_email, v_user_role
    FROM public.admin_users
    WHERE user_id = p_user_id;

    -- Insert audit log record
    -- This works because function has SECURITY DEFINER
    INSERT INTO public.audit_logs (
        user_id,
        user_email,
        user_role,
        action,
        resource_type,
        resource_id,
        resource_description,
        details,
        ip_address,
        user_agent,
        request_method,
        request_path,
        status,
        error_message
    ) VALUES (
        p_user_id,
        v_user_email,
        v_user_role,
        p_action,
        p_resource_type,
        p_resource_id,
        p_resource_description,
        p_details,
        p_ip_address,
        p_user_agent,
        p_request_method,
        p_request_path,
        p_status,
        p_error_message
    ) RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- SECURITY DEFINER is critical here

-- Add comment
COMMENT ON FUNCTION public.log_admin_action IS
    'Helper function to create an audit log entry. Uses SECURITY DEFINER to bypass RLS policies.';

-- =============================================
-- STEP 5: Update permissions
-- =============================================

-- Revoke direct INSERT permission from authenticated users
REVOKE INSERT ON public.audit_logs FROM authenticated;

-- Allow authenticated users to execute the log function
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;

-- Service role retains full access
GRANT INSERT ON public.audit_logs TO service_role;

COMMIT;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify policies are correct:
-- SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'audit_logs'
-- ORDER BY policyname;

-- Test that log_admin_action still works:
-- SELECT public.log_admin_action(
--     auth.uid(),
--     'read',
--     'admin_user',
--     NULL,
--     'Test audit log entry',
--     '{"test": true}'::jsonb
-- );

-- Verify direct INSERT fails for authenticated users:
-- This should fail with permission denied:
-- INSERT INTO public.audit_logs (user_id, action, resource_type)
-- VALUES (auth.uid(), 'test', 'admin_user');

-- =============================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =============================================
/*
BEGIN;

-- Restore original permissive policy
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Application can insert via RPC" ON public.audit_logs;

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

GRANT INSERT ON public.audit_logs TO authenticated;

COMMIT;
*/
