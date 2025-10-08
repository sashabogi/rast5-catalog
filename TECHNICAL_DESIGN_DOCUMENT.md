# Technical Design Document: RAST 5 Admin Backend
## Phase 1 MVP Implementation

**Version:** 1.0
**Date:** October 2025
**Target:** 8-10 week implementation

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS (Browsers)                         │
│  Admin Users (Internal) | Public Engineers (External)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              VERCEL EDGE NETWORK (CDN)                      │
│  - SSL Termination                                          │
│  - DDoS Protection                                          │
│  - Edge Caching                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           NEXT.JS 15 APPLICATION (Vercel)                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ROUTING                                            │  │
│  │  ───────                                            │  │
│  │  app/(public)/[locale]/     → Public catalog        │  │
│  │  app/(admin)/admin/         → Admin portal          │  │
│  │  app/api/admin/             → Admin APIs            │  │
│  │  app/api/inquiries/         → Public inquiry API    │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  MIDDLEWARE                                         │  │
│  │  ──────────                                         │  │
│  │  - Auth check (admin routes)                        │  │
│  │  - RBAC enforcement                                 │  │
│  │  - Rate limiting                                    │  │
│  │  - Locale detection                                 │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                SUPABASE PLATFORM                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  PostgreSQL  │  │   Storage    │  │      Auth       │  │
│  │  Database    │  │   (S3-like)  │  │   (JWT-based)   │  │
│  │              │  │              │  │                 │  │
│  │  Tables:     │  │  Buckets:    │  │  - Email/Pass   │  │
│  │  - connectors│  │  - videos    │  │  - Sessions     │  │
│  │  - inquiries │  │  - images    │  │  - 2FA (Phase 2)│  │
│  │  - admin_usr │  │  - cad-files │  │                 │  │
│  │  - audit_log │  │  - pdfs      │  │                 │  │
│  │              │  │              │  │                 │  │
│  │  RLS Enabled │  │  Public URLs │  │  Custom Claims  │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Frontend (Next.js App Router):**
- Public Site: Existing catalog (already built)
- Admin Portal: New admin interface
- Shared Components: UI library (shadcn/ui)

**Backend (Next.js Server):**
- Server Actions: Form mutations, CRUD operations
- Route Handlers: File uploads, public APIs, exports
- Middleware: Auth, RBAC, rate limiting

**Database (Supabase PostgreSQL):**
- Tables: 10 core tables for MVP
- RLS Policies: Row-level security per user role
- Triggers: Auto-logging, auto-numbering

**Storage (Supabase Storage):**
- Organized by media type
- Direct upload from client
- CDN-backed URLs

**Email (Resend):**
- Inquiry notifications
- Admin invites
- Password resets

---

## 2. Database Design

### Core Tables Schema

