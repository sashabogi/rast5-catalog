# Product Requirements Document: RAST 5 Admin Backend

**Version:** 1.0
**Date:** October 2025
**Status:** Draft for Review
**Project:** Industrial Connector Catalog Admin System

---

## Executive Summary

### Vision
Build a world-class, intuitive admin backend that enables non-technical teams to efficiently manage a rapidly growing industrial connector catalog (from 16 to 1000+ products) while maintaining data integrity, supporting 6 languages, and serving thousands of engineers worldwide.

### Business Goals
1. **Accelerate Product Onboarding**: Reduce time-to-publish for new connectors from hours to minutes
2. **Scale Content Operations**: Support 741+ media files and 10+ product families without overwhelming admin users
3. **Empower Non-Technical Teams**: Enable marketing and sales to manage content independently
4. **Maintain Data Quality**: Enforce validation, prevent errors, ensure consistency across translations
5. **Enable Global Operations**: Support multi-language content management for 6 languages

### Success Metrics

| Metric | Current State | Target (6 months) | Target (12 months) |
|--------|--------------|-------------------|-------------------|
| Time to add new connector | N/A (manual) | < 5 minutes | < 3 minutes |
| Admin user satisfaction | N/A | 8/10 | 9/10 |
| Data error rate | Unknown | < 2% | < 0.5% |
| Products in catalog | 16 | 200+ | 500+ |
| Admin concurrent users | 0 | 5 | 10-15 |
| Translation completeness | ~80% | 95% | 99% |

### Strategic Value
- **Competitive Advantage**: Best-in-class technical catalog in industrial connector space
- **Revenue Enablement**: Faster product launches = faster time to revenue
- **Customer Experience**: Accurate, complete data = better engineer experience
- **Operational Efficiency**: Self-service admin = reduced IT dependency

---

## Problem Statement

### Current Pain Points

**What We Can't Do Today:**
1. No way to add/edit connectors without database access or code deployment
2. Cannot upload 741 media files efficiently (no bulk operations)
3. No translation management workflow (manual JSON editing)
4. Cannot track who changed what or when (no audit trail)
5. No validation to prevent incomplete/incorrect data
6. Cannot manage relationships between connectors (compatibility, mating)
7. No way to preview changes before publishing
8. Cannot search or filter admin data efficiently

**Impact of NOT Building This:**
- **Business Risk**: Cannot scale to support 10+ product families
- **Operational Bottleneck**: Every product update requires developer time
- **Quality Risk**: Manual processes lead to errors and inconsistencies
- **Competitive Risk**: Slower product launches than competitors
- **Team Frustration**: Marketing/Sales blocked by technical dependencies

**Real-World Scenario:**
> An engineer calls sales asking about a 6-pole automotive connector. Sales finds the product exists in inventory but isn't in the catalog. Marketing has the photos and specs ready. Without an admin system, this requires:
> - Developer to write SQL INSERT statements
> - Upload media files to Supabase Storage manually
> - Update translation JSON files across 6 languages
> - Deploy to production
> - Test thoroughly
>
> **Timeline**: 2-4 hours + deployment window
> **With Admin**: 3-5 minutes, no deployment needed

---

## User Personas & Use Cases

### Persona 1: Engineering Data Manager (Sarah)
**Role**: Technical Product Manager
**Technical Skill**: Intermediate (understands specs, not a developer)
**Frequency**: Daily (5-10 hours/week in admin)

**Key Tasks:**
- Add new connector models with technical specifications
- Update compatibility relationships between products
- Verify terminal specifications and wire gauge ranges
- Review and approve bulk imports from ERP system

**Pain Points:**
- Needs to ensure data accuracy (critical for engineers)
- Overwhelmed by repetitive data entry
- Struggles with complex relationship mapping

**Quote**: "I need to be confident that when I say these two connectors mate, they actually do. A mistake here could cost a customer thousands in production errors."

### Persona 2: Marketing Content Manager (Miguel)
**Role**: Digital Marketing Specialist
**Technical Skill**: Low (no coding, comfortable with CMS tools)
**Frequency**: 3x per week (2-4 hours)

**Key Tasks:**
- Upload product photos, videos, and PDFs
- Write and translate marketing descriptions
- Update display names and SEO-friendly content
- Organize media library and tag assets

**Pain Points:**
- Frustrated by slow file uploads
- Confused by technical jargon
- Needs to coordinate with 3 translation vendors

**Quote**: "I just want to drag and drop the new product video, add a nice description in 6 languages, and publish it. Why does this need to involve IT?"

### Persona 3: Sales Operations (James)
**Role**: Sales Engineer Support
**Technical Skill**: Medium (Excel power user, technical sales background)
**Frequency**: Weekly (1-2 hours)

**Key Tasks:**
- Export product lists for customer quotes
- Check product availability and specs quickly
- Update pricing and inventory status
- Generate custom catalog PDFs

**Pain Points:**
- Needs quick lookups during customer calls
- Frustrated by stale data
- Wants to create custom filtered exports

**Quote**: "When a customer asks if we have a 10-pole vertical PCB header, I need to answer in 30 seconds, not search through files."

### Persona 4: External Engineer (End User - Public Site)
**Role**: Automotive Systems Engineer
**Technical Skill**: Expert in electrical systems
**Frequency**: Monthly (research phase)

**Key Tasks:**
- Find connectors matching exact specifications
- Verify compatibility with existing designs
- Download technical drawings and datasheets
- Compare multiple options

**Impact of Admin System:**
- Relies on catalog data accuracy for critical decisions
- Expects complete, up-to-date information
- Needs fast, reliable access to technical resources

---

## Feature Requirements

### Phase 1: MVP (Must-Have for Launch)

#### 1.1 User Authentication & Authorization

**Requirements:**
- Supabase Auth integration with email/password
- Role-Based Access Control (RBAC):
  - **Super Admin**: Full access (God mode)
  - **Content Manager**: CRUD on connectors, read-only on config
  - **Translator**: Edit translations only
  - **Viewer**: Read-only access for sales team
- Session management (30-day remember me)
- Password reset via email
- Forced password change on first login
- Account lockout after 5 failed attempts

**User Stories:**
- As a Super Admin, I can invite new users and assign roles
- As a Content Manager, I can edit connectors but not delete storage buckets
- As a Translator, I can only access translation interface
- As any user, I can reset my password securely

**Security Requirements:**
- Passwords: minimum 12 characters, require uppercase, lowercase, number, symbol
- 2FA via email code (SMS for Phase 2)
- API rate limiting: 100 requests/minute per user
- Session timeout: 24 hours of inactivity

**Technical Spec:**
```typescript
// Role definitions
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONTENT_MANAGER = 'content_manager',
  TRANSLATOR = 'translator',
  VIEWER = 'viewer'
}

// Permission mapping
const permissions = {
  super_admin: ['*'], // All permissions
  content_manager: [
    'connectors:create',
    'connectors:read',
    'connectors:update',
    'connectors:delete',
    'media:upload',
    'media:delete',
    'translations:edit',
  ],
  translator: [
    'connectors:read',
    'translations:edit',
  ],
  viewer: [
    'connectors:read',
    'media:read',
  ]
}
```

#### 1.2 Connector Management (CRUD)

**Create New Connector:**
- Multi-step wizard UI:
  - Step 1: Basic Info (model, category, pole count)
  - Step 2: Technical Specs (gender, orientation, terminals)
  - Step 3: Media Upload (360° video, thumbnails)
  - Step 4: Compatibility (mating connectors, compatible terminals)
  - Step 5: Review & Publish
- Draft/Published state toggle
- Validation at each step
- Progress indicator
- Auto-save drafts every 30 seconds

**Form Fields:**
```typescript
interface ConnectorForm {
  // Step 1: Basic Info
  model: string; // Required, unique, max 50 chars
  display_name: string; // Required, max 200 chars
  series: string; // Dropdown (RAST 5, Automotive, DSB, etc.)
  category: string; // Dropdown
  pole_count: number; // Dropdown 2-24

  // Step 2: Technical Specs
  connector_type: 'R' | 'T' | 'S'; // Radio buttons
  gender: 'Female' | 'Male' | 'PCB'; // Radio buttons
  orientation?: 'Horizontal' | 'Vertical'; // Radio buttons
  mounting_type?: string; // Dropdown
  terminal_suffix: string; // Dropdown (FR, VR, VT, etc.)

  // Step 3: Terminal Specs
  terminal_specs: string[]; // Multi-select from terminals table
  terminal_description?: string; // Textarea, max 500 chars

  // Step 4: Wire & Electrical
  wire_gauge_min?: number; // Number input
  wire_gauge_max?: number; // Number input
  current_rating?: number; // Number input (Amps)
  voltage_rating?: number; // Number input (Volts)
  pitch?: number; // Number input (mm)

  // Step 5: Compatibility
  compatible_with: string[]; // Multi-select (patterns like "CS-T502*")
  mates_with: string[]; // Multi-select (specific connector IDs)
  assembly_variants: string[]; // Multi-select (same model, different config)

  // Step 6: Media
  video_360_url: string; // Required, file upload
  video_thumbnail_time?: number; // Slider 0-60 seconds
  technical_drawing_url?: string; // File upload (PDF/JPG)

  // Step 7: Documentation
  keying_pdf?: string; // File upload
  is_special_version: boolean; // Checkbox
  special_notes?: string; // Textarea

  // Metadata
  status: 'draft' | 'published'; // Radio toggle
  created_by: string; // Auto-filled
  updated_by: string; // Auto-filled
}
```

