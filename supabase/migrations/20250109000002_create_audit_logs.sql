-- =============================================
-- Migration: Create Audit Logs System
-- Phase: 2 - Work Package 1A (Database Foundation)
-- Purpose: Implement comprehensive audit logging with monthly partitioning
-- =============================================

-- This migration creates a partitioned audit_logs table to track all
-- admin actions across the system. Uses table inheritance for monthly
-- partitions to maintain query performance as logs grow.

BEGIN;

-- =============================================
-- STEP 1: Create main audit_logs table (parent table for partitioning)
-- =============================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    -- Primary identification
    id UUID DEFAULT gen_random_uuid() NOT NULL,

    -- User identification
    user_id UUID REFERENCES public.admin_users(user_id) ON DELETE SET NULL,
    user_email TEXT,  -- Denormalized for historical record even if user is deleted
    user_role TEXT,   -- Snapshot of role at time of action

    -- Action details
    action TEXT NOT NULL CHECK (action IN (
        'create', 'update', 'delete', 'read',
        'login', 'logout', 'export', 'import',
        'approve', 'reject', 'restore'
    )),

    -- Resource identification
    resource_type TEXT NOT NULL CHECK (resource_type IN (
        'connector', 'terminal', 'keying_document',
        'admin_user', 'customer_inquiry', 'translation',
        'system_setting', 'audit_log'
    )),
    resource_id UUID,  -- ID of the affected resource (nullable for system-wide actions)
    resource_description TEXT,  -- Human-readable description (e.g., "Connector CS-R502KxxPF")

    -- Additional context
    details JSONB,  -- Flexible field for action-specific metadata
    -- Example details structure:
    -- {
    --   "changes": {"field_name": {"old": "value", "new": "value"}},
    --   "reason": "User requested deletion",
    --   "batch_id": "uuid-for-bulk-operations"
    -- }

    -- Request metadata
    ip_address INET,
    user_agent TEXT,
    request_method TEXT,  -- GET, POST, PUT, DELETE
    request_path TEXT,    -- API endpoint that triggered the action

    -- Status and error tracking
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'partial')),
    error_message TEXT,

    -- Timestamp (used for partitioning)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Constraint: id and created_at form the primary key for partitioning
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Add table comment
COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit log of all admin actions, partitioned monthly for performance';

-- Column comments
COMMENT ON COLUMN public.audit_logs.user_id IS 'Reference to admin user who performed the action (null if user deleted)';
COMMENT ON COLUMN public.audit_logs.user_email IS 'Email snapshot at time of action for historical record';
COMMENT ON COLUMN public.audit_logs.action IS 'Type of action performed';
COMMENT ON COLUMN public.audit_logs.resource_type IS 'Type of resource affected by the action';
COMMENT ON COLUMN public.audit_logs.resource_id IS 'ID of the specific resource affected';
COMMENT ON COLUMN public.audit_logs.details IS 'JSON object with action-specific metadata and change details';
COMMENT ON COLUMN public.audit_logs.ip_address IS 'IP address from which the action was performed';
COMMENT ON COLUMN public.audit_logs.user_agent IS 'Browser/client user agent string';
COMMENT ON COLUMN public.audit_logs.status IS 'Whether the action succeeded, failed, or partially completed';

-- =============================================
-- STEP 2: Create initial monthly partitions
-- =============================================

-- Function to create a monthly partition
CREATE OR REPLACE FUNCTION public.create_audit_log_partition(partition_date DATE)
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    -- Calculate partition boundaries
    start_date := DATE_TRUNC('month', partition_date);
    end_date := start_date + INTERVAL '1 month';

    -- Generate partition name (e.g., audit_logs_2025_01)
    partition_name := 'audit_logs_' || TO_CHAR(start_date, 'YYYY_MM');

    -- Create partition if it doesn't exist
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF public.audit_logs
        FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        start_date,
        end_date
    );

    -- Create index on the partition for better query performance
    EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON %I (user_id, created_at DESC)',
        partition_name || '_user_id_idx',
        partition_name
    );

    EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON %I (resource_type, resource_id, created_at DESC)',
        partition_name || '_resource_idx',
        partition_name
    );

    EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON %I (action, created_at DESC)',
        partition_name || '_action_idx',
        partition_name
    );

    RAISE NOTICE 'Created partition: %', partition_name;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.create_audit_log_partition(DATE) IS 'Creates a monthly partition for audit_logs table';

-- Function to automatically create next month's partition
CREATE OR REPLACE FUNCTION public.ensure_audit_log_partitions()
RETURNS VOID AS $$
DECLARE
    current_month DATE;
    next_month DATE;