```sql
-- =============================================
-- ADMIN USERS
-- =============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales_viewer'
    CHECK (role IN ('super_admin', 'content_manager', 'translator', 'sales_viewer')),

  -- Auth (handled by Supabase Auth, this is metadata)
  supabase_auth_id UUID UNIQUE REFERENCES auth.users(id),

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active, role);

-- =============================================
-- CUSTOMER INQUIRIES
-- =============================================
CREATE TABLE customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number TEXT UNIQUE NOT NULL, -- Auto-generated: INQ-20251008-001

  -- Contact Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,

  -- Inquiry Details
  inquiry_type TEXT NOT NULL
    CHECK (inquiry_type IN ('quote', 'samples', 'technical', 'general')),
  connector_id TEXT REFERENCES connectors(id),
  connector_model TEXT,
  quantity_needed INTEGER,
  application_description TEXT,
  technical_question TEXT,

  -- Project Context
  project_timeline TEXT,
  annual_volume TEXT,
  how_did_you_hear TEXT,
  newsletter_opt_in BOOLEAN DEFAULT false,

  -- Status & Assignment
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'quoted', 'won', 'lost', 'closed')),
  assigned_to UUID REFERENCES admin_users(id),
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Lead Scoring (calculated)
  lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,

  -- Sales Tracking
  quote_sent_at TIMESTAMPTZ,
  quote_amount DECIMAL(12,2),
  close_date TIMESTAMPTZ,
  close_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON customer_inquiries(status, submitted_at DESC);
CREATE INDEX idx_inquiries_assigned ON customer_inquiries(assigned_to, status);
CREATE INDEX idx_inquiries_connector ON customer_inquiries(connector_id);
CREATE INDEX idx_inquiries_email ON customer_inquiries(email);
CREATE INDEX idx_inquiries_submitted ON customer_inquiries(submitted_at DESC);

-- =============================================
-- INQUIRY ACTIVITIES
-- =============================================
CREATE TABLE inquiry_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES customer_inquiries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id),

  activity_type TEXT NOT NULL
    CHECK (activity_type IN ('note', 'status_change', 'assignment', 'email_sent', 'viewed')),
  description TEXT NOT NULL,
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiry_activities_inquiry ON inquiry_activities(inquiry_id, created_at DESC);
CREATE INDEX idx_inquiry_activities_user ON inquiry_activities(user_id, created_at DESC);

-- =============================================
-- CONNECTOR ENHANCEMENTS (extend existing table)
-- =============================================
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'
  CHECK (status IN ('draft', 'review', 'published', 'archived'));

ALTER TABLE connectors ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Documentation fields
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS datasheet_pdf TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS cad_step TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS cad_iges TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS cad_dxf TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS certifications JSONB;

-- Analytics fields
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0;

CREATE INDEX idx_connectors_status ON connectors(status, published_at DESC);
CREATE INDEX idx_connectors_created_by ON connectors(created_by);
CREATE INDEX idx_connectors_deleted ON connectors(deleted_at) WHERE deleted_at IS NOT NULL;

-- =============================================
-- CONNECTOR VERSIONS (history)
-- =============================================
CREATE TABLE connector_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id TEXT NOT NULL REFERENCES connectors(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  data JSONB NOT NULL, -- Full connector snapshot

  changed_by UUID REFERENCES admin_users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_summary TEXT,

  UNIQUE(connector_id, version)
);

CREATE INDEX idx_versions_connector ON connector_versions(connector_id, version DESC);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),

  user_id UUID REFERENCES admin_users(id),
  user_email TEXT NOT NULL,

  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,

  changes JSONB,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_user ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action, timestamp DESC);

-- Partition by month for performance
CREATE TABLE audit_logs_2025_10 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- =============================================
-- TRANSLATIONS (existing, add indexes)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_translations_entity
  ON translations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_translations_lang
  ON translations(language);
CREATE INDEX IF NOT EXISTS idx_translations_incomplete
  ON translations(entity_type, language)
  WHERE is_verified = false;

-- =============================================
-- MEDIA FILES TRACKING
-- =============================================
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File Info
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('video', 'image', 'pdf', 'cad')),
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,

  -- Storage
  bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,

  -- Usage
  used_in_connectors TEXT[],
  download_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,

  -- Metadata
  uploaded_by UUID REFERENCES admin_users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_type ON media_files(file_type);
CREATE INDEX idx_media_bucket ON media_files(bucket);
CREATE INDEX idx_media_uploaded ON media_files(uploaded_at DESC);

-- =============================================
-- DOWNLOAD LOGS (analytics)
-- =============================================
CREATE TABLE download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  connector_id TEXT REFERENCES connectors(id),
  file_type TEXT NOT NULL, -- 'datasheet', 'cad_step', 'technical_drawing'

  -- User Info (anonymous)
  ip_address INET,
  country TEXT,
  user_agent TEXT,
  referrer_url TEXT,

  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_downloads_connector ON download_logs(connector_id, downloaded_at DESC);
CREATE INDEX idx_downloads_type ON download_logs(file_type, downloaded_at DESC);
CREATE INDEX idx_downloads_date ON download_logs(downloaded_at DESC);
```

### Database Triggers

```sql
-- Auto-generate inquiry number
CREATE OR REPLACE FUNCTION generate_inquiry_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.inquiry_number := 'INQ-' ||
    TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    LPAD((
      SELECT COUNT(*) + 1
      FROM customer_inquiries
      WHERE DATE(submitted_at) = CURRENT_DATE
    )::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_inquiry_number
  BEFORE INSERT ON customer_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION generate_inquiry_number();

-- Auto-increment connector inquiry count
CREATE OR REPLACE FUNCTION increment_inquiry_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.connector_id IS NOT NULL THEN
    UPDATE connectors
    SET inquiry_count = inquiry_count + 1
    WHERE id = NEW.connector_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inquiry_count
  AFTER INSERT ON customer_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION increment_inquiry_count();

-- Log inquiry status changes
CREATE OR REPLACE FUNCTION log_inquiry_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO inquiry_activities (
      inquiry_id,
      user_id,
      activity_type,
      description,
      metadata
    )
    VALUES (
      NEW.id,
      auth.uid(),
      'status_change',
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_inquiry_status
  AFTER UPDATE ON customer_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION log_inquiry_status_change();

-- Auto-version connectors on update
CREATE OR REPLACE FUNCTION save_connector_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only version if actually published
  IF NEW.status = 'published' AND (OLD.status != 'published' OR OLD.version != NEW.version) THEN
    INSERT INTO connector_versions (
      connector_id,
      version,
      data,
      changed_by,
      change_summary
    )
    VALUES (
      NEW.id,
      NEW.version,
      row_to_json(NEW),
      auth.uid(),
      'Published version ' || NEW.version
    );

    NEW.version := NEW.version + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER version_connector
  BEFORE UPDATE ON connectors
  FOR EACH ROW
  EXECUTE FUNCTION save_connector_version();
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin users: Super admin and content manager have full access
CREATE POLICY "Admin full access"
  ON connectors
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE supabase_auth_id = auth.uid()
      AND role IN ('super_admin', 'content_manager')
      AND is_active = true
    )
  );

-- Translators: Read all, update translations only
CREATE POLICY "Translator read access"
  ON connectors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE supabase_auth_id = auth.uid()
      AND role = 'translator'
      AND is_active = true
    )
  );

-- Sales viewers: Read only
CREATE POLICY "Sales viewer read access"
  ON connectors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE supabase_auth_id = auth.uid()
      AND role = 'sales_viewer'
      AND is_active = true
    )
  );

-- Inquiries: All admin roles can read
CREATE POLICY "Admin inquiry access"
  ON customer_inquiries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE supabase_auth_id = auth.uid()
      AND is_active = true
    )
  );

-- Public can insert inquiries
CREATE POLICY "Public can create inquiries"
  ON customer_inquiries
  FOR INSERT
  WITH CHECK (true); -- Anyone can submit

-- Audit logs: Read-only for admins
CREATE POLICY "Admin read audit logs"
  ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE supabase_auth_id = auth.uid()
      AND role IN ('super_admin', 'content_manager')
      AND is_active = true
    )
  );
```

