# Sprint 1-2: Foundation & Authentication
**Duration:** 2 weeks (10 working days)
**Goal:** Establish core infrastructure and authentication system

---

## Day 1-2: Database Foundation & Project Setup

### Work Package 1A: Database Foundation (Priority 1 - Sequential)
**Agent:** Fullstack-Feature-Owner
**Status:** 🟡 Ready to Start

**Tasks:**
- [ ] Create Supabase migration directory structure
- [ ] Create `001_admin_users_table.sql` migration
  - admin_users table with RBAC fields
  - RLS policies for admin_users
- [ ] Create `002_audit_logs_table.sql` migration
  - audit_logs table for tracking all admin actions
  - Auto-capture user_id, action, resource, timestamps
  - RLS policy (only super_admin can view)
- [ ] Create `003_database_triggers.sql` migration
  - Trigger for auto-timestamping (updated_at)
  - Trigger for audit log auto-population
- [ ] Test migrations locally
- [ ] Document rollback procedures in migration files

**Deliverables:**
```
supabase/
└── migrations/
    ├── 001_admin_users_table.sql
    ├── 002_audit_logs_table.sql
    └── 003_database_triggers.sql
```

**Dependencies:** None

**Acceptance Criteria:**
- [ ] All tables created successfully
- [ ] RLS policies prevent unauthorized access
- [ ] Triggers work correctly
- [ ] Can rollback migrations cleanly

---

### Work Package 1C: Admin Layout (Priority 1 - Parallel with 1A)
**Agent:** UI-Engineer
**Status:** 🟡 Ready to Start

**Tasks:**
- [ ] Create admin layout structure (`src/app/admin/layout.tsx`)
- [ ] Build sidebar navigation component
  - Logo
  - Navigation links (Dashboard, Connectors, Inquiries, Media, Users)
  - User profile section at bottom
  - Collapse/expand functionality (desktop)
- [ ] Create user profile dropdown
  - Show user name and role
  - Settings link
  - Logout button
- [ ] Build breadcrumbs component
  - Dynamic breadcrumbs based on route
  - Links to parent pages
- [ ] Create admin dashboard skeleton
  - Stats cards (placeholders with mock data)
  - Recent activity feed (placeholder)
  - Quick actions (placeholder)
- [ ] Ensure responsive design (mobile drawer)

**Deliverables:**
```
src/
├── app/
│   └── admin/
│       ├── layout.tsx
│       └── page.tsx (dashboard skeleton)
└── components/
    └── admin/
        ├── Sidebar.tsx
        ├── UserProfileDropdown.tsx
        └── Breadcrumbs.tsx
```

**Dependencies:** None (use mock data initially)

**Acceptance Criteria:**
- [ ] Admin layout renders correctly
- [ ] Navigation works with mock links
- [ ] Responsive on mobile (drawer/hamburger menu)
- [ ] Accessible (keyboard navigation, ARIA labels)

---

## Day 3-5: Authentication System

### Work Package 1B: Authentication System (Priority 2 - After 1A)
**Agent:** Fullstack-Feature-Owner
**Status:** ⏳ Waiting for 1A

**Tasks:**
- [ ] Configure Supabase Auth
  - Enable email/password provider
  - Configure email templates (optional)
  - Set up OAuth providers (optional - future)
- [ ] Create login page (`src/app/admin/login/page.tsx`)
  - Email/password form
  - Error handling UI
  - Remember me checkbox (optional)
  - Forgot password link (future)
- [ ] Implement auth utilities
  - `src/lib/auth/session.ts` - getCurrentUser(), getSession()
  - `src/lib/auth/supabase.ts` - Supabase client setup
