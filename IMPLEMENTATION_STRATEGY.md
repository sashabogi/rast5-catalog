# Implementation Strategy & Sub-Agent Coordination

## Document Purpose

This document defines the implementation strategy for the RAST 5 Admin Backend system, including task breakdown, sub-agent roles, parallel work streams, code quality standards, and coordination protocols.

**Related Documents:**
- [ADMIN_BACKEND_PRD_REVISED.md](./ADMIN_BACKEND_PRD_REVISED.md) - Product requirements
- [TECHNICAL_DESIGN_DOCUMENT.md](./TECHNICAL_DESIGN_DOCUMENT.md) - Technical specifications

---

## 1. Sprint Overview

### Sprint 1-2: Foundation & Authentication (2 weeks)
**Goal:** Establish core infrastructure and authentication system

### Sprint 3-4: Connector CRUD (2 weeks)
**Goal:** Build connector management with multi-step wizard

### Sprint 5-6: Media & Inquiries (2 weeks)
**Goal:** Implement file uploads and customer inquiry system

### Sprint 7-8: Polish & Launch (2 weeks)
**Goal:** Testing, optimization, and production deployment

### Sprint 9-10: Training & Support (2 weeks)
**Goal:** User training and post-launch support

---

## 2. Sub-Agent Roles & Responsibilities

### 2.1 Backend-Architect Agent
**Role:** System design and architectural decisions
**Responsibilities:**
- Review database schema design
- Define API architecture patterns
- Approve security implementations
- Review scalability approaches
**When to Use:**
- Before starting each sprint for architecture review
- When facing complex design decisions
- For performance optimization strategies

### 2.2 Fullstack-Feature-Owner Agent
**Role:** End-to-end feature implementation
**Responsibilities:**
- Implement complete features (frontend + backend + database)
- Build multi-step wizards
- Create Server Actions and API routes
- Implement database operations with Drizzle ORM
**When to Use:**
- Connector CRUD implementation
- Inquiry management system
- Translation management features
- Media upload features

### 2.3 UI-Engineer Agent
**Role:** Frontend components and user interface
**Responsibilities:**
- Build shadcn/ui components
- Implement responsive layouts
- Create form components with React Hook Form
- Build data tables and dashboards
**When to Use:**
- Admin dashboard layout
- Connector management UI
- Inquiry tracking interface
- Analytics dashboards

### 2.4 Data-Science-Analyst Agent (Optional)
**Role:** Analytics and reporting
**Responsibilities:**
- Design inquiry auto-assignment algorithms
- Build analytics dashboards
- Create lead scoring logic
- Generate performance reports
**When to Use:**
- Inquiry auto-assignment logic
- Analytics dashboard (Phase 2)
- Lead scoring implementation (Phase 2)

### 2.5 Code-Review-Specialist Agent
**Role:** Code quality and security review
**Responsibilities:**
- Review all code before merge
- Check security vulnerabilities
- Validate TypeScript types
- Ensure code standards compliance
**When to Use:**
- After completing each feature
- Before merging to main branch
- For security-critical code (auth, RLS)

### 2.6 Refactoring-Specialist Agent
**Role:** Code quality improvements
**Responsibilities:**
- Refactor complex components
- Improve code maintainability
- Reduce duplication
- Optimize performance
**When to Use:**
- After completing Sprint 4 (mid-project refactor)
- When code complexity exceeds standards
- For performance bottlenecks

---

## 3. Work Stream Breakdown

### 3.1 Sprint 1-2: Foundation & Authentication

#### Work Package 1A: Database Foundation (Sequential)
**Agent:** Backend-Architect + Fullstack-Feature-Owner
**Tasks:**
1. Create database migration files
2. Implement admin_users table
3. Implement audit_logs table
4. Set up RLS policies
5. Create database triggers

**Dependencies:** None (start immediately)
**Deliverables:**
- `supabase/migrations/001_admin_tables.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_triggers.sql`

#### Work Package 1B: Authentication System (Sequential, after 1A)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Set up Supabase Auth integration
2. Create login page `/admin/login`
3. Implement middleware protection
4. Create session management utilities
5. Add logout functionality

**Dependencies:** 1A (needs admin_users table)
**Deliverables:**
- `src/app/admin/login/page.tsx`
- `src/middleware.ts` (enhanced)
- `src/lib/auth/session.ts`