---

## 3. API Design

### API Route Structure

```
/api/
├── admin/                    # Protected admin APIs
│   ├── auth/
│   │   ├── login/           # POST - Admin login
│   │   ├── logout/          # POST - Admin logout
│   │   └── me/              # GET - Current user
│   │
│   ├── connectors/
│   │   ├── route.ts         # GET (list), POST (create)
│   │   ├── [id]/route.ts    # GET, PUT, DELETE
│   │   ├── [id]/publish/    # POST - Publish connector
│   │   └── bulk/route.ts    # POST - Bulk operations
│   │
│   ├── inquiries/
│   │   ├── route.ts         # GET (list), POST (admin create)
│   │   ├── [id]/route.ts    # GET, PUT, DELETE
│   │   ├── [id]/assign/     # POST - Assign to rep
│   │   ├── [id]/notes/      # POST - Add note
│   │   └── stats/route.ts   # GET - Inquiry analytics
│   │
│   ├── media/
│   │   ├── upload/route.ts  # POST - Upload file
│   │   ├── signed-url/      # POST - Get signed upload URL
│   │   └── [id]/route.ts    # DELETE - Remove file
│   │
│   ├── translations/
│   │   ├── route.ts         # GET (list), PUT (update)
│   │   ├── export/route.ts  # GET - Export for vendor
│   │   └── import/route.ts  # POST - Import translations
│   │
│   ├── analytics/
│   │   ├── dashboard/       # GET - Dashboard stats
│   │   └── downloads/       # GET - Download analytics
│   │
│   └── audit/
│       └── route.ts         # GET - Audit logs
│
└── inquiries/               # Public inquiry API
    └── route.ts             # POST - Submit inquiry (public)
```

### Server Actions vs Route Handlers

**Decision Matrix:**

| Use Case | Approach | Rationale |
|----------|----------|-----------|
| Form submission (create/update connector) | Server Action | Progressive enhancement, simpler code |
| File upload | Route Handler | Streaming support, progress tracking |
| Bulk operations | Route Handler | Long-running, background processing |
| Public inquiry form | Route Handler | No auth, needs custom response |
| Simple mutations | Server Action | Type-safe, automatic revalidation |
| Data export | Route Handler | File download, custom headers |
| Webhook endpoints | Route Handler | External services need REST |

### TypeScript API Interfaces

```typescript
// lib/types/api.ts

// ============= CONNECTOR APIs =============
export interface CreateConnectorRequest {
  model: string;
  display_name: string;
  series: string;
  category: string;
  pole_count: number;
  connector_type: 'R' | 'T' | 'S';
  gender: 'Female' | 'Male' | 'PCB';
  // ... all other fields from form
}

export interface CreateConnectorResponse {
  success: boolean;
  data?: Connector;
  error?: string;
}

export interface ListConnectorsRequest {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  series?: string;
  search?: string;
}

export interface ListConnectorsResponse {
  data: Connector[];
  total: number;
  page: number;
  limit: number;
}

// ============= INQUIRY APIs =============
export interface SubmitInquiryRequest {
  full_name: string;
  email: string;
  company: string;
  phone?: string;
  country: string;
  inquiry_type: 'quote' | 'samples' | 'technical' | 'general';
  connector_id?: string;
  connector_model?: string;
  quantity_needed?: number;
  application_description?: string;
  technical_question?: string;
  project_timeline?: string;
  annual_volume?: string;
  how_did_you_hear?: string;
  newsletter_opt_in?: boolean;
}

export interface SubmitInquiryResponse {
  success: boolean;
  inquiry_number?: string;
  message: string;
}

export interface AssignInquiryRequest {
  inquiry_id: string;
  assigned_to: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

// ============= MEDIA APIs =============
export interface UploadMediaRequest {
  file: File;
  connector_id?: string;
  file_type: 'video' | 'image' | 'pdf' | 'cad';
}

export interface UploadMediaResponse {
  success: boolean;
  url?: string;
  media_id?: string;
  error?: string;
}

export interface SignedUploadUrlRequest {
  filename: string;
  content_type: string;
  size: number;
  bucket: string;
}

export interface SignedUploadUrlResponse {
  signed_url: string;
  storage_path: string;
  expires_at: string;
}
```