- [ ] Enhance middleware (`src/middleware.ts`)
  - Protect /admin/* routes (redirect to login if not authenticated)
  - Redirect to /admin if already authenticated and visiting /admin/login
  - Add role checking (basic)
- [ ] Create logout functionality
  - Server Action for logout
  - Clear session
  - Redirect to login

**Deliverables:**
```
src/
├── app/
│   └── admin/
│       ├── login/
│       │   └── page.tsx
│       └── logout/
│           └── actions.ts
├── lib/
│   └── auth/
│       ├── session.ts
│       └── supabase.ts
└── middleware.ts (enhanced)
```

**Dependencies:** Work Package 1A (needs admin_users table)

**Acceptance Criteria:**
- [ ] Can log in with valid credentials
- [ ] Invalid credentials show error
- [ ] Protected routes redirect to login
- [ ] Session persists on refresh
- [ ] Logout works correctly

---

### Work Package 1D: RBAC System (Priority 3 - After 1B)
**Agent:** Fullstack-Feature-Owner
**Status:** ⏳ Waiting for 1B

**Tasks:**
- [ ] Create permission checking utilities (`src/lib/auth/permissions.ts`)
  - `hasPermission(user, permission)` function
  - `requirePermission(user, permission)` function (throws if unauthorized)
  - Permission map:
    ```typescript
    const PERMISSIONS = {
      'connectors.create': ['super_admin', 'content_manager'],
      'connectors.update': ['super_admin', 'content_manager'],
      'connectors.delete': ['super_admin'],
      'inquiries.view': ['super_admin', 'content_manager', 'sales_viewer'],
      'users.manage': ['super_admin']
    }
    ```
- [ ] Create role-based UI components
  - `<RequireRole roles={['super_admin']}>...</RequireRole>`
  - `<RequirePermission permission="connectors.create">...</RequirePermission>`
- [ ] Add middleware role validation
  - Check user role on protected routes
  - Redirect to 403 page if unauthorized
- [ ] Create audit logging utilities (`src/lib/audit/log.ts`)
  - `logAuditEvent(action, resource, userId)` function
  - Automatically capture IP, user agent, timestamp
- [ ] Build user management UI (basic CRUD)
  - List users (`src/app/admin/users/page.tsx`)
  - Create user form
  - Edit user (change role, activate/deactivate)
  - Delete user (soft delete - set is_active = false)

**Deliverables:**
```
src/
├── app/
│   └── admin/
│       └── users/
│           ├── page.tsx
│           ├── [id]/
│           │   └── page.tsx
│           └── actions.ts
├── lib/
│   ├── auth/
│   │   └── permissions.ts
│   └── audit/
│       └── log.ts
└── components/
    └── admin/
        ├── RequireRole.tsx
        └── RequirePermission.tsx
```

**Dependencies:** Work Package 1B (needs authentication)

**Acceptance Criteria:**
- [ ] Permission checking works correctly for all roles
- [ ] RBAC components render conditionally
- [ ] Audit logs capture all admin actions
- [ ] User management UI works (CRUD)
- [ ] Unauthorized access returns 403

---

## Day 6-10: Integration & Testing

### Work Package 1E: Integration & Polish
**Agent:** Main + Code-Review-Specialist

**Tasks:**
- [ ] Integrate all components
  - Connect auth to admin layout (show real user data)
  - Wire up logout button
  - Update navigation based on user role
- [ ] Add loading states
  - Login loading spinner
  - Dashboard skeleton loaders
- [ ] Error boundaries
  - Global error boundary for admin area
  - Login error handling
- [ ] Form validation
  - Client-side validation with Zod
  - Server-side validation in Server Actions
- [ ] Unit tests
  - Test permission checking utilities
  - Test auth utilities (mock Supabase)
  - Test audit logging
- [ ] E2E tests
  - Login flow test
  - RBAC test (different roles)
  - Logout test
- [ ] Security review
  - Review RLS policies
  - Test unauthorized access attempts
  - Verify audit logs capture correctly
- [ ] Documentation
  - Update README with auth setup instructions
  - Document RBAC permission model
  - Create user guide for admin users

**Deliverables:**
- Fully integrated authentication system
- Test suite (unit + E2E)
- Documentation

**Acceptance Criteria:**
- [ ] All Sprint 1 features working end-to-end
- [ ] All tests passing
- [ ] Security review completed
- [ ] Documentation complete

---

## Sprint 1 Definition of Done

### Functional Requirements ✅
- [ ] Admin users can log in with email/password
- [ ] Protected routes require authentication
- [ ] 4 roles enforced (super_admin, content_manager, translator, sales_viewer)
- [ ] Admin layout with navigation works
- [ ] Audit logs capture all admin actions
- [ ] User management UI functional (basic CRUD)

### Technical Requirements ✅
- [ ] Database migrations tested and documented
- [ ] RLS policies prevent unauthorized access
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero warnings
- [ ] Unit test coverage > 80% for business logic
- [ ] E2E tests pass for critical flows

### Quality Requirements ✅
- [ ] Code reviewed by Code-Review-Specialist
- [ ] Security checklist completed
- [ ] Performance acceptable (page load < 2s)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Responsive (mobile, tablet, desktop)

### Documentation ✅
- [ ] README updated with setup instructions
- [ ] RBAC permission model documented
- [ ] User guide created for admin users
- [ ] API documentation for Server Actions
- [ ] CHANGELOG.md updated

---

## Risks & Mitigation

### Risk 1: Supabase Auth Configuration Issues
**Mitigation:** Test auth locally first; have fallback to custom JWT auth if needed

### Risk 2: RLS Policy Complexity
**Mitigation:** Start with simple policies; add complexity incrementally; thorough testing

### Risk 3: Timeline Slippage
**Mitigation:** Daily standup (review PROGRESS.md); identify blockers early; parallelize work

---

## Next Sprint Preview

**Sprint 3-4: Connector CRUD**
- Multi-step wizard for connector creation
- Versioning system
- Search and advanced filters
- Bulk import from CSV

**Prerequisites from Sprint 1:**
- ✅ Authentication system working
- ✅ RBAC enforced
- ✅ Audit logging functional
- ✅ Admin layout complete