**Validation Rules:**
- Model must be unique across all connectors
- Pole count must be between 2 and 24
- Video 360 URL is required for published connectors
- Wire gauge min must be less than wire gauge max
- Terminal specs must exist in terminals table
- Compatible patterns must be valid (basic regex check)

**Read/List Connectors:**
- Paginated table view (50 per page)
- Search: model, display name, series
- Filter by:
  - Status (draft/published)
  - Category
  - Pole count
  - Gender
  - Series
  - Date range (created/updated)
  - Created by user
- Sort by: model, created_at, updated_at, pole_count
- Bulk selection for bulk operations
- Quick actions: Edit, Duplicate, Delete, Preview

**Update Connector:**
- Same form as Create, pre-filled with existing data
- Track changes (show "last updated by X on Y")
- Confirm before overwriting draft changes
- Option to "Save as New" (duplicate then edit)

**Delete Connector:**
- Soft delete (mark as deleted, keep in database)
- Confirmation modal with impact warning:
  - "This connector has 3 mating connectors that reference it"
  - "This will affect 2 assembly variants"
- Only Super Admin can hard delete
- Restore deleted connectors (within 30 days)

**UI/UX Requirements:**
- Responsive design (desktop primary, tablet secondary)
- Inline validation with clear error messages
- Keyboard navigation support
- Unsaved changes warning
- Toast notifications for success/error
- Loading states for all async operations

#### 1.3 Media Management

**File Upload:**
- Drag-and-drop interface
- Multi-file upload (up to 20 files)
- Progress bars per file
- Supported formats:
  - Videos: MP4, WebM (max 50 MB)
  - Images: JPG, PNG, WebP (max 10 MB)
  - Documents: PDF (max 25 MB)
- Automatic compression for images
- Video thumbnail generation
- File naming conventions enforced:
  - `{model}-360-video.mp4`
  - `{model}-terminal-{suffix}.jpg`
  - `{pole_count}-pole-keying.pdf`

**Media Library:**
- Grid view with thumbnails
- Filter by:
  - Media type (video, image, PDF)
  - Associated product
  - Upload date
  - File size
- Bulk operations:
  - Delete multiple files
  - Move to different bucket
  - Bulk rename
- Usage tracking: "Used in 3 connectors"
- Unused files warning
- Storage usage dashboard

**Storage Organization:**
```
connector-videos/
  ├── rast5/
  │   ├── CS-R502KxxPF-360-video.mp4
  │   └── CS-T502VKxxPF-360-video.mp4
  ├── automotive/
  └── dsb/

terminal-images/
  ├── female/
  │   ├── 5333-terminal-FR.jpg
  │   └── 5335-terminal-VR.jpg
  └── male/

technical-drawings/
  ├── CS-R502KxxPF-drawing.pdf
  └── CS-T502VKxxPF-drawing.pdf

keying-pdfs/
  ├── 2-pole-keying.pdf
  ├── 4-pole-keying.pdf
  └── special-versions/
```

**Performance Requirements:**
- Upload speed: 1 MB/sec minimum
- Thumbnail generation: < 3 seconds
- Load media library: < 2 seconds
- Support for 10,000+ files

#### 1.4 Category & Series Management

**Series Management:**
- CRUD operations for product series:
  - RAST 5
  - Automotive Connectors
  - DSB Series
  - Multi-way Connectors
  - MFT Minifit Series
  - 254 Series (Pitch 2.54mm)
  - 396 Series (Pitch 3.96mm)
  - P8 Series (Pitch 8mm)
  - Quick Connect Housings
  - Terminal Series

**Fields per Series:**
```typescript
interface ProductSeries {
  id: string;
  name: string; // "RAST 5"
  slug: string; // "rast-5"
  description: Record<string, string>; // Multi-language
  pitch?: number; // mm
  max_poles: number;
  typical_applications: string[];
  active: boolean;
  display_order: number;
  created_at: Date;
}
```

**Category Management:**
- Three main categories:
  - X-For socket terminals
  - X-For tab terminals
  - X-Printed circuit board headers
- Ability to add subcategories
- Drag-and-drop reordering
- Hide/show categories without deleting

#### 1.5 Search & Filtering (Admin)

**Global Search:**
- Search across:
  - Connector models
  - Display names
  - Descriptions (all languages)
  - Terminal specs
  - Special notes
- Real-time search (debounced 300ms)
- Highlight matching terms
- Recent searches history

**Advanced Filters:**
- Combine multiple filters with AND/OR logic
- Save filter presets:
  - "Draft Connectors"
  - "Published This Week"
  - "Missing Translations"
  - "No Media Uploaded"
- Share filter URLs with team

#### 1.6 Audit Logs & Version History

**Activity Log:**
```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  user_id: string;
  user_email: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entity_type: 'connector' | 'series' | 'terminal' | 'media' | 'user';
  entity_id: string;
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  ip_address: string;
  user_agent: string;
}
```

**Features:**
- Filterable log viewer
- Export logs to CSV
- Retention: 2 years
- Searchable by user, date, action, entity

**Version History:**
- Track all changes to connectors
- "View History" button shows timeline
- Compare versions side-by-side
- Restore previous version with one click
- Keep last 50 versions per connector

#### 1.7 Translation Management

**Translation Interface:**
- Side-by-side editor:
  - Left: English (source)
  - Right: Target language
- Languages: English, Italian, Spanish, German, Russian, Portuguese
- Fields to translate:
  - display_name
  - terminal_description
  - special_notes
  - Series descriptions
  - Category names

**Translation Status:**
```typescript
interface TranslationStatus {
  connector_id: string;
  language: string;
  fields_total: number;
  fields_translated: number;
  completion_percentage: number;
  last_updated: Date;
  updated_by: string;
}
```

**Features:**
- Translation progress dashboard
- Flag missing translations
- Bulk export for translation vendors (Excel)
- Bulk import translated content
- Machine translation suggestions (Google Translate API)
- Mark as "verified by native speaker"

**Workflow:**
1. Content Manager creates connector in English
2. System flags as "needs translation"
3. Translator opens translation panel
4. Translator edits each language
5. Mark translation as complete
6. Publish changes to public site

---

### Phase 2: Enhanced Productivity (Should-Have)

#### 2.1 Bulk Operations

**Bulk Import:**
- Upload Excel/CSV with connector data
- Column mapping interface
- Validation before import
- Preview import (first 10 rows)
- Import in background (queue)
- Email notification on completion
- Error report with line numbers

**Template Excel:**
```
model | display_name | category | pole_count | gender | orientation | ...
CS-R502KxxPF | 2-Pole Socket Connector | X-For socket terminals | 2 | Female | Horizontal | ...
```

**Bulk Export:**
- Export filtered connectors to:
  - Excel (.xlsx)
  - CSV
  - JSON
  - PDF Catalog
- Custom column selection
- Include media URLs or embed images
- Schedule automatic exports (weekly/monthly)

**Bulk Edit:**
- Select multiple connectors
- Update common fields:
  - Status (publish/unpublish)
  - Series
  - Category
  - Tags
- Preview changes before applying
- Undo bulk operation

#### 2.2 Smart Validation & Suggestions

**AI-Powered Features:**
- Auto-suggest compatible connectors based on:
  - Pole count match
  - Gender complement (Female ↔ Male)
  - Series family
  - Terminal suffix logic
- Detect missing data:
  - "No 360° video uploaded"
  - "Missing translation in 3 languages"
  - "No compatible terminals defined"
- Suggest terminal specs based on suffix
- Flag duplicate models before save

**Validation Dashboard:**
- Data quality score per connector (0-100)
- Issues categorized by severity:
  - Critical (blocks publish): Missing required fields
  - Warning (should fix): Missing optional data
  - Info (nice to have): Suggestions for improvement

**Cross-Reference Checker:**
- Verify mating connectors exist in database
- Check if compatible terminals are defined
- Validate assembly variant relationships
- Alert on broken references

#### 2.3 Workflow & Approval

**Draft → Review → Publish Workflow:**
```
Draft → Submit for Review → Approved → Published
         ↓                    ↓
      Rejected ──────────> Back to Draft
```

**Roles:**
- Content Creator: Create/Edit drafts
- Reviewer: Approve/Reject submissions
- Publisher: Final publish action

**Features:**
- Assignment: "Assign review to Sarah"
- Comments: "Please add Spanish translation"
- Email notifications on status change
- SLA tracking: "Pending review for 3 days"

#### 2.4 Analytics Dashboard

**Metrics to Track:**
- Admin usage:
  - Active users per day
  - Top contributors
  - Average time per task