### Error Handling Strategy

```typescript
// lib/utils/api-error.ts

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

// Usage in route handler
export async function POST(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    return handleAPIError(error);
  }
}
```

---

## 4. Frontend Architecture

### Route Structure

```
app/
├── (public)/
│   ├── [locale]/
│   │   ├── catalog/
│   │   ├── connector/[id]/
│   │   ├── resources/
│   │   └── contact/          # Inquiry form page
│   └── layout.tsx
│
└── (admin)/
    └── admin/
        ├── layout.tsx         # Admin shell
        ├── page.tsx           # Dashboard
        │
        ├── connectors/
        │   ├── page.tsx       # List connectors
        │   ├── new/
        │   │   └── page.tsx   # Create wizard
        │   └── [id]/
        │       ├── page.tsx   # Edit
        │       └── history/   # Version history
        │
        ├── inquiries/
        │   ├── page.tsx       # List inquiries
        │   └── [id]/
        │       └── page.tsx   # Inquiry detail
        │
        ├── media/
        │   └── page.tsx       # Media library
        │
        ├── translations/
        │   ├── page.tsx       # Translation dashboard
        │   └── [id]/
        │       └── page.tsx   # Translate connector
        │
        ├── analytics/
        │   └── page.tsx       # Analytics dashboard
        │
        └── settings/
            ├── page.tsx       # General settings
            ├── users/         # User management
            └── series/        # Series management
```

### Component Hierarchy

```
components/
├── admin/
│   ├── layout/
│   │   ├── AdminShell.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── Header.tsx              # Top header with user menu
│   │   └── Breadcrumbs.tsx         # Breadcrumb navigation
│   │
│   ├── connectors/
│   │   ├── ConnectorList.tsx       # Paginated table
│   │   ├── ConnectorForm.tsx       # Multi-step form
│   │   ├── ConnectorWizard.tsx     # Wizard wrapper
│   │   ├── FormSteps/
│   │   │   ├── BasicInfoStep.tsx
│   │   │   ├── TechnicalSpecsStep.tsx
│   │   │   ├── MediaStep.tsx
│   │   │   ├── CompatibilityStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── ConnectorCard.tsx       # Preview card
│   │   └── ConnectorFilters.tsx    # Filter sidebar
│   │
│   ├── inquiries/
│   │   ├── InquiryList.tsx         # List with filters
│   │   ├── InquiryCard.tsx         # Inquiry preview
│   │   ├── InquiryDetail.tsx       # Full detail view
│   │   ├── InquiryActions.tsx      # Assign, update status
│   │   ├── InquiryTimeline.tsx     # Activity timeline
│   │   └── InquiryFilters.tsx      # Status/priority filters
│   │
│   ├── media/
│   │   ├── MediaLibrary.tsx        # Grid view
│   │   ├── MediaUploader.tsx       # Drag-and-drop uploader
│   │   ├── MediaCard.tsx           # Media preview
│   │   └── MediaFilters.tsx        # Type/date filters
│   │
│   ├── translations/
│   │   ├── TranslationEditor.tsx   # Side-by-side editor
│   │   ├── TranslationProgress.tsx # Progress indicators
│   │   └── LanguageSelector.tsx    # Language switcher
│   │
│   ├── analytics/
│   │   ├── DashboardWidget.tsx     # Metric card
│   │   ├── InquiryChart.tsx        # Chart component
│   │   └── TopProductsList.tsx     # Top 10 list
│   │
│   └── common/
│       ├── DataTable.tsx           # Reusable table
│       ├── StatusBadge.tsx         # Status indicators
│       ├── LoadingState.tsx        # Loading skeletons
│       ├── EmptyState.tsx          # Empty list states
│       └── ConfirmDialog.tsx       # Confirmation modals
│
└── ui/                              # shadcn/ui components
    ├── button.tsx
    ├── dialog.tsx
    ├── form.tsx
    └── ...
```

### State Management

**Approach: Server Components + Server Actions (No Client State Library)**