#### Work Package 1C: Admin Layout (Parallel with 1B)
**Agent:** UI-Engineer
**Tasks:**
1. Create admin layout structure
2. Build navigation sidebar
3. Implement user profile dropdown
4. Add breadcrumbs component
5. Create dashboard skeleton

**Dependencies:** None (can use mock data)
**Deliverables:**
- `src/app/admin/layout.tsx`
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/UserProfileDropdown.tsx`
- `src/components/admin/Breadcrumbs.tsx`

#### Work Package 1D: RBAC System (Sequential, after 1B)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Implement permission checking utilities
2. Create role-based components (e.g., `<RequireRole>`)
3. Add middleware role validation
4. Create audit logging utilities
5. Build user management UI (basic CRUD)

**Dependencies:** 1B (needs auth)
**Deliverables:**
- `src/lib/auth/permissions.ts`
- `src/components/admin/RequireRole.tsx`
- `src/app/admin/users/page.tsx`

---

### 3.2 Sprint 3-4: Connector CRUD

#### Work Package 2A: Database Schema (Sequential)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Create connector_versions table
2. Add versioning triggers
3. Implement connector search indexes
4. Add connector categories/series tables (if needed)

**Dependencies:** Sprint 1-2 complete
**Deliverables:**
- `supabase/migrations/004_connector_versioning.sql`

#### Work Package 2B: Multi-Step Wizard UI (Parallel)
**Agent:** UI-Engineer
**Tasks:**
1. Build wizard container component
2. Create step navigation
3. Build form steps:
   - Step 1: Basic Info
   - Step 2: Technical Specs
   - Step 3: Compatibility
   - Step 4: Review
4. Add form validation UI
5. Implement progress indicator

**Dependencies:** None (can use mock data initially)
**Deliverables:**
- `src/components/admin/ConnectorWizard.tsx`
- `src/components/admin/ConnectorWizard/Step1BasicInfo.tsx`
- `src/components/admin/ConnectorWizard/Step2TechnicalSpecs.tsx`
- `src/components/admin/ConnectorWizard/Step3Compatibility.tsx`
- `src/components/admin/ConnectorWizard/Step4Review.tsx`

#### Work Package 2C: Connector CRUD API (Sequential, after 2A)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Create Server Actions for connector CRUD
2. Implement Zod validation schemas
3. Add versioning logic
4. Create connector listing API
5. Build search/filter functionality

**Dependencies:** 2A (needs database tables)
**Deliverables:**
- `src/app/admin/connectors/actions.ts`
- `src/lib/validations/connector.ts`
- `src/app/admin/connectors/page.tsx`

#### Work Package 2D: Connector List & Detail Views (Sequential, after 2C)
**Agent:** UI-Engineer
**Tasks:**
1. Build connector data table
2. Add search and filters UI
3. Create connector detail page
4. Implement edit mode toggle
5. Add delete confirmation dialog

**Dependencies:** 2C (needs API)
**Deliverables:**
- `src/components/admin/ConnectorDataTable.tsx`
- `src/app/admin/connectors/[id]/page.tsx`

---

### 3.3 Sprint 5-6: Media & Inquiries

#### Work Package 3A: Media Upload Infrastructure (Sequential)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Create media_files table
2. Set up Supabase Storage buckets
3. Implement signed URL generation
4. Create file upload API (Route Handler)
5. Add file validation (type, size)

**Dependencies:** Sprint 3-4 complete
**Deliverables:**
- `supabase/migrations/005_media_files.sql`
- `src/app/api/admin/media/upload/route.ts`
- `src/lib/storage/upload.ts`

#### Work Package 3B: Media Upload UI (Sequential, after 3A)
**Agent:** UI-Engineer
**Tasks:**
1. Build drag-and-drop upload component
2. Add upload progress indicators
3. Create media library grid
4. Implement image cropping (if needed)
5. Add media association to connectors

**Dependencies:** 3A (needs upload API)
**Deliverables:**
- `src/components/admin/MediaUpload.tsx`
- `src/components/admin/MediaLibrary.tsx`

#### Work Package 3C: Inquiry System Database (Parallel with 3A)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Create customer_inquiries table
2. Create inquiry_activities table
3. Implement auto-numbering trigger
4. Add inquiry search indexes
5. Create download_logs table (optional)

**Dependencies:** Sprint 1-2 complete
**Deliverables:**
- `supabase/migrations/006_customer_inquiries.sql`

#### Work Package 3D: Inquiry Management API (Sequential, after 3C)
**Agent:** Fullstack-Feature-Owner
**Tasks:**
1. Create public inquiry submission API
2. Implement auto-assignment logic
3. Create admin inquiry management Server Actions
4. Add email notification service (Resend)
5. Build inquiry activity tracking

**Dependencies:** 3C (needs database tables)
**Deliverables:**
- `src/app/api/inquiries/route.ts` (public)
- `src/app/admin/inquiries/actions.ts`
- `src/lib/email/notifications.ts`
- `src/lib/inquiries/auto-assignment.ts`

#### Work Package 3E: Inquiry UI (Sequential, after 3D)
**Agent:** UI-Engineer
**Tasks:**
1. Build public inquiry form (frontend catalog)
2. Create admin inquiry dashboard
3. Build inquiry detail view with timeline
4. Add status update UI
5. Create assignment interface

**Dependencies:** 3D (needs API)
**Deliverables:**
- `src/components/InquiryForm.tsx` (public)
- `src/app/admin/inquiries/page.tsx`
- `src/app/admin/inquiries/[id]/page.tsx`
- `src/components/admin/InquiryTimeline.tsx`

---

### 3.4 Sprint 7-8: Polish & Launch

#### Work Package 4A: Testing (Parallel)
**Agent:** Code-Review-Specialist + Main
**Tasks:**
1. Write unit tests for Server Actions
2. Create E2E tests for critical flows:
   - Login flow
   - Connector creation flow
   - Inquiry submission flow
3. Test RBAC permissions
4. Security audit (auth, RLS, file uploads)

**Dependencies:** All features complete
**Deliverables:**
- `tests/unit/` directory with test files
- `tests/e2e/` directory with Playwright tests
- Security audit report

#### Work Package 4B: Performance Optimization (Parallel with 4A)
**Agent:** Refactoring-Specialist
**Tasks:**
1. Optimize database queries (add indexes)
2. Implement caching strategy
3. Add loading states and optimistic updates
4. Optimize image loading (next/image)
5. Add error boundaries

**Dependencies:** All features complete
**Deliverables:**
- Updated database with indexes
- `src/lib/cache/` utilities
- Performance optimization report

#### Work Package 4C: Documentation (Parallel with 4A & 4B)
**Agent:** Main
**Tasks:**
1. Create admin user guide
2. Write API documentation
3. Document deployment process
4. Create troubleshooting guide
5. Build onboarding checklist

**Dependencies:** All features complete
**Deliverables:**
- `docs/ADMIN_USER_GUIDE.md`
- `docs/API_DOCUMENTATION.md`
- `docs/DEPLOYMENT.md`
- `docs/TROUBLESHOOTING.md`
- `docs/ONBOARDING_CHECKLIST.md`

#### Work Package 4D: Production Deployment (Sequential, after 4A-4C)
**Agent:** Main + Backend-Architect
**Tasks:**
1. Set up production Supabase project
2. Run database migrations in production
3. Configure environment variables
4. Deploy to Vercel
5. Set up monitoring (Sentry, Vercel Analytics)

**Dependencies:** 4A, 4B, 4C complete
**Deliverables:**
- Production environment live
- Monitoring dashboards configured

---

## 4. Code Quality Standards

### 4.1 TypeScript Standards

**Strict Mode:** ALWAYS enabled
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**Type Safety Rules:**
- NO `any` types (use `unknown` if type is truly unknown)
- ALL functions must have explicit return types
- ALL props must be typed with interfaces (not inline types)
- Use Zod schemas for runtime validation
- Export all types from `src/types/` directory

**Example:**
```typescript
// ❌ BAD
export function createConnector(data: any) {
  return supabase.from('connectors').insert(data)
}