- Content metrics:
  - Connectors added per week
  - Translation completion rate
  - Media upload volume
  - Draft vs. published ratio
- Public site metrics:
  - Most viewed connectors
  - Popular search terms
  - Filter usage patterns
  - Download counts (PDFs)

**Dashboard Widgets:**
- Weekly activity chart
- Translation status heatmap
- Top 10 viewed connectors
- Incomplete connectors list
- Recent activity feed

#### 2.5 Relationship Visualizer

**Features:**
- Interactive graph view of connector relationships
- Node types:
  - Connectors (circles)
  - Terminals (squares)
  - Series (hexagons)
- Edge types:
  - Mates with (solid line)
  - Compatible with (dashed line)
  - Uses terminal (arrow)
- Zoom and pan
- Click node to edit
- Export as PNG/SVG

**Use Case:**
> "Show me all connectors that mate with CS-T502VKxxPF and what terminals they use"

---

### Phase 3: World-Class Features (Nice-to-Have)

#### 3.1 API for Third-Party Integrations

**RESTful API:**
```
GET    /api/v1/connectors
POST   /api/v1/connectors
GET    /api/v1/connectors/:id
PUT    /api/v1/connectors/:id
DELETE /api/v1/connectors/:id

GET    /api/v1/series
GET    /api/v1/terminals
GET    /api/v1/media/:type
```

**Features:**
- API key authentication
- Rate limiting per client
- Webhook support for events:
  - `connector.created`
  - `connector.updated`
  - `connector.published`
- OpenAPI/Swagger documentation
- Client SDKs (JavaScript, Python)

**Use Cases:**
- ERP system sync
- PIM (Product Information Management) integration
- Partner portals
- Mobile app backend

#### 3.2 Customer Inquiry Tracking

**Inquiry Form (Public Site):**
- "Request a connector" button
- Fields:
  - Contact info
  - Required specs
  - Application description
  - Quantity needed
- Auto-creates inquiry in admin

**Inquiry Management (Admin):**
- List all inquiries
- Assign to sales rep
- Link to existing connector or mark "need to create"
- Track status: New → In Progress → Quoted → Won/Lost
- Email templates for responses

#### 3.3 Price Management

**Pricing Table:**
```typescript
interface Pricing {
  connector_id: string;
  currency: 'USD' | 'EUR' | 'GBP';
  list_price: number;
  quantity_breaks: {
    min_qty: number;
    unit_price: number;
  }[];
  valid_from: Date;
  valid_until?: Date;
  region?: string;
}
```

**Features:**
- Price history tracking
- Bulk price updates
- Regional pricing
- Volume discounts
- Price list export for sales
- Permission-based visibility (only sales see prices)

#### 3.4 Inventory Integration

**Stock Status:**
- Link to ERP/inventory system
- Real-time stock levels
- Low stock alerts
- Lead time tracking
- "In Stock" / "Made to Order" / "Discontinued" badges

**Features:**
- Automatic sync from ERP
- Manual override for admin
- Show on public site: "12 in stock"
- Backorder management

#### 3.5 Advanced Search for Engineers

**Public Site Search Enhancements:**
- Parametric search:
  - Find connectors by exact specs
  - "Current rating > 10A AND Voltage < 250V"
- Natural language search:
  - "horizontal female 6 pole socket"
- Search filters:
  - In stock only
  - With CAD files
  - With certifications (UL, CE, etc.)

#### 3.6 Multi-Tenant Support

**For Distributors/Partners:**
- White-label admin portal
- Separate data per tenant
- Custom branding
- Regional product catalogs
- Localized pricing

#### 3.7 Mobile Admin App

**iOS/Android App:**
- Lightweight interface
- Key features:
  - View connectors
  - Edit basic info
  - Upload photos on-the-go
  - Approve/reject reviews
  - Push notifications
- Use case: Trade shows, customer visits

---

## Database Architecture

### Schema Extensions

```sql
-- =============================================
-- USER MANAGEMENT
-- =============================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'content_manager',
  'translator',
  'viewer'
);

-- =============================================
-- AUDIT LOGS
-- =============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,

  -- Indexes for fast filtering
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_timestamp (timestamp DESC),
  INDEX idx_audit_entity (entity_type, entity_id)
);

-- Partition by month for performance
CREATE TABLE audit_logs_y2025m10 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- =============================================
-- CONNECTOR ENHANCEMENTS
-- =============================================

ALTER TABLE connectors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add check constraint
ALTER TABLE connectors ADD CONSTRAINT check_status
  CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- =============================================
-- VERSION HISTORY
-- =============================================

CREATE TABLE connector_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connector_id TEXT REFERENCES connectors(id),
  version INTEGER NOT NULL,
  data JSONB NOT NULL, -- Full connector record at this version
  changed_by UUID REFERENCES admin_users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_summary TEXT,

  UNIQUE(connector_id, version)
);

-- =============================================
-- TRANSLATIONS
-- =============================================

CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- 'connector', 'series', 'category'
  entity_id TEXT NOT NULL,
  language TEXT NOT NULL, -- 'en', 'it', 'es', 'de', 'ru', 'pt'
  field TEXT NOT NULL, -- 'display_name', 'description'
  value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  translated_by UUID REFERENCES admin_users(id),
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(entity_type, entity_id, language, field)
);

CREATE INDEX idx_translations_entity ON translations(entity_type, entity_id);
CREATE INDEX idx_translations_lang ON translations(language);

-- =============================================
-- SERIES
-- =============================================

CREATE TABLE series (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  pitch DECIMAL(5,2),
  max_poles INTEGER,
  typical_applications TEXT[],
  active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO series (id, name, slug, max_poles) VALUES
  ('rast5', 'RAST 5', 'rast-5', 12),
  ('automotive', 'Automotive Connectors', 'automotive', 24),
  ('dsb', 'DSB Series Edge Connectors', 'dsb-series', 50),
  ('mft', 'MFT Minifit Series', 'mft-minifit', 24),
  ('254', '254 Series (Pitch 2.54mm)', '254-series', 40),
  ('396', '396 Series (Pitch 3.96mm)', '396-series', 24),
  ('p8', 'P8 Series (Pitch 8mm)', 'p8-series', 12);

-- Link connectors to series
ALTER TABLE connectors ADD COLUMN series_id TEXT REFERENCES series(id);

-- =============================================
-- MEDIA METADATA
-- =============================================

CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'video', 'image', 'pdf'
  bucket TEXT NOT NULL, -- 'connector-videos', 'terminal-images', etc.
  file_size BIGINT NOT NULL, -- bytes
  mime_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES admin_users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Usage tracking
  used_in_connectors TEXT[], -- Array of connector IDs
  download_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_media_bucket ON media_files(bucket);
CREATE INDEX idx_media_type ON media_files(file_type);

-- =============================================
-- RLS POLICIES (Admin Access)
-- =============================================

-- Admin users can do everything
CREATE POLICY "Admin full access on connectors"
  ON connectors
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'content_manager')
    )
  );

-- Translators can read all, but only update translations
CREATE POLICY "Translator read access on connectors"
  ON connectors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'translator'
    )
  );

-- Viewers can only read
CREATE POLICY "Viewer read access on connectors"
  ON connectors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'viewer'
    )
  );
```

### Data Validation at Database Level

```sql
-- Ensure valid email format
ALTER TABLE admin_users ADD CONSTRAINT valid_email
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Ensure pole count is reasonable
ALTER TABLE connectors ADD CONSTRAINT valid_pole_count
  CHECK (pole_count >= 1 AND pole_count <= 100);

-- Ensure wire gauge min < max
ALTER TABLE connectors ADD CONSTRAINT valid_wire_gauge
  CHECK (wire_gauge_min IS NULL OR wire_gauge_max IS NULL OR wire_gauge_min < wire_gauge_max);

-- Ensure valid language codes
ALTER TABLE translations ADD CONSTRAINT valid_language
  CHECK (language IN ('en', 'it', 'es', 'de', 'ru', 'pt'));

-- Ensure published connectors have required fields
CREATE OR REPLACE FUNCTION validate_published_connector()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' THEN
    IF NEW.video_360_url IS NULL THEN
      RAISE EXCEPTION 'Published connector must have 360° video';
    END IF;
    IF NEW.model IS NULL OR NEW.display_name IS NULL THEN
      RAISE EXCEPTION 'Published connector must have model and display name';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_published_connector
  BEFORE INSERT OR UPDATE ON connectors
  FOR EACH ROW
  EXECUTE FUNCTION validate_published_connector();
```

### Indexes for Performance