```typescript
// app/(admin)/admin/connectors/page.tsx
// Server Component - fetches data
export default async function ConnectorsPage({
  searchParams
}: {
  searchParams: { page?: string; status?: string }
}) {
  const page = parseInt(searchParams.page || '1');
  const status = searchParams.status;

  // Fetch data server-side
  const { data: connectors, total } = await getConnectors({
    page,
    status
  });

  return (
    <div>
      <ConnectorList
        connectors={connectors}
        total={total}
        page={page}
      />
    </div>
  );
}

// components/admin/connectors/ConnectorList.tsx
// Client Component - handles interactions
'use client'

import { deleteConnector } from '@/app/actions/connectors'

export function ConnectorList({ connectors, total, page }) {
  async function handleDelete(id: string) {
    if (confirm('Delete this connector?')) {
      await deleteConnector(id);
      // Next.js auto-revalidates and re-renders
    }
  }

  return (
    <table>
      {connectors.map(connector => (
        <tr key={connector.id}>
          <td>{connector.model}</td>
          <td>
            <button onClick={() => handleDelete(connector.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </table>
  );
}

// app/actions/connectors.ts
// Server Action
'use server'

import { revalidatePath } from 'next/cache'

export async function deleteConnector(id: string) {
  const user = await requireAdmin(['super_admin']);

  await supabase
    .from('connectors')
    .update({ deleted_at: new Date() })
    .eq('id', id);

  await logAudit({
    user_id: user.id,
    action: 'delete',
    entity_type: 'connector',
    entity_id: id
  });

  revalidatePath('/admin/connectors');
}
```

### Form Handling

**React Hook Form + Zod Validation**

```typescript
// components/admin/connectors/ConnectorForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { connectorSchema } from '@/lib/schemas/connector'

export function ConnectorForm() {
  const form = useForm({
    resolver: zodResolver(connectorSchema),
    defaultValues: {
      model: '',
      display_name: '',
      pole_count: 2,
      // ...
    }
  });

  async function onSubmit(data: ConnectorFormData) {
    const result = await createConnector(data);

    if (result.success) {
      toast.success('Connector created!');
      router.push('/admin/connectors');
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... more fields */}
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
```

---

## 5. Key Features - Technical Specs

### Multi-Step Wizard Implementation

```typescript
// components/admin/connectors/ConnectorWizard.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

const STEPS = [
  { id: 1, name: 'Basic Info', component: BasicInfoStep },
  { id: 2, name: 'Technical Specs', component: TechnicalSpecsStep },
  { id: 3, name: 'Media', component: MediaStep },
  { id: 4, name: 'Compatibility', component: CompatibilityStep },
  { id: 5, name: 'Review', component: ReviewStep },
];

export function ConnectorWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<ConnectorFormData>();

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = form.getValues();
      await saveDraft(data);
    }, 30000);

    return () => clearInterval(interval);
  }, [form]);

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {STEPS.map(step => (
          <div
            key={step.id}
            className={cn(
              'flex-1 border-t-2',
              step.id <= currentStep
                ? 'border-green-500'
                : 'border-gray-300'
            )}
          >
            <span className="text-sm">{step.name}</span>
          </div>
        ))}
      </div>

      {/* Current step */}
      <CurrentStepComponent
        form={form}
        onNext={() => setCurrentStep(s => s + 1)}
        onBack={() => setCurrentStep(s => s - 1)}
      />
    </div>
  );
}
```

### File Upload Strategy

**Direct Upload to Supabase Storage**

```typescript
// components/admin/media/MediaUploader.tsx
'use client'

import { useState } from 'react'
import { uploadToSupabase } from '@/lib/media/upload'

export function MediaUploader({ connectorId }: { connectorId?: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload(files: FileList) {
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        // 1. Get signed upload URL from backend
        const { signed_url, storage_path } = await fetch('/api/admin/media/signed-url', {
          method: 'POST',
          body: JSON.stringify({
            filename: file.name,
            content_type: file.type,
            size: file.size,
            bucket: 'connector-videos'
          })
        }).then(r => r.json());

        // 2. Upload directly to Supabase Storage with progress
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          setProgress((e.loaded / e.total) * 100);
        });

        await new Promise((resolve, reject) => {
          xhr.open('PUT', signed_url);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = () => reject(xhr.statusText);
          xhr.send(file);
        });

        // 3. Notify backend of successful upload
        await fetch('/api/admin/media/complete', {
          method: 'POST',
          body: JSON.stringify({
            storage_path,
            connector_id: connectorId,
            original_filename: file.name
          })
        });

        toast.success(`${file.name} uploaded!`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setProgress(0);
  }

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
    >
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {uploading ? (
          <div>
            <p>Uploading... {Math.round(progress)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p>Drag files here or click to upload</p>
        )}
      </label>
    </div>
  );
}
```

### Inquiry Auto-Assignment