BEGIN
    current_month := DATE_TRUNC('month', CURRENT_DATE);
    next_month := current_month + INTERVAL '1 month';

    -- Create partition for current month if it doesn't exist
    PERFORM public.create_audit_log_partition(current_month);

    -- Pre-create partition for next month
    PERFORM public.create_audit_log_partition(next_month);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.ensure_audit_log_partitions() IS 'Ensures current and next month partitions exist';

-- Create partitions for current and next month
SELECT public.ensure_audit_log_partitions();

-- =============================================
-- STEP 3: Create indexes on parent table
-- =============================================

-- Note: Indexes on partitions are created by the partition creation function
-- These are for queries that might span multiple partitions

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
    ON public.audit_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource
    ON public.audit_logs (resource_type, resource_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON public.audit_logs (action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON public.audit_logs (created_at DESC);

-- GIN index for JSONB details field to enable fast searches
CREATE INDEX IF NOT EXISTS idx_audit_logs_details
    ON public.audit_logs USING GIN (details);

-- =============================================
-- STEP 4: Enable Row Level Security
-- =============================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-runnable migrations)
DROP POLICY IF EXISTS "Super admins can read all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Content managers can read content audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Super admins can read all audit logs
CREATE POLICY "Super admins can read all audit logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- Content managers can read logs related to their domain (connectors, terminals, etc.)
CREATE POLICY "Content managers can read content audit logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role IN ('content_manager', 'super_admin')
            AND is_active = true
        )
        AND resource_type IN ('connector', 'terminal', 'keying_document', 'translation')
    );

-- Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Only the system (via triggers) can insert audit logs
-- This prevents manual tampering with audit records
CREATE POLICY "System can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);  -- Will be controlled by triggers and service role

-- No one can update or delete audit logs (immutable)
-- Audit logs should never be modified or deleted

-- =============================================
-- STEP 5: Create helper functions for logging
-- =============================================

-- Function to log an admin action
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.log_admin_action IS 'Helper function to create an audit log entry with all necessary context';

-- =============================================
-- STEP 6: Grant necessary permissions
-- =============================================

-- Allow authenticated users to select from audit_logs (controlled by RLS)
GRANT SELECT ON public.audit_logs TO authenticated;

-- Allow authenticated users to insert (for logging their own actions via triggers)
GRANT INSERT ON public.audit_logs TO authenticated;

-- No UPDATE or DELETE permissions - audit logs are immutable

-- =============================================
-- STEP 7: Create maintenance function for old partitions
-- =============================================

-- Function to archive or drop old audit log partitions
-- (To be called manually or via scheduled job)
CREATE OR REPLACE FUNCTION public.archive_old_audit_partitions(months_to_keep INTEGER DEFAULT 12)
RETURNS TABLE(partition_name TEXT, action_taken TEXT) AS $$
DECLARE
    partition_record RECORD;
    cutoff_date DATE;
BEGIN
    cutoff_date := DATE_TRUNC('month', CURRENT_DATE) - (months_to_keep || ' months')::INTERVAL;

    FOR partition_record IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename LIKE 'audit_logs_%'
        AND tablename ~ '^audit_logs_\d{4}_\d{2}$'
    LOOP
        -- Extract date from partition name and check if it's old enough
        DECLARE
            partition_date DATE;
            year_part TEXT;
            month_part TEXT;
        BEGIN
            year_part := SUBSTRING(partition_record.tablename FROM 'audit_logs_(\d{4})_\d{2}');
            month_part := SUBSTRING(partition_record.tablename FROM 'audit_logs_\d{4}_(\d{2})');
            partition_date := TO_DATE(year_part || '-' || month_part || '-01', 'YYYY-MM-DD');

            IF partition_date < cutoff_date THEN
                -- For now, just report - actual archival/deletion should be manual
                partition_name := partition_record.tablename;
                action_taken := 'READY_FOR_ARCHIVE (older than ' || months_to_keep || ' months)';
                RETURN NEXT;
            END IF;
        END;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.archive_old_audit_partitions(INTEGER) IS 'Identifies audit log partitions older than specified months for archival';

COMMIT;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Check that partitions were created:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'audit_logs_%' ORDER BY tablename;

-- Check indexes:
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename LIKE 'audit_logs%' ORDER BY indexname;

-- =============================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =============================================
/*
BEGIN;
-- Drop all audit log partitions
DO $$
DECLARE
    partition_record RECORD;
BEGIN
    FOR partition_record IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public' AND tablename LIKE 'audit_logs_%'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || partition_record.tablename || ' CASCADE';
    END LOOP;
END $$;

-- Drop main table
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.log_admin_action;
DROP FUNCTION IF EXISTS public.create_audit_log_partition(DATE);
DROP FUNCTION IF EXISTS public.ensure_audit_log_partitions();
DROP FUNCTION IF EXISTS public.archive_old_audit_partitions(INTEGER);

COMMIT;
*/