```sql
-- Composite indexes for common queries
CREATE INDEX idx_connectors_status_series ON connectors(status, series_id);
CREATE INDEX idx_connectors_created_by_date ON connectors(created_by, created_at DESC);
CREATE INDEX idx_audit_logs_composite ON audit_logs(user_id, timestamp DESC, entity_type);

-- GIN indexes for JSONB columns (fast JSON queries)
CREATE INDEX idx_connectors_terminal_specs_gin ON connectors USING GIN (terminal_specs);
CREATE INDEX idx_connectors_compatible_gin ON connectors USING GIN (compatible_with);
CREATE INDEX idx_audit_changes_gin ON audit_logs USING GIN (changes);

-- Full-text search index
CREATE INDEX idx_connectors_search ON connectors
  USING GIN (to_tsvector('english', model || ' ' || display_name || ' ' || COALESCE(special_notes, '')));

-- Partial indexes (smaller, faster for specific queries)
CREATE INDEX idx_connectors_drafts ON connectors(created_at DESC)
  WHERE status = 'draft';

CREATE INDEX idx_connectors_published ON connectors(published_at DESC)
  WHERE status = 'published';

CREATE INDEX idx_connectors_deleted ON connectors(deleted_at)
  WHERE deleted_at IS NOT NULL;
```

---

## Technical Architecture

### Architecture Decision: Integrated vs. Separate Admin App

**Recommendation: Integrated Admin within Next.js App**

**Rationale:**
1. **Shared Code**: Reuse components, types, utilities
2. **Single Deployment**: One build, one hosting environment
3. **Consistent Experience**: Same design system, same navigation
4. **Simpler Auth**: One auth system (Supabase Auth)
5. **Lower Maintenance**: One codebase to maintain

**Implementation:**
```
src/
├── app/
│   ├── (public)/              # Public-facing site
│   │   ├── [locale]/
│   │   │   ├── catalog/
│   │   │   ├── connector/[id]/
│   │   │   └── resources/
│   │   └── layout.tsx
│   │
│   └── (admin)/               # Admin portal (protected)
│       ├── admin/
│       │   ├── layout.tsx     # Admin layout with sidebar
│       │   ├── dashboard/
│       │   ├── connectors/
│       │   │   ├── page.tsx   # List connectors
│       │   │   ├── new/       # Create connector
│       │   │   └── [id]/      # Edit connector
│       │   ├── media/
│       │   ├── translations/
│       │   ├── users/
│       │   └── settings/
│       └── middleware.ts      # Admin route protection
│
├── components/
│   ├── admin/                 # Admin-specific components
│   │   ├── ConnectorForm.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── TranslationEditor.tsx
│   │   └── AuditLogViewer.tsx
│   └── public/                # Public site components
│
└── lib/
    ├── admin/                 # Admin utilities
    │   ├── permissions.ts
    │   ├── validation.ts
    │   └── audit.ts
    └── supabase/
        ├── client.ts
        └── server.ts
```

### API Design: Next.js Server Actions vs. Route Handlers

**Recommendation: Hybrid Approach**

**Server Actions for:**
- Form submissions (create/update/delete connectors)
- Simple mutations
- Progressive enhancement

**Route Handlers (/api) for:**
- File uploads (streaming)
- Complex queries
- Webhook endpoints
- Third-party integrations
- Export functionality

**Example Server Action:**
```typescript
// src/app/(admin)/admin/connectors/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/permissions'
import { logAudit } from '@/lib/admin/audit'

export async function createConnector(formData: FormData) {
  // 1. Auth check
  const user = await requireAdmin(['content_manager', 'super_admin'])

  // 2. Validate input
  const data = validateConnectorForm(formData)

  // 3. Insert into database
  const supabase = createServerClient()
  const { data: connector, error } = await supabase
    .from('connectors')
    .insert({
      ...data,
      created_by: user.id,
      status: 'draft'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 4. Log audit trail
  await logAudit({
    user_id: user.id,
    action: 'create',
    entity_type: 'connector',
    entity_id: connector.id,
    changes: data
  })

  // 5. Revalidate cache
  revalidatePath('/admin/connectors')

  return { success: true, data: connector }
}
```

**Example Route Handler:**
```typescript
// src/app/api/admin/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/permissions'

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const user = await requireAdmin(['content_manager', 'super_admin'])

    // 2. Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 3. Validate file
    const validation = validateMediaFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // 4. Upload to Supabase Storage
    const supabase = createServerClient()
    const filename = generateFilename(file, formData.get('series') as string)
    const bucket = getBucketForFileType(file.type)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 5. Create media record
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename)

    await supabase.from('media_files').insert({
      filename,
      original_filename: file.name,
      file_type: getFileType(file.type),
      bucket,
      file_size: file.size,
      mime_type: file.type,
      public_url: publicUrl.publicUrl,
      uploaded_by: user.id
    })

    return NextResponse.json({
      success: true,
      url: publicUrl.publicUrl,
      filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Enable streaming for large files
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes
```

### File Upload Strategy

**Recommendation: Direct Upload to Supabase Storage**

**Flow:**
1. Admin UI requests signed upload URL from backend
2. Backend validates user permissions and file metadata
3. Backend generates temporary signed URL (valid 10 minutes)
4. Frontend uploads directly to Supabase Storage
5. Frontend notifies backend of completion
6. Backend creates media record in database

**Benefits:**
- No file passes through Next.js server (saves memory/CPU)
- Faster uploads (direct to storage)
- Progress tracking in browser
- Can resume interrupted uploads

**Implementation:**
```typescript
// Frontend: components/admin/MediaUploader.tsx
async function uploadFile(file: File) {
  // 1. Request signed upload URL
  const { signedUrl, path } = await fetch('/api/admin/media/signed-url', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size
    })
  }).then(r => r.json())

  // 2. Upload directly to Supabase Storage
  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener('progress', (e) => {
    const progress = (e.loaded / e.total) * 100
    setUploadProgress(progress)
  })

  xhr.open('PUT', signedUrl)
  xhr.setRequestHeader('Content-Type', file.type)
  xhr.send(file)

  xhr.onload = async () => {
    if (xhr.status === 200) {
      // 3. Notify backend of successful upload
      await fetch('/api/admin/media/complete', {
        method: 'POST',
        body: JSON.stringify({ path, filename: file.name })
      })

      setUploadComplete(true)
    }
  }
}
```

### Caching Strategy

**Multi-Layer Caching:**

1. **Database Query Caching (Supabase):**
   - Automatic query caching (60 seconds)
   - Explicit cache control headers

2. **Next.js Data Cache:**
   ```typescript
   // Cache connector list for 5 minutes
   const connectors = await fetch('https://your-project.supabase.co/rest/v1/connectors', {
     next: { revalidate: 300 }
   })
   ```

3. **React Cache (Server Components):**
   ```typescript
   import { cache } from 'react'

   export const getConnector = cache(async (id: string) => {
     const supabase = createServerClient()
     return await supabase.from('connectors').select('*').eq('id', id).single()
   })
   ```

4. **CDN Caching (Vercel Edge):**
   - Static assets: 1 year
   - API responses: 5 minutes
   - Admin pages: No cache (private)

**Invalidation Strategy:**
```typescript
// After updating connector
import { revalidatePath, revalidateTag } from 'next/cache'

await updateConnector(id, data)

// Invalidate specific paths
revalidatePath('/admin/connectors')
revalidatePath(`/connector/${id}`)
revalidatePath(`/catalog`)

// Or use tags
revalidateTag('connectors')
```

### Real-Time Features

**Use Cases:**
1. Multiple admins editing same connector → Show "User X is editing"
2. New connector published → Notify admin dashboard
3. Bulk import progress → Real-time progress bar

**Implementation: Supabase Realtime**
```typescript
// Subscribe to changes
const channel = supabase
  .channel('admin-activity')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'connectors'
    },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI
    }
  )
  .subscribe()

// Broadcast user presence
channel.send({
  type: 'broadcast',
  event: 'editing',
  payload: { user: 'Sarah', connector_id: 'X01-CS-R502KxxPF' }
})
```

**Performance Consideration:**
- Only use real-time where truly needed (admin dashboard, not entire catalog)
- Limit subscriptions per user (max 5 concurrent channels)
- Debounce rapid changes (aggregate updates every 1 second)

---

## Security & Compliance

### Authentication Architecture

**Supabase Auth + Custom Admin Layer**

**Setup:**
```typescript
// lib/admin/auth.ts
import { createServerClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get admin user record
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  return adminUser
}

export async function requireAdmin(allowedRoles?: UserRole[]) {
  const user = await getCurrentUser()

  if (!user || !user.is_active) {
    redirect('/admin/login')
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }

  return user
}
```

**Login Flow:**
1. Admin visits `/admin` (protected route)
2. Middleware redirects to `/admin/login`
3. User enters email + password
4. Supabase Auth validates credentials
5. Backend checks `admin_users` table for role
6. Session created (JWT in HTTP-only cookie)
7. Redirect to `/admin/dashboard`

**Password Requirements:**
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)
- Cannot be common password (check against list of 10k common passwords)
- Cannot reuse last 5 passwords

**2FA (Phase 2):**
- Email-based OTP (6 digits, valid 10 minutes)
- SMS option for high-risk accounts
- Backup codes (10 codes, one-time use)
- Enforce 2FA for Super Admins

### Role-Based Access Control (RBAC)

**Permission Matrix:**