```typescript
// lib/inquiries/auto-assign.ts

interface AssignmentRule {
  condition: (inquiry: Inquiry) => boolean;
  assignTo: string; // admin_user_id
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

const ASSIGNMENT_RULES: AssignmentRule[] = [
  {
    condition: (inq) =>
      inq.country === 'Germany' && inq.inquiry_type === 'quote',
    assignTo: 'user-id-germany-sales',
    priority: 'high'
  },
  {
    condition: (inq) =>
      inq.quantity_needed && inq.quantity_needed > 10000,
    assignTo: 'user-id-key-accounts',
    priority: 'urgent'
  },
  {
    condition: (inq) =>
      inq.inquiry_type === 'technical',
    assignTo: 'user-id-engineering',
    priority: 'normal'
  },
  // Default: Round-robin to sales team
  {
    condition: () => true,
    assignTo: 'user-id-round-robin',
    priority: 'normal'
  }
];

export async function autoAssignInquiry(inquiry: Inquiry) {
  // Find first matching rule
  const rule = ASSIGNMENT_RULES.find(r => r.condition(inquiry));

  if (!rule) {
    throw new Error('No assignment rule matched');
  }

  // Get assignee (handle round-robin)
  let assignedTo = rule.assignTo;
  if (assignedTo === 'user-id-round-robin') {
    assignedTo = await getRoundRobinUser();
  }

  // Update inquiry
  await supabase
    .from('customer_inquiries')
    .update({
      assigned_to: assignedTo,
      priority: rule.priority,
      status: 'in_progress'
    })
    .eq('id', inquiry.id);

  // Send notification
  await sendAssignmentNotification(inquiry, assignedTo);

  return assignedTo;
}

async function getRoundRobinUser() {
  // Get sales users ordered by least recent assignment
  const { data: users } = await supabase
    .from('admin_users')
    .select(`
      id,
      last_assigned_inquiry_at
    `)
    .eq('role', 'sales_viewer')
    .eq('is_active', true)
    .order('last_assigned_inquiry_at', { ascending: true, nullsFirst: true })
    .limit(1);

  return users?.[0]?.id;
}
```

---

## 6. Security Implementation

### Authentication Middleware

```typescript
// middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('supabase_auth_id', session.user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }

    // Add user info to headers for downstream use
    res.headers.set('x-admin-role', adminUser.role)
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### Permission Checking

```typescript
// lib/admin/permissions.ts

export const PERMISSIONS = {
  'connectors:create': ['super_admin', 'content_manager'],
  'connectors:update': ['super_admin', 'content_manager'],
  'connectors:delete': ['super_admin'],
  'connectors:publish': ['super_admin', 'content_manager'],

  'inquiries:read': ['super_admin', 'content_manager', 'sales_viewer'],
  'inquiries:update': ['super_admin', 'sales_viewer'],
  'inquiries:delete': ['super_admin'],

  'translations:edit': ['super_admin', 'content_manager', 'translator'],

  'media:upload': ['super_admin', 'content_manager'],
  'media:delete': ['super_admin', 'content_manager'],

  'users:manage': ['super_admin'],
  'audit:read': ['super_admin', 'content_manager'],
};

export function hasPermission(
  userRole: string,
  permission: keyof typeof PERMISSIONS
): boolean {
  return PERMISSIONS[permission]?.includes(userRole) || false;
}

export async function requirePermission(permission: keyof typeof PERMISSIONS) {
  const user = await getCurrentAdminUser();

  if (!hasPermission(user.role, permission)) {
    throw new APIError('Insufficient permissions', 403);
  }

  return user;
}

// Usage in Server Action
export async function deleteConnector(id: string) {
  const user = await requirePermission('connectors:delete');

  // ... proceed with delete
}
```

### Input Validation with Zod

```typescript
// lib/schemas/connector.ts

import { z } from 'zod'

export const connectorSchema = z.object({
  model: z.string()
    .min(3, 'Model must be at least 3 characters')
    .max(50, 'Model too long')
    .regex(/^[A-Z0-9-]+$/, 'Model must be alphanumeric with dashes'),

  display_name: z.string()
    .min(5, 'Display name too short')
    .max(200, 'Display name too long'),

  series: z.string(),
  category: z.string(),

  pole_count: z.number()
    .int()
    .min(1, 'Invalid pole count')
    .max(100, 'Pole count too high'),

  connector_type: z.enum(['R', 'T', 'S']),
  gender: z.enum(['Female', 'Male', 'PCB']),
  orientation: z.enum(['Horizontal', 'Vertical']).optional(),

  wire_gauge_min: z.number().optional(),
  wire_gauge_max: z.number().optional(),

  current_rating: z.number().positive().optional(),
  voltage_rating: z.number().positive().optional(),

  // Ensure min < max
}).refine(
  (data) => {
    if (data.wire_gauge_min && data.wire_gauge_max) {
      return data.wire_gauge_min < data.wire_gauge_max;
    }
    return true;
  },
  {
    message: 'Min wire gauge must be less than max',
    path: ['wire_gauge_min']
  }
);

