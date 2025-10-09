# Admin Backend TODO - Hybrid Approach

**Created:** 2025-01-08
**Approach:** Hybrid (Keep auth foundation, rebuild UI properly per PRD)
**Current Phase:** Cleanup & Realignment

---

## Phase 1: Cleanup & Documentation ✅

### Cleanup Tasks
- [✅] **1.1** Remove `/admin/connectors/page.tsx`
- [✅] **1.2** Remove `/components/admin/ConnectorsTable.tsx`
- [✅] **1.3** Remove `/components/admin/DeleteConnectorDialog.tsx`
- [✅] **1.4** Remove shadcn components (table, dropdown-menu, alert-dialog)

### Documentation Tasks
- [✅] **1.5** Update PROGRESS.md with current status
- [✅] **1.6** Create TODO.md (this file)
- [✅] **1.7** Update documentation complete

**Phase 1 Status:** ✅ COMPLETE

---

## Phase 2: Work Package 1A - Database Foundation (Proper)

### Sub-Agent: Backend-Architect (Review)
- [✅] **2.1** Review TECHNICAL_DESIGN_DOCUMENT.md database schema
- [✅] **2.2** Compare with existing user_roles table
- [✅] **2.3** Approve or suggest modifications for:
  - admin_users table structure ✅
  - audit_logs table structure ✅
  - Database triggers approach ✅

**Backend-Architect Review Complete - Recommendations Provided:**
- Fix admin_users schema (rename from user_roles, update roles)
- Create audit_logs table with partitioning
- Implement 4 critical triggers
- Phased migration strategy defined

### Sub-Agent: Fullstack-Feature-Owner (Implementation) ✅ COMPLETE
- [✅] **2.4** Create `20250109000001_fix_admin_users_schema.sql` migration
  - Rename user_roles → admin_users
  - Update role enum (super_admin, content_manager, translator, sales_viewer)
  - Add missing fields (full_name, last_login_at)
  - Update RLS policies and is_admin() function

- [✅] **2.5** Create `20250109000002_create_audit_logs.sql` migration
  - audit_logs table with monthly partitioning
  - Indexes for performance
  - RLS policies (super_admin + content_manager read access)

- [✅] **2.6** Create `20250109000003_create_admin_triggers.sql` migration
  - Placeholder for future triggers
  - Will add when full schema ready

- [✅] **2.7** Create `20250109000004_update_connector_policies.sql` migration
  - Update connector RLS policies to use new admin_users table
  - Differentiate permissions by role type

- [✅] **2.8** Migrations ready (Supabase CLI not available for local testing)
- [✅] **2.9** Update PROGRESS.md - Mark Work Package 1A complete
- [✅] **2.10** Debug migration deployment errors (6 errors fixed):
  1. Enum drop dependency - Added DROP DEFAULT before enum drop
  2. Non-existent column - Changed ALTER to ADD for last_login_at
  3. Function drop dependency - Removed DROP FUNCTION, used CREATE OR REPLACE
  4. Parameter name change - Kept original parameter name with aliasing
  5. COMMENT syntax error - Replaced COALESCE with simple comment
  6. Duplicate policy error - Added DROP POLICY IF EXISTS

- [✅] **2.11** Fix login page schema mismatch (Post-migration bug fix):
  - Login page was using old schema (user_roles table, admin role)
  - Updated to new schema (admin_users table, super_admin role)
  - Added is_active validation check
  - Enhanced server-side error logging in isUserAdmin()
  - Files updated: `/app/[locale]/admin/login/page.tsx`, `/lib/supabase/server.ts`

**Phase 2 Status:** ✅ COMPLETE - All migrations deployed and login working correctly

---

## Phase 3: Work Package 1C - Admin Layout (Proper) ✅

### Sub-Agent: UI-Engineer (Implementation)
- [✅] **3.1** Build Sidebar navigation component
  - Logo at top ✅
  - Navigation links (Dashboard, Connectors, Inquiries, Media, Users) ✅
  - Active state highlighting ✅
  - Collapse/expand (desktop) ✅
  - Mobile drawer ✅
  - File: `/components/admin/Sidebar.tsx` ✅

- [✅] **3.2** Build UserProfileDropdown component
  - User avatar/initials ✅
  - User name and role display ✅
  - Settings link ✅
  - Logout button ✅
  - File: `/components/admin/UserProfileDropdown.tsx` ✅

- [✅] **3.3** Build Breadcrumbs component
  - Dynamic based on route ✅
  - Links to parent pages ✅
  - Current page (non-clickable) ✅
  - File: `/components/admin/Breadcrumbs.tsx` ✅

- [✅] **3.4** Update admin layout structure
  - Integrate Sidebar ✅
  - Integrate UserProfileDropdown ✅
  - Integrate Breadcrumbs ✅
  - Proper responsive design ✅
  - File: `/app/[locale]/admin/layout.tsx` ✅

- [✅] **3.5** Dashboard page works with new layout ✅

- [✅] **3.6** Update PROGRESS.md - Mark Work Package 1C complete