| Action | Super Admin | Content Manager | Translator | Viewer |
|--------|-------------|----------------|-----------|--------|
| View connectors | ✓ | ✓ | ✓ | ✓ |
| Create connector | ✓ | ✓ | ✗ | ✗ |
| Edit connector data | ✓ | ✓ | ✗ | ✗ |
| Edit translations | ✓ | ✓ | ✓ | ✗ |
| Delete connector | ✓ | ✗ | ✗ | ✗ |
| Upload media | ✓ | ✓ | ✗ | ✗ |
| Delete media | ✓ | ✓ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ | ✗ |
| View audit logs | ✓ | ✓ | ✗ | ✗ |
| Export data | ✓ | ✓ | ✗ | ✓ |
| Bulk import | ✓ | ✓ | ✗ | ✗ |
| Publish connectors | ✓ | ✓ | ✗ | ✗ |
| Change status | ✓ | ✓ | ✗ | ✗ |
| Configure series | ✓ | ✗ | ✗ | ✗ |

**Implementation:**
```typescript
// lib/admin/permissions.ts
export const permissions = {
  'connectors:create': ['super_admin', 'content_manager'],
  'connectors:update': ['super_admin', 'content_manager'],
  'connectors:delete': ['super_admin'],
  'translations:edit': ['super_admin', 'content_manager', 'translator'],
  'users:manage': ['super_admin'],
  // ... more permissions
}

export function hasPermission(user: AdminUser, permission: string): boolean {
  const allowedRoles = permissions[permission]
  return allowedRoles?.includes(user.role) || false
}

export function requirePermission(permission: string) {
  return async function() {
    const user = await getCurrentUser()
    if (!hasPermission(user, permission)) {
      throw new Error(`Missing permission: ${permission}`)
    }
    return user
  }
}
```

### Data Encryption

**At Rest:**
- Database: AES-256 encryption (Supabase default)
- Storage: AES-256 encryption (Supabase default)
- Backups: Encrypted with separate key

**In Transit:**
- All connections: TLS 1.3
- API calls: HTTPS only
- No mixed content

**Sensitive Fields:**
- Passwords: bcrypt hash (cost factor 12)
- API keys: AES-256 encryption with app secret
- Session tokens: JWT signed with RS256

### API Security

**Rate Limiting:**
```typescript
// middleware.ts (Admin routes)
import { ratelimit } from '@/lib/redis'

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  // Admin API: 100 requests per minute
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const { success, remaining } = await ratelimit.limit(`admin:${ip}`)

    if (!success) {
      return new NextResponse('Rate limit exceeded', { status: 429 })
    }

    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  }

  return NextResponse.next()
}
```

**CORS Policy:**
```typescript
// Admin API: No CORS (same-origin only)
// Public API: Allow specific origins
const allowedOrigins = [
  'https://yourdomain.com',
  'https://partner-portal.com'
]

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  }

  return {}
}
```

**Input Validation:**
```typescript
// Validate all inputs with Zod
import { z } from 'zod'

const ConnectorSchema = z.object({
  model: z.string().min(3).max(50).regex(/^[A-Z0-9-]+$/),
  display_name: z.string().min(5).max(200),
  pole_count: z.number().int().min(1).max(100),
  gender: z.enum(['Female', 'Male', 'PCB']),
  // ... more fields
})

export function validateConnectorForm(data: unknown) {
  return ConnectorSchema.parse(data)
}
```

**SQL Injection Prevention:**
- Use Supabase client (parameterized queries)
- Never construct raw SQL from user input
- Validate all identifiers (table names, column names)

**XSS Prevention:**
- React escapes by default
- Sanitize HTML in rich text fields
- Use Content Security Policy headers

### Session Management

**Configuration:**
```typescript
// JWT configuration
{
  algorithm: 'RS256',
  expiresIn: '24h', // Access token
  refreshExpiresIn: '30d', // Refresh token
  issuer: 'rast5-admin',
  audience: 'rast5-catalog'
}
```

**Session Security:**
- HTTP-only cookies (no JavaScript access)
- Secure flag (HTTPS only)
- SameSite=Lax (CSRF protection)
- Automatic refresh before expiration
- Logout invalidates refresh token

**Concurrent Session Control:**
- Max 3 active sessions per user
- Display active sessions in account settings
- "Log out all devices" option

### Compliance Considerations

**GDPR (if applicable):**
- User data export (JSON format)
- Right to deletion (anonymize audit logs)
- Privacy policy acceptance
- Data retention policy (2 years for audit logs)

**Audit Requirements:**
- All data changes logged
- User actions traceable
- Immutable audit trail
- Tamper-evident (hash chain)

---

## UX/UI Requirements

### Design System

**Use shadcn/ui (Already in Project)**
- Consistent with public site
- Accessible by default
- Customizable with Tailwind

**Additional Admin Components:**
- Data tables (sortable, filterable)
- Form builders (multi-step wizards)
- Toast notifications (success/error/info)
- Modal dialogs (confirmation, forms)
- Sidebar navigation
- Breadcrumbs
- Status badges

### Admin Layout

```
┌─────────────────────────────────────────────┐
│  RAST 5 Admin    [User Menu ▼]   [Logout]  │ ← Header
├─────────┬───────────────────────────────────┤
│         │                                   │
│ Sidebar │         Main Content              │
│         │                                   │
│ ☰ Menu  │  ┌─────────────────────────┐    │
│         │  │                         │    │
│ Dashbrd │  │                         │    │
│ Conctrs │  │      Page Content       │    │
│ Media   │  │                         │    │
│ Translt │  │                         │    │
│ Users   │  │                         │    │
│ Logs    │  └─────────────────────────┘    │
│ Setngs  │                                   │
│         │                                   │
└─────────┴───────────────────────────────────┘
```

**Sidebar Navigation:**
```
📊 Dashboard
📦 Connectors
   ├─ All Connectors
   ├─ Add New
   ├─ Drafts (3)
   └─ Needs Review (1)
🖼️ Media Library
   ├─ Videos
   ├─ Images
   └─ PDFs
🌍 Translations
   ├─ Overview
   └─ By Language
👥 Users (Admin only)
📋 Audit Logs
⚙️ Settings
   ├─ Series
   ├─ Categories
   └─ Account
```

### Responsive Design

**Desktop First, Tablet Acceptable, Mobile Limited:**
- Primary: Desktop 1920x1080 (engineers use desktops)
- Secondary: Laptop 1366x768
- Tertiary: Tablet 768x1024 (for approvals on the go)
- Limited: Mobile 375x667 (view only, basic edits)

**Breakpoints:**
```css
/* Desktop: Full admin interface */
@media (min-width: 1280px) { ... }

/* Laptop: Condensed sidebar */
@media (min-width: 1024px) and (max-width: 1279px) { ... }

/* Tablet: Collapsible sidebar, simplified tables */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Mobile: Bottom nav, cards instead of tables */
@media (max-width: 767px) { ... }
```

### Form Design

**Multi-Step Wizard Example (Add Connector):**

**Step Indicator:**
```
1. Basic Info → 2. Specs → 3. Media → 4. Compatibility → 5. Review
   (active)
```

**Form Layout:**
```
┌─────────────────────────────────────────┐
│  Add New Connector - Step 1 of 5       │
│                                         │
│  Basic Information                      │
│  ─────────────────                      │
│                                         │
│  Model *                                │
│  [CS-R502KxxPF_____________]            │
│  ℹ️ Must be unique                      │
│                                         │
│  Display Name *                         │
│  [2-Pole Socket Connector (Horizontal)] │
│  ℹ️ Customer-facing name                │
│                                         │
│  Series *                               │
│  [RAST 5 ▼]                            │
│                                         │
│  Category *                             │
│  [ ] X-For socket terminals             │
│  [ ] X-For tab terminals                │
│  [✓] X-Printed circuit board headers    │
│                                         │
│  Pole Count *                           │
│  (2) 3  4  5  6  7  8  9  10  12       │
│                                         │
│  [Cancel]          [Save Draft] [Next →]│
└─────────────────────────────────────────┘
```

**Validation States:**
```
✓ Valid:   [Input____] ✓ Looks good!
✗ Error:   [Input____] ✗ Model already exists
⚠️ Warning: [Input____] ⚠️ Consider adding more detail
```

### Bulk Operations UI

**Bulk Edit Example:**

```
┌─────────────────────────────────────────────┐
│ Selected: 12 connectors                     │
│                                             │
│ Bulk Actions:                               │
│ [Change Status ▼] [Change Series ▼]        │
│ [Export Selected] [Delete Selected]         │
└─────────────────────────────────────────────┘
```

**Confirmation Modal:**
```
┌─────────────────────────────────────────┐
│  Confirm Bulk Action                    │
│                                         │
│  You are about to change the status of  │
│  12 connectors from "draft" to          │
│  "published".                           │
│                                         │
│  ⚠️ This action cannot be undone.       │
│                                         │
│  Affected connectors:                   │
│  • CS-R502KxxPF                         │
│  • CS-T502VKxxPF                        │
│  • ... and 10 more                      │
│                                         │
│  [Cancel]     [Yes, Proceed]            │
└─────────────────────────────────────────┘
```