// lib/schemas/inquiry.ts

export const inquirySchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  company: z.string().min(2, 'Company required'),
  phone: z.string().optional(),
  country: z.string().min(2, 'Country required'),

  inquiry_type: z.enum(['quote', 'samples', 'technical', 'general']),

  connector_id: z.string().optional(),
  connector_model: z.string().optional(),
  quantity_needed: z.number().int().positive().optional(),

  application_description: z.string().max(1000).optional(),
  technical_question: z.string().max(1000).optional(),

  project_timeline: z.string().optional(),
  annual_volume: z.string().optional(),
  how_did_you_hear: z.string().optional(),
  newsletter_opt_in: z.boolean().default(false),
});
```

---

## 7. Performance Optimization

### Database Query Optimization

```typescript
// lib/queries/connectors.ts

// BAD: Fetches all columns including large JSONB
export async function getConnectors() {
  return await supabase
    .from('connectors')
    .select('*'); // Don't do this
}

// GOOD: Select only needed columns
export async function getConnectors({
  page = 1,
  limit = 50,
  status
}: ListConnectorsRequest) {
  const offset = (page - 1) * limit;

  const query = supabase
    .from('connectors')
    .select(`
      id,
      model,
      display_name,
      pole_count,
      gender,
      status,
      created_at,
      updated_at
    `, { count: 'exact' });

  if (status) {
    query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, total: count || 0 };
}

// Use .single() for single record queries
export async function getConnector(id: string) {
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', id)
    .single(); // Returns object, not array

  if (error) throw error;
  return data;
}
```

### Caching Strategy

```typescript
// app/(admin)/admin/connectors/page.tsx

import { unstable_cache } from 'next/cache'

// Cache connector list for 5 minutes
const getCachedConnectors = unstable_cache(
  async (page: number, status?: string) => {
    return await getConnectors({ page, status });
  },
  ['connectors-list'],
  {
    revalidate: 300, // 5 minutes
    tags: ['connectors']
  }
);

export default async function ConnectorsPage({ searchParams }) {
  const data = await getCachedConnectors(
    parseInt(searchParams.page || '1'),
    searchParams.status
  );

  return <ConnectorList {...data} />;
}

// Revalidate cache in Server Action
'use server'

import { revalidateTag } from 'next/cache'

export async function createConnector(data: ConnectorFormData) {
  // ... create connector

  revalidateTag('connectors'); // Invalidate cache
  revalidatePath('/admin/connectors');
}
```

### Image Optimization

```typescript
// components/admin/media/MediaCard.tsx

import Image from 'next/image'

export function MediaCard({ media }: { media: MediaFile }) {
  return (
    <div className="relative aspect-square">
      <Image
        src={media.public_url}
        alt={media.original_filename}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
      />
    </div>
  );
}
```

---

## 8. Error Handling & Logging

### Error Boundaries

```typescript
// app/(admin)/admin/error.tsx

'use client'

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to Sentry
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

### Toast Notifications

```typescript
// lib/toast.ts

import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 3000,
      position: 'top-right'
    });
  },

  error: (message: string) => {
    sonnerToast.error(message, {
      duration: 5000,
      position: 'top-right'
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message, {
      position: 'top-right'
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    { loading, success, error }: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      position: 'top-right'
    });
  }
};

// Usage
await toast.promise(
  createConnector(data),
  {
    loading: 'Creating connector...',
    success: 'Connector created!',
    error: 'Failed to create connector'
  }
);
```

### Audit Logging

```typescript
// lib/admin/audit.ts

export async function logAudit({
  user_id,
  action,
  entity_type,
  entity_id,
  changes,
  ip_address,
  user_agent
}: {
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
}) {
  const { data: user } = await supabase
    .from('admin_users')
    .select('email')
    .eq('id', user_id)
    .single();

  await supabase.from('audit_logs').insert({
    user_id,
    user_email: user?.email || 'unknown',
    action,
    entity_type,
    entity_id,
    changes,
    ip_address,
    user_agent
  });
}

// Usage in Server Action
export async function updateConnector(id: string, data: Partial<Connector>) {
  const user = await requirePermission('connectors:update');
  const ip = headers().get('x-forwarded-for');
  const userAgent = headers().get('user-agent');

  const { data: old } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', id)
    .single();

  const { data: updated } = await supabase
    .from('connectors')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  await logAudit({
    user_id: user.id,
    action: 'update',
    entity_type: 'connector',
    entity_id: id,
    changes: {
      before: old,
      after: updated
    },
    ip_address: ip,
    user_agent: userAgent
  });

  revalidatePath(`/admin/connectors/${id}`);
  return updated;
}
```

---

## 9. Testing Strategy

### Unit Tests (Vitest)