**Phase 3 Status:** ✅ COMPLETE - All 3 reusable components built and integrated

---

## Phase 4: Work Package 1D - RBAC System ✅

### Sub-Agent: Fullstack-Feature-Owner (Implementation)
- [✅] **4.1** Create permission utilities ✅ COMPLETE
  - `hasPermission(user, permission)` function ✅
  - `requirePermission(user, permission)` function ✅
  - Permission map for all roles ✅
  - 13 helper functions (canManageContent, isSuperAdmin, etc.) ✅
  - Full TypeScript type safety ✅
  - File: `/lib/auth/permissions.ts` (512 lines) ✅

### Sub-Agent: UI-Engineer (Implementation)
- [✅] **4.2** Create RBAC UI components ✅ COMPLETE
  - `<RequireRole>` component (server component) ✅
  - `<RequirePermission>` component (server component) ✅
  - Complete documentation and examples ✅
  - Test page at `/admin/test-rbac` ✅
  - Files: `/components/admin/RequireRole.tsx`, `/components/admin/RequirePermission.tsx` ✅

### Sub-Agent: Fullstack-Feature-Owner (Implementation)
- [✅] **4.3** Create audit logging utilities ✅ COMPLETE
  - `logAuditEvent(action, resource, userId)` function ✅
  - Auto-capture IP, user agent, timestamp, request method/path ✅
  - 11 helper functions for specific resource types ✅
  - Integrates with Supabase audit_logs table ✅
  - Batch logging support ✅
  - File: `/lib/audit/log.ts` (453 lines) ✅

- [✅] **4.5** Update middleware with role validation ✅ COMPLETE
  - Multi-locale admin route protection (6 languages) ✅
  - Authentication verification using Supabase SSR ✅
  - Role-based access control (4 admin roles) ✅
  - Active status checking ✅
  - Security logging with IP/user agent tracking ✅
  - Locale preservation in redirects ✅
  - Complete documentation suite (4 docs + test script) ✅
  - File: `/middleware.ts` (323 lines) ✅

- [✅] **4.4** Build user management UI ✅ COMPLETE
  - User list page with table, search, filters, actions ✅
  - Create user dialog with validation ✅
  - Edit user page with change tracking ✅
  - Delete user with confirmation (soft delete) ✅
  - Restore user functionality ✅
  - All server actions (CRUD operations) ✅
  - Permission checks on all operations ✅
  - Audit logging integrated ✅
  - Toast notifications (Sonner) ✅
  - Responsive UI with shadcn/ui ✅
  - TypeScript strict typing ✅
  - Build passes successfully ✅
  - Files: `/app/[locale]/admin/users/` (6 files, 1,200+ lines) ✅

- [✅] **4.6** Update PROGRESS.md - Mark Work Package 1D complete

**Phase 4 Status:** ✅ 100% COMPLETE - Full RBAC system with user management UI

---

## Phase 5: Work Package 1E - Integration & Testing

### Sub-Agent: Code-Review-Specialist (Review)
- [ ] **5.1** Review all code for TypeScript compliance
- [ ] **5.2** Check security vulnerabilities
- [ ] **5.3** Validate RLS policies
- [ ] **5.4** Review error handling

### Main Agent (Integration)
- [ ] **5.5** Write unit tests
  - Permission checking utilities
  - Auth utilities
  - Audit logging

- [ ] **5.6** Write E2E tests
  - Login flow
  - RBAC (different roles)
  - Logout flow

- [ ] **5.7** Security review
  - Review RLS policies
  - Test unauthorized access
  - Verify audit logs

- [ ] **5.8** Update documentation
  - README with setup instructions
  - RBAC permission model
  - User guide

- [ ] **5.9** Update PROGRESS.md - Mark Sprint 1 complete
- [ ] **5.10** Update BLOCKERS.md - Mark all resolved

---

## Work Package Dependencies

```
1A (Database) ────┐
                  ├──> 1D (RBAC)
1B (Auth) ────────┘       │
                           │
1C (Layout) ──────────────┤
                           ├──> 1E (Integration)
                           │
(All above) ──────────────┘
```

**Parallel Work:**
- 1A and 1C can run in parallel (no dependencies)
- 1D needs 1A and 1B complete
- 1E needs all (1A, 1B, 1C, 1D) complete

---

## Task Status Legend

- [ ] Not started
- [~] In progress
- [✅] Complete
- [❌] Blocked/Removed

---

## Sub-Agent Assignment

| Phase | Task | Sub-Agent | Status |
|-------|------|-----------|--------|
| 1 | Cleanup | Main | Pending |
| 2 | Database Review | Backend-Architect | Pending |
| 2 | Database Implementation | Fullstack-Feature-Owner | Pending |
| 3 | Admin Layout | UI-Engineer | Pending |
| 4 | RBAC System | Fullstack-Feature-Owner | Pending |
| 5 | Code Review | Code-Review-Specialist | Pending |
| 5 | Integration | Main | Pending |

---

**Next Action:** Begin Phase 1 cleanup, then launch Phase 2 & 3 in parallel