### Loading States

**Skeleton Screens:**
```typescript
// components/admin/ConnectorListSkeleton.tsx
export function ConnectorListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )
}
```

**Progress Indicators:**
- Spinner for quick actions (< 3 seconds)
- Progress bar for uploads (show percentage)
- Step-by-step for multi-stage operations (bulk import)

**Optimistic UI:**
```typescript
// Show success immediately, revert if error
async function deleteConnector(id: string) {
  // 1. Optimistically remove from UI
  removeFromUI(id)

  try {
    // 2. Call API
    await api.delete(`/connectors/${id}`)
    // Success!
  } catch (error) {
    // 3. Revert if error
    addBackToUI(id)
    showError('Failed to delete')
  }
}
```

### User Feedback

**Toast Notifications:**
```typescript
// Success
toast.success('Connector published successfully')

// Error
toast.error('Failed to upload video. Please try again.')

// Warning
toast.warning('Translation is incomplete for 3 languages')

// Info
toast.info('Bulk import started. You will be notified when complete.')
```

**Empty States:**
```
┌─────────────────────────────────────────┐
│                                         │
│           📦                            │
│                                         │
│    No connectors found                  │
│                                         │
│    Try adjusting your filters or        │
│    create a new connector.              │
│                                         │
│    [Create Connector]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Error States:**
```
┌─────────────────────────────────────────┐
│                                         │
│           ⚠️                            │
│                                         │
│    Something went wrong                 │
│                                         │
│    We couldn't load the connectors.     │
│    Error: Database connection timeout   │
│                                         │
│    [Try Again]  [Report Issue]          │
│                                         │
└─────────────────────────────────────────┘
```

### Accessibility (WCAG 2.1 AA)

**Requirements:**
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader support (ARIA labels)
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible
- Form labels clearly associated
- Error messages announced
- Skip navigation links

**Testing Tools:**
- axe DevTools
- Lighthouse accessibility audit
- Manual keyboard testing
- Screen reader testing (NVDA/JAWS)

---

## Integration Points

### Admin ↔ Public Site

**Real-Time Sync:**
```
Admin publishes connector
       ↓
Database updated (connectors.status = 'published')
       ↓
Next.js cache invalidated (revalidatePath)
       ↓
Public site shows new connector (within 60 seconds)
```

**Cache Invalidation Strategy:**
```typescript
// After publishing connector
export async function publishConnector(id: string) {
  // 1. Update status in database
  await supabase
    .from('connectors')
    .update({ status: 'published', published_at: new Date() })
    .eq('id', id)

  // 2. Invalidate Next.js cache
  revalidatePath('/catalog')
  revalidatePath(`/connector/${id}`)
  revalidatePath('/') // Homepage

  // 3. Optionally: Purge CDN cache
  await purgeCDN([
    'https://yourdomain.com/catalog',
    `https://yourdomain.com/connector/${id}`
  ])
}
```

### ERP Integration (Phase 2)

**Scenario: Sync Inventory from ERP**

**Architecture:**
```
ERP System (SAP/Oracle/Custom)
       ↓
Webhook or Scheduled Job
       ↓
Admin API (/api/admin/integrations/erp/sync)
       ↓
Validate & Transform Data
       ↓
Update connectors table
       ↓
Log sync results in audit_logs
```

**Implementation:**
```typescript
// app/api/admin/integrations/erp/sync/route.ts
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')

  // 1. Validate API key
  if (!isValidERPApiKey(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse ERP data
  const erpData = await request.json()

  // 3. Transform to our schema
  const connectors = transformERPData(erpData)

  // 4. Upsert connectors
  const supabase = createServiceClient()
  const results = await Promise.all(
    connectors.map(async (connector) => {
      const { error } = await supabase
        .from('connectors')
        .upsert(connector, { onConflict: 'model' })

      return { model: connector.model, success: !error, error }
    })
  )

  // 5. Log sync
  await logAudit({
    user_id: 'system',
    action: 'erp_sync',
    entity_type: 'integration',
    changes: { results }
  })

  return NextResponse.json({
    success: true,
    synced: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  })
}
```

### Translation Vendor Integration

**Export Workflow:**
1. Admin selects connectors needing translation
2. Click "Export for Translation"
3. System generates Excel file:
   - Columns: ID, Field, English, Italian, Spanish, etc.
   - One row per translatable field
4. Email Excel to translation vendor

**Import Workflow:**
1. Vendor returns completed Excel
2. Admin uploads via "Import Translations"
3. System validates format and IDs
4. Preview changes before applying
5. Apply translations to database
6. Mark translations as "verified"

**Excel Format:**
```
| connector_id     | field               | en (source)        | it             | es             |
|------------------|---------------------|--------------------|----------------|----------------|
| X01-CS-R502KxxPF | display_name        | 2-Pole Socket      | Presa 2 poli   | Conector 2    |
| X01-CS-R502KxxPF | terminal_description| Female socket...   | Terminale...   | Terminal...   |
```

### API for Partners (Phase 3)

**Use Case: Distributor Portal**

Distributor wants to display your connector catalog on their website with their own pricing.

**API Endpoints:**
```
GET /api/v1/connectors
  Query params: series, category, pole_count, in_stock
  Response: Array of connectors (public data only)

GET /api/v1/connectors/:id
  Response: Full connector details

GET /api/v1/series
  Response: Array of available series

POST /api/v1/webhooks
  Register webhook for connector.published events
```

**Authentication:**
```
Authorization: Bearer partner_api_key_xxxxxxxxxxxx
```

**Rate Limits:**
- Free tier: 100 requests/hour
- Paid tier: 10,000 requests/hour
- Enterprise: Unlimited

**Webhook Example:**
```typescript
// Partner receives notification when connector published
{
  event: 'connector.published',
  timestamp: '2025-10-08T12:34:56Z',
  data: {
    id: 'X01-CS-R502KxxPF',
    model: 'CS-R502KxxPF',
    series: 'RAST 5',
    pole_count: 2,
    // ... other fields
  }
}
```

---

## Scalability Considerations

### Database Performance at Scale

**Current: 16 connectors**
**Target: 1,000+ connectors**
**Growth Factor: 62.5x**

**Optimizations:**

1. **Query Optimization:**
   ```sql
   -- Avoid: SELECT * (fetches all columns, including large JSONB)
   SELECT * FROM connectors WHERE pole_count = 4;

   -- Prefer: SELECT only needed columns
   SELECT id, model, display_name, pole_count, gender
   FROM connectors
   WHERE pole_count = 4;
   ```

2. **Pagination:**
   ```typescript
   // Don't load 1000 rows at once
   const ITEMS_PER_PAGE = 50

   const { data, error } = await supabase
     .from('connectors')
     .select('*', { count: 'exact' })
     .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
   ```

3. **Database Indexes:**
   - Already covered in schema section
   - Add indexes for common filter combinations
   - Monitor slow queries (pg_stat_statements)

4. **Connection Pooling:**
   ```typescript
   // Supabase handles this automatically
   // Max 60 concurrent connections (free tier)
   // Max 500 concurrent connections (paid tier)
   ```

### Concurrent Admin Users

**Scenario: 10 admins working simultaneously**

**Challenge: Editing conflicts**

**Solution: Optimistic Locking**
```typescript
interface Connector {
  id: string
  version: number // Increment on each update
  // ... other fields
}

// When updating:
async function updateConnector(id: string, data: Partial<Connector>, expectedVersion: number) {
  const { data: updated, error } = await supabase
    .from('connectors')
    .update({
      ...data,
      version: expectedVersion + 1
    })
    .eq('id', id)
    .eq('version', expectedVersion) // Only update if version matches
    .select()

  if (!updated || updated.length === 0) {
    throw new Error('Conflict: Connector was modified by another user. Please refresh and try again.')
  }

  return updated[0]
}
```

**Real-Time Presence:**
```typescript
// Show who's currently editing
const channel = supabase.channel('connector:X01-CS-R502KxxPF')

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    // { user_123: { name: 'Sarah', editing: true }, ... }
    showEditingIndicator(state)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        name: currentUser.name,
        editing: true
      })
    }
  })
```

### Large File Uploads

**Challenge: 50 MB video uploads**

**Solutions:**

1. **Chunked Uploads:**
   ```typescript
   async function uploadLargeFile(file: File) {
     const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB chunks
     const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

     for (let i = 0; i < totalChunks; i++) {
       const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
       await uploadChunk(chunk, i, totalChunks)
       setProgress(((i + 1) / totalChunks) * 100)
     }
   }
   ```

2. **Resumable Uploads:**
   - Store upload progress in localStorage
   - On failure, resume from last successful chunk
   - Clear progress on completion

3. **Background Processing:**
   - Upload completes, return immediately
   - Process video in background (generate thumbnail, compress)
   - Notify user via email when ready

4. **CDN Upload Acceleration:**
   - Use Supabase Storage's global CDN
   - Uploads go to nearest edge location
   - Automatic geo-replication

### Caching at Scale

**Problem: 1000+ connectors = 5 MB of data**

**Solution: Multi-Level Cache**

```typescript
// Level 1: In-Memory Cache (Redis or Vercel KV)
import { kv } from '@vercel/kv'