```typescript
// lib/inquiries/__tests__/auto-assign.test.ts

import { describe, it, expect, vi } from 'vitest'
import { autoAssignInquiry } from '../auto-assign'

describe('autoAssignInquiry', () => {
  it('assigns German quotes to German sales rep', async () => {
    const inquiry = {
      id: 'test-id',
      country: 'Germany',
      inquiry_type: 'quote',
      quantity_needed: 1000
    };

    const assignedTo = await autoAssignInquiry(inquiry);

    expect(assignedTo).toBe('user-id-germany-sales');
  });

  it('marks high-quantity inquiries as urgent', async () => {
    const inquiry = {
      id: 'test-id',
      country: 'USA',
      inquiry_type: 'quote',
      quantity_needed: 15000
    };

    const assignedTo = await autoAssignInquiry(inquiry);

    const { data } = await supabase
      .from('customer_inquiries')
      .select('priority')
      .eq('id', inquiry.id)
      .single();

    expect(data.priority).toBe('urgent');
  });
});
```

### Integration Tests (Playwright)

```typescript
// e2e/admin/inquiries.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Inquiry Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('[name=email]', 'admin@test.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button[type=submit]');
    await page.waitForURL('/admin/dashboard');
  });

  test('should display unassigned inquiries', async ({ page }) => {
    await page.goto('/admin/inquiries');

    const unassigned = page.locator('[data-status="new"]');
    await expect(unassigned).toBeVisible();
  });

  test('should assign inquiry to sales rep', async ({ page }) => {
    await page.goto('/admin/inquiries');

    // Click first inquiry
    await page.click('[data-inquiry-id]');

    // Assign to rep
    await page.selectOption('[name=assigned_to]', 'user-id-sales-1');
    await page.click('button:has-text("Assign")');

    // Verify toast notification
    await expect(page.locator('.toast')).toContainText('Inquiry assigned');

    // Verify status changed
    await expect(page.locator('[data-status]')).toHaveAttribute(
      'data-status',
      'in_progress'
    );
  });
});
```

---

## 10. Deployment & DevOps

### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Admin only, never expose to client

# Email
RESEND_API_KEY=re_...

# Analytics
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...

# Feature flags
NEXT_PUBLIC_ENABLE_INQUIRIES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

```bash
# .env.production (Vercel)
# Same as above, but production values
# Set in Vercel dashboard under Settings > Environment Variables
```

### Database Migration Strategy

```bash
# migrations/001_initial_admin_schema.sql
# migrations/002_add_inquiries.sql
# migrations/003_add_audit_logs.sql

# Run migrations
npx supabase db push
```

### Vercel Deployment Config

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"], // US East (closest to Supabase)
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "RESEND_API_KEY": "@resend-api-key"
  },
  "headers": [
    {
      "source": "/admin/:path*",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 11. Implementation Milestones

### Sprint 1 (Weeks 1-2): Foundation
- [x] Database schema setup
- [x] Supabase configuration
- [x] Authentication system
- [x] Admin layout & navigation
- [x] RBAC implementation
- **Deliverable:** Admin users can login and see empty dashboard

### Sprint 2 (Weeks 3-4): Connector CRUD
- [x] Connector list view
- [x] Create connector form (multi-step wizard)
- [x] Edit connector
- [x] Delete connector (soft delete)
- [x] Form validation
- **Deliverable:** Full connector management working

### Sprint 3 (Weeks 5-6): Media & Inquiries
- [x] Media upload (drag-and-drop)
- [x] Media library
- [x] Public inquiry form
- [x] Inquiry management UI
- [x] Auto-assignment logic
- [x] Email notifications
- **Deliverable:** Inquiries flow working end-to-end

### Sprint 4 (Weeks 7-8): Polish & Launch
- [x] Translation interface
- [x] Audit logs viewer
- [x] Basic analytics dashboard
- [x] Error handling
- [x] Performance optimization
- [x] User testing & bug fixes
- **Deliverable:** MVP ready for production

### Sprint 5 (Weeks 9-10): Training & Deployment
- [x] User training sessions
- [x] Documentation
- [x] Production deployment
- [x] Monitoring setup
- **Deliverable:** System live with trained users

---

## 12. Success Criteria

**Technical:**
- [ ] All API endpoints respond < 500ms
- [ ] Database queries optimized (no N+1)
- [ ] File uploads work reliably (99% success rate)
- [ ] Zero security vulnerabilities (Snyk scan)
- [ ] 90% test coverage on critical paths

**Functional:**
- [ ] Admin users can add connector in < 5 minutes
- [ ] Inquiries auto-assigned within 2 minutes
- [ ] Email notifications sent within 1 minute
- [ ] Search returns results < 1 second
- [ ] All 6 languages supported

**Business:**
- [ ] 5 admin users trained and active
- [ ] 50+ connectors added in first month
- [ ] 20+ inquiries captured in first month
- [ ] Zero data loss incidents
- [ ] User satisfaction > 8/10

---

**END OF TECHNICAL DESIGN DOCUMENT**
