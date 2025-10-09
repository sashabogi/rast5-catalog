-- Add admin write policies for connectors, terminals, and keying_documents
-- This allows authenticated admin users to manage catalog data

-- =============================================
-- CONNECTORS TABLE - Admin Write Policies
-- =============================================

CREATE POLICY "Admins can insert connectors"
    ON public.connectors
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_admin(auth.uid())
    );

CREATE POLICY "Admins can update connectors"
    ON public.connectors
    FOR UPDATE
    TO authenticated
    USING (
        public.is_admin(auth.uid())
    )
    WITH CHECK (
        public.is_admin(auth.uid())
    );

CREATE POLICY "Admins can delete connectors"
    ON public.connectors
    FOR DELETE
    TO authenticated
    USING (
        public.is_admin(auth.uid())
    );

-- =============================================
-- TERMINALS TABLE - Admin Write Policies
-- =============================================

CREATE POLICY "Admins can insert terminals"
    ON public.terminals
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_admin(auth.uid())
    );

CREATE POLICY "Admins can update terminals"
    ON public.terminals
    FOR UPDATE
    TO authenticated
    USING (
        public.is_admin(auth.uid())
    )
    WITH CHECK (
        public.is_admin(auth.uid())
    );

CREATE POLICY "Admins can delete terminals"
    ON public.terminals
    FOR DELETE
    TO authenticated
    USING (
        public.is_admin(auth.uid())
    );

-- =============================================
-- KEYING DOCUMENTS TABLE - Admin Write Policies
-- =============================================

CREATE POLICY "Admins can insert keying_documents"
    ON public.keying_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_admin(auth.uid())
    );

CREATE POLICY "Admins can update keying_documents"
    ON public.keying_documents
    FOR UPDATE
    TO authenticated
    USING (
        public.is_admin(auth.uid())
    )
    WITH CHECK (
        public.is_admin(auth.uid())
    );

CREATE POLICY "Admins can delete keying_documents"
    ON public.keying_documents
    FOR DELETE
    TO authenticated
    USING (
        public.is_admin(auth.uid())
    );

-- =============================================
-- VERIFICATION
-- =============================================

-- Check all policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('connectors', 'terminals', 'keying_documents', 'user_roles')
ORDER BY tablename, cmd;