export async function getCachedConnectors() {
  // Try cache first
  const cached = await kv.get('connectors:all')
  if (cached) {
    return cached
  }

  // Cache miss: Fetch from database
  const { data } = await supabase.from('connectors').select('*')

  // Cache for 5 minutes
  await kv.set('connectors:all', data, { ex: 300 })

  return data
}

// Level 2: Edge Cache (Vercel Edge Network)
export const revalidate = 300 // 5 minutes

// Level 3: Browser Cache
res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
```

**Invalidation:**
```typescript
// When connector updated in admin
await kv.del('connectors:all')
await kv.del(`connector:${id}`)
revalidatePath('/catalog')
```

### Media Storage at Scale

**Challenge: 741+ media files = ~10 GB+**

**Supabase Storage Limits:**
- Free tier: 1 GB
- Pro tier: 100 GB ($0.021/GB)
- Pay-as-you-go beyond

**Cost Optimization:**
1. **Image Compression:**
   ```typescript
   // Before upload, compress images
   import sharp from 'sharp'

   const compressedImage = await sharp(file)
     .resize(1920, 1080, { fit: 'inside' })
     .jpeg({ quality: 85 })
     .toBuffer()
   ```

2. **Video Transcoding:**
   - Use external service (Mux, Cloudinary)
   - Store only compressed MP4
   - Generate multiple resolutions (720p, 1080p)

3. **Lazy Loading:**
   - Don't load all thumbnails at once
   - Use Intersection Observer
   - Placeholder images while loading

4. **CDN Caching:**
   - Set long cache headers (1 year)
   - Use versioned URLs (v1, v2)
   - Purge cache on update

---

## Success Metrics & KPIs

### Quantitative Metrics

**Efficiency Metrics:**
| Metric | Baseline | 3 Months | 6 Months | 12 Months |
|--------|----------|----------|----------|-----------|
| Time to add connector | N/A | 5 min | 3 min | 2 min |
| Time to update connector | N/A | 2 min | 1 min | 30 sec |
| Bulk import time (100 items) | N/A | 10 min | 5 min | 3 min |
| Media upload time (50 MB) | N/A | 2 min | 1 min | 45 sec |

**Quality Metrics:**
| Metric | Target |
|--------|--------|
| Data error rate | < 2% |
| Translation completeness | > 95% |
| Broken media links | < 1% |
| Duplicate connectors | 0 |

**Usage Metrics:**
| Metric | Target |
|--------|--------|
| Admin daily active users | 5+ |
| Connectors added per week | 20+ |
| Media files uploaded per week | 50+ |
| Bulk operations per week | 10+ |

**Performance Metrics:**
| Metric | Target |
|--------|--------|
| Admin page load time | < 2 sec |
| Search response time | < 500 ms |
| File upload speed | > 1 MB/sec |
| Export generation time | < 10 sec |

### Qualitative Metrics

**User Satisfaction:**
- NPS (Net Promoter Score) > 50
- User interviews every quarter
- Feature request tracking
- Bug resolution time < 48 hours

**Questions for Quarterly Surveys:**
1. How easy is it to add a new connector? (1-10)
2. How confident are you in data accuracy? (1-10)
3. What features do you wish existed?
4. What frustrates you most about the admin?
5. Would you recommend this system to others?

### Business Impact Metrics

**Revenue Impact:**
- Time to market for new products (↓ 50%)
- Sales team productivity (↑ 30%)
- Reduction in data entry errors (↓ 80%)

**Operational Impact:**
- IT support tickets for catalog updates (↓ 90%)
- Developer time spent on catalog (↓ 95%)
- Manual QA time (↓ 70%)

**Customer Impact:**
- Catalog completeness (↑ 500%)
- Translation coverage (↑ 200%)
- Media availability (↑ 4600%)

---

## Risk Analysis

### Technical Risks

**Risk 1: Data Migration Complexity**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Thorough testing on staging database
  - Rollback plan ready
  - Migrate in phases (10 connectors at a time)
  - Keep old system running in parallel for 1 month

**Risk 2: Performance Degradation at Scale**
- **Impact:** Medium
- **Probability:** Low (with proper architecture)
- **Mitigation:**
  - Load testing with 10x expected data
  - Monitor query performance (pg_stat_statements)
  - Add indexes proactively
  - Implement caching early

**Risk 3: Supabase Service Limits**
- **Impact:** High
- **Probability:** Low
- **Mitigation:**
  - Understand tier limits before launch
  - Upgrade to Pro tier ($25/month) before hitting limits
  - Monitor usage dashboards
  - Implement rate limiting on admin side

**Risk 4: Third-Party Dependencies**
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:**
  - Lock dependency versions
  - Automated security scanning (Dependabot)
  - Regular updates (monthly)
  - Fallback for critical dependencies

### Security Risks

**Risk 5: Unauthorized Admin Access**
- **Impact:** Critical
- **Probability:** Low (with proper auth)
- **Mitigation:**
  - Strong password requirements
  - 2FA for Super Admins
  - IP whitelisting for production (optional)
  - Account lockout after failed attempts
  - Regular security audits

**Risk 6: Data Leaks via API**
- **Impact:** High
- **Probability:** Low
- **Mitigation:**
  - Rate limiting on all endpoints
  - API key rotation policy
  - Monitor for suspicious activity
  - No sensitive data in logs

**Risk 7: SQL Injection / XSS Attacks**
- **Impact:** Critical
- **Probability:** Very Low (using Supabase client)
- **Mitigation:**
  - Never construct raw SQL
  - Input validation on all forms
  - Output encoding (React default)
  - Regular penetration testing

### Operational Risks

**Risk 8: User Training / Adoption**
- **Impact:** High (system useless if not adopted)
- **Probability:** Medium
- **Mitigation:**
  - User training sessions (2 hours)
  - Video tutorials for each feature
  - In-app tooltips and guides
  - Dedicated support channel (Slack)
  - Onboarding checklist

**Risk 9: Data Inconsistency (Concurrent Edits)**
- **Impact:** Medium
- **Probability:** Low (small team)
- **Mitigation:**
  - Optimistic locking (version numbers)
  - Real-time presence indicators
  - Conflict resolution UI
  - Audit logs to track changes

**Risk 10: Incomplete Translation Management**
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:**
  - Automated translation status dashboard
  - Email reminders for incomplete translations
  - Block publishing if critical translations missing
  - Translation validation rules

### Business Risks

**Risk 11: Scope Creep**
- **Impact:** Medium (delayed launch)
- **Probability:** High
- **Mitigation:**
  - Strict MVP definition (Phase 1 only)
  - Feature request backlog (Phase 2/3)
  - Regular stakeholder check-ins
  - "No" by default policy

**Risk 12: Budget Overrun**
- **Impact:** Low
- **Probability:** Low
- **Mitigation:**
  - Fixed-price development or time-boxed sprints
  - Use existing tech stack (Next.js, Supabase)
  - Leverage open-source components
  - Phased rollout (spread costs)

**Risk 13: Vendor Lock-In (Supabase)**
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:**
  - Supabase is open-source (can self-host)
  - Database is PostgreSQL (portable)
  - Abstract Supabase calls behind service layer
  - Regular backups to external storage

---

## Implementation Phases

### Phase 1: MVP (8-10 weeks)

**Goal: Launch functional admin that replaces manual processes**

**Week 1-2: Foundation**
- [ ] Project setup (Next.js routes, admin layout)
- [ ] Authentication system (Supabase Auth + admin_users table)
- [ ] Role-based access control
- [ ] Admin layout and navigation

**Week 3-4: Core CRUD**
- [ ] Connector list view (table with search/filter)
- [ ] Create connector form (multi-step wizard)
- [ ] Edit connector form
- [ ] Delete connector (soft delete)
- [ ] Form validation

**Week 5-6: Media Management**
- [ ] File upload (direct to Supabase Storage)
- [ ] Media library (grid view)
- [ ] Video thumbnail generation
- [ ] File validation and compression

**Week 7-8: Essential Features**
- [ ] Draft/Published workflow
- [ ] Audit logs (basic)
- [ ] Translation interface (side-by-side editor)
- [ ] Series/category management

**Week 9-10: Polish & Launch**
- [ ] User testing with 2-3 team members
- [ ] Bug fixes
- [ ] User training sessions
- [ ] Documentation (user guide)
- [ ] Soft launch (5 admin users)

**Success Criteria:**
- Can add 10 connectors in under 1 hour
- Zero critical bugs for 1 week
- User satisfaction > 7/10

### Phase 2: Enhanced Productivity (6-8 weeks)

**Goal: Make admin 5x faster with automation and bulk tools**

**Week 1-2: Bulk Operations**
- [ ] Excel import/export
- [ ] Bulk edit (multiple connectors)
- [ ] Bulk media upload (drag 20 files)

**Week 3-4: Smart Validation**
- [ ] AI-powered suggestions (compatible connectors)
- [ ] Data quality dashboard
- [ ] Cross-reference checker
- [ ] Duplicate detection

**Week 5-6: Workflow & Analytics**
- [ ] Review/approval workflow
- [ ] Admin analytics dashboard
- [ ] Email notifications
- [ ] Activity feed

**Week 7-8: Optimization**
- [ ] Performance optimizations (query caching)
- [ ] Translation vendor integration (export/import)
- [ ] Relationship visualizer
- [ ] Advanced search

**Success Criteria:**
- Time to add connector < 3 minutes
- Bulk import 100 connectors in < 10 minutes
- Translation completeness > 95%

### Phase 3: World-Class Features (8-10 weeks)

**Goal: Best-in-class admin system with unique features**

**Week 1-2: API & Integrations**
- [ ] Public API (RESTful)
- [ ] API documentation (Swagger)
- [ ] Webhook support
- [ ] ERP integration (pilot)

**Week 3-4: Advanced Features**
- [ ] Price management
- [ ] Inventory integration
- [ ] Customer inquiry tracking
- [ ] Advanced public site search

**Week 5-6: Collaboration**
- [ ] Real-time collaboration
- [ ] Comments on connectors
- [ ] Version comparison
- [ ] Notification system

**Week 7-8: Mobile & Extras**
- [ ] Mobile admin app (React Native or PWA)
- [ ] Multi-tenant support (if needed)
- [ ] Advanced analytics
- [ ] Custom reports

**Week 9-10: Final Polish**
- [ ] Comprehensive testing
- [ ] Performance tuning
- [ ] Security audit
- [ ] User training (advanced features)

**Success Criteria:**
- Time to add connector < 2 minutes
- Support 1000+ connectors with ease
- User satisfaction > 9/10
- Zero data integrity issues

---

## Future Roadmap Ideas

### Year 1: Consolidation
- Refine based on user feedback
- Optimize performance bottlenecks
- Expand to all 10+ product families
- Reach 500+ connectors in catalog

### Year 2: Expansion
- **Customer Portal:**
  - Self-service quote requests
  - Order history
  - Custom catalogs
  - Saved searches

- **Partner Portal:**
  - White-label admin
  - Regional pricing
  - Distributor management
  - Custom branding

- **CAD Integration:**
  - 3D models (STEP, IGES)
  - PCB footprints (Eagle, KiCad)
  - Circuit symbols
  - Automatic CAD file generation

### Year 3: Intelligence
- **AI Features:**
  - Natural language search ("Find me a high-current vertical connector")
  - Auto-complete product specs
  - Image recognition (upload photo, find connector)
  - Predictive analytics (suggest products to customer)

- **Advanced Analytics:**
  - Conversion funnel (search → view → download → inquire)
  - A/B testing product descriptions
  - Heat maps (most viewed specs)
  - Recommendation engine

### Long-Term Vision
- **Ecosystem Platform:**
  - Connector marketplace (third-party products)
  - Developer API ecosystem
  - Certification programs (verified partners)
  - Industry standards integration (IEC, UL)

- **Manufacturing Integration:**
  - Real-time inventory from factory floor
  - Production scheduling visibility
  - Quality control data
  - Supply chain transparency

---

## Appendix

### A. Tech Stack Summary

**Frontend:**
- Next.js 15.5.4 (App Router)
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x
- shadcn/ui components
- Radix UI primitives

**Backend:**
- Next.js Server Actions
- Next.js Route Handlers (API routes)
- Supabase (PostgreSQL 15)
- Supabase Storage
- Supabase Auth
- Supabase Realtime (optional)

**Dev Tools:**
- ESLint (code quality)
- Prettier (formatting)
- Husky (git hooks)
- Vitest (unit tests)
- Playwright (E2E tests)

**Infrastructure:**
- Vercel (hosting)
- Supabase Cloud (database + storage)
- Vercel Edge Network (CDN)
- Vercel KV (Redis cache, optional)

**Third-Party Services:**
- Sentry (error tracking)
- PostHog (analytics)
- Resend (transactional emails)
- Google Translate API (machine translation, optional)

### B. Estimated Costs

**Development Costs:**
- Phase 1 (MVP): $40,000 - $60,000 (8-10 weeks @ $5k/week)
- Phase 2 (Enhanced): $30,000 - $40,000 (6-8 weeks)
- Phase 3 (World-Class): $40,000 - $50,000 (8-10 weeks)
- **Total Development**: $110,000 - $150,000

**Operational Costs (Monthly):**
- Supabase Pro: $25/month (includes 8 GB database, 100 GB storage)
- Vercel Pro: $20/month (or free if using Hobby tier)
- Sentry: $26/month (10k errors)
- Resend: $20/month (50k emails)
- Additional storage (if needed): $0.021/GB
- **Total Operational**: ~$90/month ($1,080/year)

**ROI Calculation:**
- Developer time saved: 20 hours/month @ $100/hour = $2,000/month
- Marketing time saved: 10 hours/month @ $75/hour = $750/month
- Reduced errors: ~$500/month (estimated)
- **Total Savings**: $3,250/month = $39,000/year
- **Payback Period**: ~3-4 years for full Phase 1-3 build
- **Payback Period (MVP only)**: ~1.5 years

**Budget-Conscious Alternative:**
- Build Phase 1 only: $40,000 - $60,000
- Validate with real usage for 6 months
- Build Phase 2 only if needed
- Payback period (MVP): ~1.5 years

### C. Reference Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN USERS (Browser)                    │
│  Sarah (Engineer) | Miguel (Marketing) | James (Sales)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL EDGE NETWORK                       │
│                    (CDN + Edge Functions)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APPLICATION                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PUBLIC ROUTES              ADMIN ROUTES              │  │
│  │  /catalog                   /admin/dashboard          │  │
│  │  /connector/[id]            /admin/connectors         │  │
│  │  /resources                 /admin/media              │  │
│  │                             /admin/translations       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MIDDLEWARE                                           │  │
│  │  - Auth check (admin routes)                          │  │
│  │  - Role-based access control                          │  │
│  │  - Rate limiting                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE PLATFORM                        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  PostgreSQL    │  │   Storage      │  │    Auth      │  │
│  │  (Database)    │  │   (S3-like)    │  │  (JWT)       │  │
│  │                │  │                │  │              │  │
│  │  - connectors  │  │  - videos      │  │  - users     │  │
│  │  - terminals   │  │  - images      │  │  - sessions  │  │
│  │  - admin_users │  │  - pdfs        │  │  - roles     │  │
│  │  - audit_logs  │  │                │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                      │
│  - ERP System (SAP, Oracle)                                 │
│  - Translation Vendors (Excel import/export)                │
│  - Partner APIs (distributors)                              │
└─────────────────────────────────────────────────────────────┘
```