// ✅ GOOD
export async function createConnector(
  data: ConnectorCreateInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const validated = connectorCreateSchema.parse(data)
  const { data: result, error } = await supabase
    .from('connectors')
    .insert(validated)
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: result.id }
}
```

### 4.2 React Component Standards

**Naming:**
- Components: PascalCase (e.g., `ConnectorWizard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useConnectorForm.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)

**Structure:**
```typescript
'use client' // Only if needed

import { ... } from '...'  // External imports first
import { ... } from '@/...' // Internal imports

// Types
interface ComponentProps {
  id: string
  onSave: (data: ConnectorData) => Promise<void>
}

// Component
export function Component({ id, onSave }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()

  // 2. Derived values
  const computed = useMemo(() => {...}, [])

  // 3. Event handlers
  const handleSubmit = useCallback(() => {...}, [])

  // 4. Effects
  useEffect(() => {...}, [])

  // 5. Early returns
  if (!data) return <Loading />

  // 6. Render
  return (...)
}
```

**Server Components by Default:**
- Use Server Components unless you need:
  - Client-side interactivity (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - React hooks (useState, useEffect, etc.)
- Mark client components with `'use client'` directive
- Keep Server Components async when fetching data

### 4.3 File Organization

```
src/
├── app/
│   ├── admin/                    # Admin routes (protected)
│   │   ├── layout.tsx           # Admin layout (auth check)
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── connectors/
│   │   │   ├── page.tsx         # Connector list
│   │   │   ├── [id]/page.tsx    # Connector detail
│   │   │   └── actions.ts       # Server Actions
│   │   └── inquiries/
│   ├── api/                      # API routes
│   │   └── admin/
│   └── [locale]/                 # Public routes
├── components/
│   ├── admin/                    # Admin-specific components
│   │   ├── ConnectorWizard.tsx
│   │   └── InquiryTimeline.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── auth/                     # Auth utilities
│   ├── db/                       # Database utilities
│   ├── email/                    # Email service
│   ├── storage/                  # File upload utilities
│   └── validations/              # Zod schemas
└── types/
    ├── database.ts               # Supabase types
    ├── admin.ts                  # Admin types
    └── api.ts                    # API types
```

### 4.4 Database Standards

**Migration Files:**
- Sequential numbering: `001_initial.sql`, `002_add_admin.sql`
- Descriptive names
- ALWAYS include rollback SQL in comments
- Test migrations on staging before production

**Naming Conventions:**
- Tables: snake_case, plural (e.g., `customer_inquiries`)
- Columns: snake_case (e.g., `created_at`)
- Indexes: `idx_table_column` (e.g., `idx_inquiries_status`)
- Foreign keys: `fk_table_column` (e.g., `fk_inquiries_connector`)

**RLS Policies:**
- Always enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Name policies clearly: `policy_table_action_role`
- Example: `policy_connectors_select_authenticated`

### 4.5 Error Handling

**API Routes & Server Actions:**
```typescript
export async function createConnectorAction(data: ConnectorFormData) {
  try {
    // 1. Validate input
    const validated = connectorSchema.parse(data)

    // 2. Check permissions
    const user = await getCurrentUser()
    if (!user || !hasPermission(user, 'connectors.create')) {
      return { success: false, error: 'Unauthorized' }
    }

    // 3. Business logic
    const result = await db.insert(connectors).values(validated)

    // 4. Audit log
    await logAuditEvent({
      user_id: user.id,
      action: 'connector.create',
      resource_id: result.id
    })

    // 5. Return success
    return { success: true, data: result }

  } catch (error) {
    // 6. Error handling
    if (error instanceof ZodError) {
      return { success: false, error: 'Invalid input', details: error.errors }
    }

    // Log unexpected errors
    console.error('[createConnector] Error:', error)

    return { success: false, error: 'Failed to create connector' }
  }
}
```

**Frontend Error Display:**
```typescript
'use client'

import { useFormState } from 'react-dom'
import { toast } from 'sonner'

export function ConnectorForm() {
  const [state, formAction] = useFormState(createConnectorAction, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    if (state?.success) {
      toast.success('Connector created successfully')
    }
  }, [state])

  return <form action={formAction}>...</form>
}
```

---

## 5. Testing Requirements

### 5.1 Unit Tests

**Coverage Target:** 80% for business logic

**What to Test:**
- Server Actions (all CRUD operations)
- Validation schemas (Zod)
- Utility functions (permissions, auto-assignment, etc.)
- Data transformations

**Example:**
```typescript
// tests/unit/inquiries/auto-assignment.test.ts
import { describe, it, expect } from 'vitest'
import { assignInquiry } from '@/lib/inquiries/auto-assignment'

describe('assignInquiry', () => {
  it('assigns German quotes to Germany sales rep', async () => {
    const inquiry = {
      country: 'Germany',
      inquiry_type: 'quote',
      quantity_needed: 100
    }

    const result = await assignInquiry(inquiry)

    expect(result.assigned_to).toBe('user-id-germany-sales')
    expect(result.priority).toBe('high')
  })
})
```

### 5.2 E2E Tests

**Coverage:** All critical user flows

**Flows to Test:**
1. **Admin Login Flow**
   - Invalid credentials → error
   - Valid credentials → dashboard
   - Session persistence → stays logged in
   - Logout → redirects to login

2. **Connector Creation Flow**
   - Step 1 → validation errors
   - Step 1 → step 2 → step 3 → step 4
   - Review → submit → success
   - Verify connector appears in list

3. **Inquiry Submission Flow** (Public)
   - Fill form → submit → success message
   - Verify email notification sent
   - Verify inquiry in admin dashboard

4. **RBAC Flow**
   - super_admin can create connectors ✓
   - translator cannot create connectors ✗
   - sales_viewer can view inquiries ✓
   - sales_viewer cannot delete inquiries ✗

**Example:**
```typescript
// tests/e2e/admin-login.spec.ts
import { test, expect } from '@playwright/test'

test('admin login flow', async ({ page }) => {
  // Navigate to login
  await page.goto('/admin/login')

  // Fill credentials
  await page.fill('input[name="email"]', 'admin@example.com')
  await page.fill('input[name="password"]', 'password123')

  // Submit
  await page.click('button[type="submit"]')

  // Verify redirect to dashboard
  await expect(page).toHaveURL('/admin')

  // Verify user name in UI
  await expect(page.locator('text=Admin User')).toBeVisible()
})
```

### 5.3 Security Testing

**Manual Security Checklist:**
- [ ] RLS policies prevent unauthorized data access
- [ ] File upload validates file types and sizes
- [ ] SQL injection prevention (using Drizzle ORM parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection (Next.js Server Actions have built-in protection)
- [ ] Rate limiting on public APIs (inquiry form)
- [ ] Secure headers (CSP, HSTS, etc.)
- [ ] Environment variables never exposed to client

---

## 6. Documentation Standards

### 6.1 Code Comments

**When to Comment:**
- Complex business logic
- Non-obvious algorithms (e.g., auto-assignment)
- Security-critical code (RLS policies)
- Performance optimizations

**JSDoc for Public Functions:**
```typescript
/**
 * Creates a new connector with versioning support.
 *
 * @param data - Connector data validated against ConnectorCreateSchema
 * @param userId - ID of the user creating the connector (for audit log)
 * @returns Success response with connector ID or error message
 *
 * @example
 * ```ts
 * const result = await createConnector({
 *   model: 'CS-R502K02MA',
 *   series: 'RAST 5',
 *   gender: 'male'
 * }, userId)
 * ```
 */
export async function createConnector(
  data: ConnectorCreateInput,
  userId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  // Implementation
}
```

### 6.2 README Files

**Every major directory needs a README:**

```markdown
# Connector Management

This directory contains the admin interface for managing connectors.

## Structure

- `page.tsx` - Connector list view
- `[id]/page.tsx` - Connector detail/edit view
- `actions.ts` - Server Actions for CRUD operations

## Key Features

- Multi-step wizard for connector creation
- Versioning support
- Bulk import from CSV
- Search and advanced filters

## Permissions

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| super_admin | ✓ | ✓ | ✓ | ✓ |
| content_manager | ✓ | ✓ | ✓ | ✗ |
| translator | ✗ | ✓ | ✗ | ✗ |
| sales_viewer | ✗ | ✓ | ✗ | ✗ |

## Usage

See [ADMIN_USER_GUIDE.md](../../../docs/ADMIN_USER_GUIDE.md)
```

### 6.3 Changelog

**Track all changes in CHANGELOG.md:**

```markdown
# Changelog

## [Unreleased]

### Added
- Admin authentication system with RBAC
- Connector CRUD with multi-step wizard
- Customer inquiry tracking system

### Changed
- Updated database schema with versioning support

### Fixed
- Fixed RLS policies for translator role

## [1.0.0] - 2025-01-15

### Added
- Initial admin backend release
```

---

## 7. Coordination Protocols

### 7.1 Task Assignment Flow

```
1. User requests feature
   ↓
2. Main agent analyzes requirements
   ↓
3. Check IMPLEMENTATION_STRATEGY.md for work package
   ↓
4. Identify dependencies (can it run in parallel?)
   ↓
5. Assign to appropriate sub-agent
   ↓
6. Sub-agent completes work
   ↓
7. Code-Review-Specialist reviews
   ↓
8. Main agent integrates and tests
   ↓
9. Update TODO.md with progress
```

### 7.2 Communication Between Sub-Agents

**Shared Context Files:**
- `TODO.md` - Single source of truth for task tracking
- `PROGRESS.md` - Daily progress updates
- `BLOCKERS.md` - Track blockers and dependencies

**Example Blocker:**
```markdown
# BLOCKERS.md

## [BLOCKED] Work Package 3B: Media Upload UI

**Blocked By:** Work Package 3A (Media Upload Infrastructure)
**Reason:** Needs upload API endpoint to be implemented first
**Assigned To:** Fullstack-Feature-Owner
**ETA:** Sprint 5, Day 3
**Waiting For:** `src/app/api/admin/media/upload/route.ts`
```

### 7.3 Merge Strategy

**Branch Naming:**
```
feature/admin-backend           # Main feature branch
feature/admin-backend-auth      # Sub-feature: Authentication
feature/admin-backend-connectors # Sub-feature: Connector CRUD
feature/admin-backend-inquiries # Sub-feature: Inquiry system
```

**Merge Order:**
1. Sub-feature branches → `feature/admin-backend` (daily/as completed)
2. `feature/admin-backend` → `redesign-professional-template` (after Sprint 2, 4, 6, 8)
3. `redesign-professional-template` → `main` (after Sprint 8 - production launch)

**Merge Checklist:**
- [ ] All tests pass
- [ ] Code reviewed by Code-Review-Specialist
- [ ] No merge conflicts
- [ ] TODO.md updated
- [ ] CHANGELOG.md updated

### 7.4 Daily Workflow

**Start of Day:**
1. Main agent reviews TODO.md
2. Identify parallelizable tasks
3. Assign to sub-agents
4. Update PROGRESS.md with today's goals

**During Day:**
5. Sub-agents work independently
6. Update TODO.md when task status changes
7. Report blockers to BLOCKERS.md immediately

**End of Day:**
8. Main agent reviews completed work
9. Code-Review-Specialist reviews new code
10. Update PROGRESS.md with accomplishments
11. Plan next day's tasks

---

## 8. Quality Gates

### 8.1 Before Merge to feature/admin-backend

**Checklist:**
- [ ] TypeScript compiles with zero errors (`npm run build`)
- [ ] ESLint passes with zero errors (`npm run lint`)
- [ ] All unit tests pass (`npm run test`)
- [ ] Code reviewed and approved
- [ ] No console.log() statements (use proper logging)
- [ ] All TODOs resolved or tracked in TODO.md
- [ ] README updated if needed

### 8.2 Before Sprint Review

**Checklist:**
- [ ] All sprint goals completed
- [ ] E2E tests pass for new features
- [ ] Database migrations tested
- [ ] Performance acceptable (Lighthouse score > 90)
- [ ] Security checklist reviewed
- [ ] Documentation updated
- [ ] Demo prepared for stakeholder review

### 8.3 Before Production Deploy

**Checklist:**
- [ ] All tests pass (unit + E2E)
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Database migrations dry-run successful
- [ ] Environment variables configured
- [ ] Monitoring/logging set up
- [ ] Rollback plan documented
- [ ] User training completed

---

## 9. Risk Mitigation

### 9.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database migration failure | High | Low | Always test on staging; have rollback SQL ready |
| RLS policy misconfiguration | High | Medium | Comprehensive security testing; peer review all policies |
| File upload vulnerabilities | High | Medium | Strict file type/size validation; virus scanning (future) |
| Performance degradation | Medium | Medium | Load testing; query optimization; caching strategy |
| Third-party API failure (Resend) | Medium | Low | Graceful degradation; queue failed emails for retry |

### 9.2 Timeline Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Strict adherence to PRD; defer non-MVP features to Phase 2 |
| Dependencies block parallel work | Medium | Identify critical path; prioritize foundation tasks |
| Sub-agent availability | Low | Clear work packages; can reassign tasks if needed |

---

## 10. Success Criteria

### 10.1 Sprint 2 Success (Foundation Complete)

- [ ] Admin users can log in with email/password
- [ ] RBAC enforced (4 roles working correctly)
- [ ] Admin layout with navigation functional
- [ ] Audit logs capture all admin actions
- [ ] Basic user management UI works

### 10.2 Sprint 4 Success (Connector CRUD Complete)

- [ ] Can create connector via 4-step wizard in < 3 minutes
- [ ] All connector fields validated
- [ ] Versioning tracks all changes
- [ ] Can search/filter connectors
- [ ] Can edit and delete connectors (with permissions)

### 10.3 Sprint 6 Success (Media & Inquiries Complete)

- [ ] Can upload media files (images, PDFs, CAD)
- [ ] Media correctly associated with connectors
- [ ] Public inquiry form works and sends emails
- [ ] Admin can view/assign/respond to inquiries
- [ ] Auto-assignment logic working
- [ ] Inquiry timeline shows all activities

### 10.4 Sprint 8 Success (Production Ready)

- [ ] All E2E tests passing
- [ ] Security audit passed
- [ ] Performance benchmarks met:
  - Page load < 2s
  - API response < 500ms
  - Lighthouse score > 90
- [ ] Production deployed successfully
- [ ] Zero critical bugs in first week

---

## 11. Next Steps

### Immediate Actions (Sprint 1, Day 1)

1. **Main Agent:**
   - Create Sprint 1 task breakdown in TODO.md
   - Set up branch structure
   - Initialize PROGRESS.md and BLOCKERS.md

2. **Backend-Architect:**
   - Review database schema from TECHNICAL_DESIGN_DOCUMENT.md
   - Approve or suggest modifications

3. **Fullstack-Feature-Owner:**
   - Start Work Package 1A (Database Foundation)
   - Create first migration file

4. **UI-Engineer:**
   - Start Work Package 1C (Admin Layout) in parallel
   - Create admin layout structure with mock data

### Sprint 1 Deliverables (by end of Week 1)

- Database tables created (admin_users, audit_logs)
- RLS policies implemented
- Admin login page functional
- Admin layout with navigation

---

## Appendix A: Tool Configuration

### ESLint Config

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error', // No any types
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error'
  }
}
```

### Prettier Config

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

---

## Appendix B: Email Templates

### Welcome Email (New Inquiry)

```typescript
// src/lib/email/templates/inquiry-received.ts
export const inquiryReceivedTemplate = (data: {
  inquiryNumber: string
  customerName: string
  connectorModel?: string
}) => ({
  subject: `Inquiry Received - ${data.inquiryNumber}`,
  html: `
    <h2>Thank you for your inquiry</h2>
    <p>Dear ${data.customerName},</p>
    <p>We have received your inquiry (${data.inquiryNumber}) ${
      data.connectorModel ? `regarding ${data.connectorModel}` : ''
    }.</p>
    <p>Our team will review your request and respond within 24 hours.</p>
    <p>Best regards,<br>RAST Team</p>
  `
})
```

### Internal Notification (New Inquiry Assignment)

```typescript
// src/lib/email/templates/inquiry-assigned.ts
export const inquiryAssignedTemplate = (data: {
  inquiryNumber: string
  customerName: string
  assignedToName: string
  priority: string
}) => ({
  subject: `New ${data.priority} Priority Inquiry - ${data.inquiryNumber}`,
  html: `
    <h2>New Inquiry Assigned</h2>
    <p>Hi ${data.assignedToName},</p>
    <p>You have been assigned a new ${data.priority} priority inquiry:</p>
    <ul>
      <li><strong>Inquiry Number:</strong> ${data.inquiryNumber}</li>
      <li><strong>Customer:</strong> ${data.customerName}</li>
      <li><strong>Priority:</strong> ${data.priority}</li>
    </ul>
    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/inquiries/${data.inquiryNumber}">View Inquiry</a></p>
  `
})
```

---

**Document Status:** ✅ Complete - Ready for implementation
**Last Updated:** 2025-01-08
**Next Review:** After Sprint 2 completion