### D. Sample User Onboarding Checklist

**New Admin User - First 30 Minutes:**

**Day 1: Getting Started**
- [ ] Receive welcome email with login credentials
- [ ] Log in to admin portal
- [ ] Change default password
- [ ] Set up 2FA (email code)
- [ ] Watch 5-minute intro video
- [ ] Take tour of admin interface
- [ ] View sample connector
- [ ] Explore media library

**Day 1: First Tasks (Guided)**
- [ ] Create your first connector (use template)
- [ ] Upload a 360° video
- [ ] Add terminal specifications
- [ ] Preview connector on public site
- [ ] Publish connector (Draft → Published)
- [ ] View audit log entry

**Week 1: Core Workflows**
- [ ] Create 5 connectors (get comfortable with form)
- [ ] Bulk upload 10 media files
- [ ] Edit existing connector
- [ ] Add translations (1 language)
- [ ] Use search and filters
- [ ] Export connector list to Excel

**Week 2: Advanced Features**
- [ ] Set up compatibility relationships
- [ ] Use bulk edit (change 5 connectors at once)
- [ ] Import connectors from Excel
- [ ] Add special version notes
- [ ] Review activity in analytics dashboard
- [ ] Attend live training session (optional)

**Month 1: Power User**
- [ ] Complete 50+ connectors
- [ ] Master translation workflow
- [ ] Train a colleague
- [ ] Suggest a feature improvement
- [ ] Celebrate! 🎉

---

## Document Control

**Change Log:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-08 | Claude | Initial PRD draft |

**Approvals:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | __________ | __________ | __________ |
| Tech Lead | __________ | __________ | __________ |
| Stakeholder (Engineering) | __________ | __________ | __________ |
| Stakeholder (Marketing) | __________ | __________ | __________ |

**Distribution:**
- Engineering Team (full document)
- Marketing Team (sections 3, 6, 14)
- Sales Team (sections 3, 14)
- Executive Team (sections 1, 2, 13, 14)

---

**END OF PRD**

**Next Steps:**
1. Review this PRD with stakeholders
2. Prioritize features (must/should/nice)
3. Get budget approval
4. Assign development team
5. Create detailed technical design document
6. Begin Phase 1 implementation

**Questions? Contact:**
- Product Lead: [Your Email]
- Tech Lead: [Tech Lead Email]
- Project Manager: [PM Email]
