# Product Requirements Document: RAST 5 Admin Backend
## Technical Catalog & Lead Generation System

**Version:** 2.0 (Revised)
**Date:** October 2025
**Status:** Draft for Review
**Project:** Industrial Connector Catalog Admin System

---

## Executive Summary

### Vision
Build a world-class, intuitive admin backend for a **technical catalog website** that enables teams to efficiently manage a rapidly growing industrial connector catalog (from 16 to 1000+ products) while maintaining data integrity, supporting 6 languages, and serving thousands of engineers worldwide. Focus on **product discovery and lead generation**, not e-commerce.

### Business Model
**Traditional B2B Sales Model:**
- Engineers browse catalog online
- Download technical specs, CAD files, datasheets
- Submit inquiries (quote requests, sample requests)
- Sales team follows up offline (email/phone)
- Orders processed through traditional sales channels

### Business Goals
1. **Accelerate Product Onboarding**: Reduce time-to-publish for new connectors from hours to minutes
2. **Scale Content Operations**: Support 741+ media files and 10+ product families without overwhelming admin users
3. **Empower Non-Technical Teams**: Enable marketing and sales to manage content independently
4. **Maintain Data Quality**: Enforce validation, prevent errors, ensure consistency across translations
5. **Enable Global Operations**: Support multi-language content management for 6 languages
6. **Generate Qualified Leads**: Capture and track customer inquiries for sales follow-up

### Success Metrics

| Metric | Current State | Target (6 months) | Target (12 months) |
|--------|--------------|-------------------|-------------------|
| Time to add new connector | N/A (manual) | < 5 minutes | < 3 minutes |
| Admin user satisfaction | N/A | 8/10 | 9/10 |
| Data error rate | Unknown | < 2% | < 0.5% |
| Products in catalog | 16 | 200+ | 500+ |
| Admin concurrent users | 0 | 5 | 10-15 |
| Translation completeness | ~80% | 95% | 99% |
| Monthly qualified leads | Unknown | 50+ | 200+ |
| Lead response time | Unknown | < 24 hours | < 4 hours |

### Strategic Value
- **Competitive Advantage**: Best-in-class technical catalog (like Molex/TE but focused)
- **Revenue Enablement**: Faster product launches = faster time to revenue
- **Customer Experience**: Accurate, complete data = better engineer experience
- **Operational Efficiency**: Self-service admin = reduced IT dependency
- **Lead Quality**: Structured inquiry system = better qualified leads for sales

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
9. **No system to capture and track customer inquiries/quote requests**
10. **No centralized lead management for sales team**

### Impact of NOT Building This
- **Business Risk**: Cannot scale to support 10+ product families
- **Operational Bottleneck**: Every product update requires developer time
- **Quality Risk**: Manual processes lead to errors and inconsistencies
- **Competitive Risk**: Slower product launches than Molex/TE
- **Team Frustration**: Marketing/Sales blocked by technical dependencies
- **Lost Leads**: No systematic way to capture engineer inquiries
- **Sales Inefficiency**: Scattered email inquiries, no tracking, slow response

### Real-World Scenario
> An automotive engineer finds your 6-pole connector online at 2 AM (Germany time). He downloads the datasheet, checks compatibility, and wants to request samples. He fills out a form, but there's no system to route this to sales. The inquiry sits in a general inbox for 3 days. By then, he's already ordered from Molex.
>
> **Without Admin + Inquiry System**: Lost opportunity, no tracking
> **With Admin + Inquiry System**: Inquiry routed to regional sales rep, responded to in 4 hours, samples shipped same day

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
- Upload technical drawings and CAD files
- Review customer technical questions from inquiry forms

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
- Upload product photos, 360° videos, and PDFs
- Write and translate marketing descriptions
- Update display names and SEO-friendly content
- Organize media library and tag assets
- Review lead sources and popular products

**Pain Points:**
- Frustrated by slow file uploads
- Confused by technical jargon
- Needs to coordinate with 3 translation vendors

**Quote**: "I just want to drag and drop the new product video, add a nice description in 6 languages, and publish it. Why does this need to involve IT?"

### Persona 3: Sales Operations (James)
**Role**: Sales Engineer Support
**Technical Skill**: Medium (Excel power user, technical sales background)
**Frequency**: Daily (2-3 hours)

**Key Tasks:**
- **Review and respond to customer inquiries**
- **Assign leads to regional sales reps**
- **Track inquiry status (quoted, won, lost)**
- Export product lists for customer quotes
- Check product specs quickly during customer calls
- Generate custom catalog PDFs for trade shows

**Pain Points:**
- Inquiries come from multiple channels (email, web form, phone)
- No central system to track inquiry status
- Can't see which products generate most interest
- Frustrated by stale data on website

**Quote**: "When a customer requests a quote, I need to know immediately. And I need to track it through to close. Right now it's all spreadsheets and email threads."

### Persona 4: External Engineer (End User - Public Site)
**Role**: Automotive Systems Engineer
**Technical Skill**: Expert in electrical systems
**Frequency**: Monthly (research phase)

**Key Tasks:**
- Find connectors matching exact specifications
- Verify compatibility with existing designs
- Download technical drawings and datasheets
- Compare multiple options
- **Request samples or quotes**
- **Save favorite connectors for future reference**

**Impact of Admin System:**
- Relies on catalog data accuracy for critical decisions
- Expects complete, up-to-date information
- Needs fast, reliable access to technical resources
- **Wants quick response to inquiries (< 24 hours)**

---

## Feature Requirements

### Phase 1: MVP (8-10 weeks) - Must-Have for Launch

#### 1.1 User Authentication & Authorization

**Requirements:**
- Supabase Auth integration with email/password
- Role-Based Access Control (RBAC):
  - **Super Admin**: Full access (God mode)
  - **Content Manager**: CRUD on connectors, read-only on config
  - **Translator**: Edit translations only
  - **Sales Viewer**: Read catalog + manage inquiries
- Session management (30-day remember me)
- Password reset via email
- Forced password change on first login
- Account lockout after 5 failed attempts

**User Stories:**
- As a Super Admin, I can invite new users and assign roles
- As a Content Manager, I can edit connectors but not delete storage buckets
- As a Translator, I can only access translation interface
- As a Sales Viewer, I can view catalog and manage customer inquiries

**Security Requirements:**
- Passwords: minimum 12 characters, require uppercase, lowercase, number, symbol
- 2FA via email code (optional, recommended for Super Admin)
- API rate limiting: 100 requests/minute per user
- Session timeout: 24 hours of inactivity

**Technical Spec:**
```typescript
// Role definitions
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONTENT_MANAGER = 'content_manager',
  TRANSLATOR = 'translator',
  SALES_VIEWER = 'sales_viewer'
}

// Permission mapping
const permissions = {
  super_admin: ['*'],
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
  sales_viewer: [
    'connectors:read',
    'media:read',
    'inquiries:read',
    'inquiries:update',
    'inquiries:export',
  ]
}
```

#### 1.2 Connector Management (CRUD)

**Create New Connector:**
- Multi-step wizard UI:
  - Step 1: Basic Info (model, category, pole count)
  - Step 2: Technical Specs (gender, orientation, terminals)
  - Step 3: Media Upload (360° video, thumbnails, technical drawings)
  - Step 4: Compatibility (mating connectors, compatible terminals)
  - Step 5: Documentation (datasheets, CAD files, certifications)
  - Step 6: Review & Publish
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
  connector_type: 'R' | 'T' | 'S';
  gender: 'Female' | 'Male' | 'PCB';
  orientation?: 'Horizontal' | 'Vertical';
  mounting_type?: string;
  terminal_suffix: string;

  // Step 3: Terminal Specs
  terminal_specs: string[];
  terminal_description?: string;

  // Step 4: Wire & Electrical
  wire_gauge_min?: number;
  wire_gauge_max?: number;
  current_rating?: number; // Amps
  voltage_rating?: number; // Volts
  pitch?: number; // mm
  operating_temp_min?: number; // °C
  operating_temp_max?: number; // °C

  // Step 5: Compatibility
  compatible_with: string[];
  mates_with: string[];
  assembly_variants: string[];

  // Step 6: Media
  video_360_url: string; // Required
  video_thumbnail_time?: number;
  technical_drawing_url?: string;
  terminal_images: string[];

  // Step 7: Documentation
  datasheet_pdf?: string; // NEW: Product datasheet
  cad_files?: {
    step?: string; // 3D CAD file (STEP format)
    iges?: string; // 3D CAD file (IGES format)
    dxf?: string;  // 2D drawing (DXF format)
  };
  certifications?: {
    ul?: string; // UL certification number
    ce?: boolean;
    rohs?: boolean;
    reach?: boolean;
  };
  keying_pdf?: string;
  is_special_version: boolean;
  special_notes?: string;

  // Metadata
  status: 'draft' | 'published';
  created_by: string;
  updated_by: string;
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
  - Has CAD files (yes/no)
  - Has certifications (yes/no)
- Sort by: model, created_at, updated_at, pole_count
- Bulk selection for bulk operations
- Quick actions: Edit, Duplicate, Delete, Preview
- **Download count tracking**: See how many times datasheet/CAD downloaded

**Update Connector:**
- Same form as Create, pre-filled with existing data
- Track changes (show "last updated by X on Y")
- Confirm before overwriting draft changes
- Option to "Save as New" (duplicate then edit)

**Delete Connector:**
- Soft delete (mark as deleted, keep in database)
- Confirmation modal with impact warning
- Only Super Admin can hard delete
- Restore deleted connectors (within 30 days)

#### 1.3 Media Management

**File Upload:**
- Drag-and-drop interface
- Multi-file upload (up to 20 files)
- Progress bars per file
- Supported formats:
  - Videos: MP4, WebM (max 50 MB)
  - Images: JPG, PNG, WebP (max 10 MB)
  - Documents: PDF (max 25 MB)
  - CAD Files: STEP, IGES, DXF (max 50 MB)
- Automatic compression for images
- Video thumbnail generation
- File naming conventions enforced

**Media Library:**
- Grid view with thumbnails
- Filter by:
  - Media type (video, image, PDF, CAD)
  - Associated product
  - Upload date
  - File size
- Bulk operations:
  - Delete multiple files
  - Bulk rename
- Usage tracking: "Used in 3 connectors, downloaded 47 times"
- Unused files warning
- Storage usage dashboard

**Storage Organization:**
```
connector-videos/
  ├── rast5/
  ├── automotive/
  └── dsb/

terminal-images/
  ├── female/
  └── male/

technical-drawings/
  ├── CS-R502KxxPF-drawing.pdf
  └── ...

datasheets/
  ├── rast5/
  └── automotive/

cad-files/
  ├── step/
  ├── iges/
  └── dxf/

keying-pdfs/
```

**Performance Requirements:**
- Upload speed: 1 MB/sec minimum
- Thumbnail generation: < 3 seconds
- Load media library: < 2 seconds
- Support for 10,000+ files

#### 1.4 Customer Inquiry Management (NEW - Core Feature)

**Public Site Inquiry Form:**
Located on every connector detail page + dedicated "Contact Us" page

**Form Fields:**
```typescript
interface InquiryForm {
  // Contact Information
  full_name: string; // Required
  email: string; // Required, validated
  company: string; // Required
  phone?: string; // Optional
  country: string; // Dropdown, required

  // Inquiry Details
  inquiry_type: 'quote' | 'samples' | 'technical' | 'general'; // Required
  connector_id?: string; // Auto-filled if submitted from product page
  connector_model?: string; // Auto-filled
  quantity_needed?: number; // Optional
  application_description?: string; // Textarea, max 1000 chars
  technical_question?: string; // Textarea for technical inquiries

  // Project Info (Optional)
  project_timeline?: 'immediate' | '1_month' | '3_months' | '6_months+';
  annual_volume?: string; // Estimated annual volume

  // Marketing
  how_did_you_hear?: 'search' | 'referral' | 'trade_show' | 'other';
  newsletter_opt_in?: boolean;

  // Metadata (Auto-filled)
  submitted_at: Date;
  ip_address: string;
  user_agent: string;
  referrer_url?: string;
}
```

**Admin Inquiry Management Interface:**

**List View:**
```
┌─────────────────────────────────────────────────────────────┐
│  Customer Inquiries                     [Export] [Filter ▼] │
│─────────────────────────────────────────────────────────────│
│                                                             │
│  Status: [All ▼] [New (12)] [In Progress (5)] [Closed (45)]│
│  Type: [All ▼] [Quote] [Samples] [Technical] [General]     │
│  Date Range: [Last 30 Days ▼]                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🔴 NEW  Quote Request - CS-R502KxxPF                  │ │
│  │ John Smith (john@acme-auto.com)                       │ │
│  │ ACME Automotive - Germany                             │ │
│  │ "Need 10,000 pcs for new ECU design"                  │ │
│  │ Submitted: 2 hours ago                                │ │
│  │ [Assign to Rep] [Mark In Progress] [View Details]    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🟡 IN PROGRESS  Sample Request - X04-63N235-MA        │ │
│  │ Sarah Chen (sarah@bosch.com)                          │ │
│  │ Bosch - China                                         │ │
│  │ Assigned to: James Wilson                             │ │
│  │ Submitted: 1 day ago                                  │ │
│  │ [View Details] [Add Note] [Mark Closed]               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Detail View:**
```
┌─────────────────────────────────────────────────────────────┐
│  Inquiry #INQ-20251008-001                    [Edit] [Close]│
│─────────────────────────────────────────────────────────────│
│                                                             │
│  Contact Information                                        │
│  ─────────────────                                         │
│  Name: John Smith                                          │
│  Email: john@acme-auto.com                                 │
│  Company: ACME Automotive GmbH                             │
│  Phone: +49 123 456 789                                    │
│  Country: Germany                                          │
│                                                             │
│  Inquiry Details                                           │
│  ─────────────────                                         │
│  Type: Quote Request                                       │
│  Product: CS-R502KxxPF (2-Pole Socket Connector)          │
│  Quantity: 10,000 pieces                                   │
│  Timeline: 1-3 months                                      │
│  Annual Volume: 50,000 pieces                              │
│                                                             │
│  Application:                                              │
│  "We are designing a new ECU for electric vehicles and     │
│   need a reliable connector for CAN bus communications.    │
│   Operating temperature range: -40°C to 125°C."           │
│                                                             │
│  Status & Assignment                                       │
│  ─────────────────                                         │
│  Status: [New ▼] → [In Progress] [Quoted] [Won] [Lost]   │
│  Assigned to: [Select Sales Rep ▼]                        │
│  Priority: [🔴 High]                                       │
│                                                             │
│  Activity Log                                              │
│  ─────────────────                                         │
│  📧 2025-10-08 14:32 - Inquiry submitted                   │
│  👤 2025-10-08 14:45 - Viewed by Sarah (Engineering)       │
│  📝 2025-10-08 15:10 - Note added by James: "Contacted     │
│      customer, sending samples next week"                  │
│                                                             │
│  [Add Note]  [Send Email Template]  [Export to CRM]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Inquiry Database Schema:**
```sql
CREATE TABLE customer_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_number TEXT UNIQUE NOT NULL, -- INQ-20251008-001

  -- Contact Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,

  -- Inquiry Details
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('quote', 'samples', 'technical', 'general')),
  connector_id TEXT REFERENCES connectors(id),
  connector_model TEXT,
  quantity_needed INTEGER,
  application_description TEXT,
  technical_question TEXT,

  -- Project Info
  project_timeline TEXT,
  annual_volume TEXT,
  how_did_you_hear TEXT,
  newsletter_opt_in BOOLEAN DEFAULT false,

  -- Status & Assignment
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'quoted', 'won', 'lost', 'closed')),
  assigned_to UUID REFERENCES admin_users(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,

  -- Sales Tracking
  quote_sent_at TIMESTAMP WITH TIME ZONE,
  quote_amount DECIMAL(10,2),
  close_date TIMESTAMP WITH TIME ZONE,
  close_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  INDEX idx_inquiries_status (status, submitted_at DESC),
  INDEX idx_inquiries_assigned (assigned_to, status),
  INDEX idx_inquiries_connector (connector_id),
  INDEX idx_inquiries_email (email)
);

-- Activity log for inquiries
CREATE TABLE inquiry_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID REFERENCES customer_inquiries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id),
  activity_type TEXT NOT NULL, -- 'note', 'status_change', 'assignment', 'email_sent'
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Features:**
- **Auto-assignment**: Route inquiries to sales reps based on region/product
- **Email notifications**: Notify assigned rep immediately
- **Response templates**: Pre-written email responses for common inquiries
- **CRM export**: Export inquiries to Excel/CSV for import into CRM
- **Analytics**: Track conversion rates (inquiry → quote → won)
- **Follow-up reminders**: Alert if inquiry not responded to in 24 hours

**Email Notification Example:**
```
To: james.wilson@yourcompany.com
Subject: 🔴 New Quote Request - CS-R502KxxPF - ACME Automotive

Hi James,

You have a new HIGH PRIORITY quote request:

Customer: John Smith (john@acme-auto.com)
Company: ACME Automotive GmbH
Country: Germany

Product: CS-R502KxxPF (2-Pole Socket Connector)
Quantity: 10,000 pieces
Timeline: 1-3 months

Application: ECU for electric vehicles, CAN bus

View full details: https://your-admin.com/admin/inquiries/INQ-20251008-001

Please respond within 24 hours.

---
RAST 5 Admin System
```

#### 1.5 Category & Series Management

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

#### 1.6 Search & Filtering (Admin)

**Global Search:**
- Search across:
  - Connector models
  - Display names
  - Descriptions (all languages)
  - Terminal specs
  - Special notes
  - **Customer inquiries** (name, company, email)
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
  - "Missing CAD Files"
  - **"Unassigned Inquiries"**
  - **"High Priority Leads"**
- Share filter URLs with team

#### 1.7 Audit Logs & Version History

**Activity Log:**
```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  user_id: string;
  user_email: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'inquiry_assigned' | 'inquiry_closed';
  entity_type: 'connector' | 'series' | 'terminal' | 'media' | 'user' | 'inquiry';
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

#### 1.8 Translation Management

**Translation Interface:**
- Side-by-side editor:
  - Left: English (source)
  - Right: Target language
- Languages: English, Italian, Spanish, German, Russian, Portuguese
- Fields to translate:
  - display_name
  - terminal_description
  - application_description (for series/categories)
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
- Machine translation suggestions (Google Translate API - optional)
- Mark as "verified by native speaker"

---

### Phase 2: Enhanced Productivity (6-8 weeks) - Should-Have

#### 2.1 Bulk Operations

**Bulk Import:**
- Upload Excel/CSV with connector data
- Column mapping interface
- Validation before import
- Preview import (first 10 rows)
- Import in background (queue)
- Email notification on completion
- Error report with line numbers

**Bulk Export:**
- Export filtered connectors to:
  - Excel (.xlsx)
  - CSV
  - JSON
  - PDF Catalog (formatted, print-ready)
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
  - **"No datasheet uploaded"**
  - **"No CAD files available"**
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

#### 2.3 Analytics Dashboard

**Metrics to Track:**

**Admin Usage:**
- Active users per day
- Top contributors
- Average time per task
- Most active users

**Content Metrics:**
- Connectors added per week
- Translation completion rate
- Media upload volume
- Draft vs. published ratio

**Public Site Metrics:**
- Most viewed connectors (top 10)
- Popular search terms
- Filter usage patterns
- **Download counts** (datasheets, CAD files, technical drawings)
- **Inquiry conversion rate** (views → inquiries)
- Geographic distribution of visitors

**Lead Metrics (NEW):**
- Inquiries per week/month
- Inquiry type breakdown (quote vs. samples vs. technical)
- Average response time
- Conversion rate (inquiry → quote → won)
- Top products generating inquiries
- Top countries/regions
- Lead source breakdown

**Dashboard Widgets:**
```
┌─────────────────────────────────────────────────────────────┐
│  Analytics Dashboard                                        │
│─────────────────────────────────────────────────────────────│
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐ │
│  │ 📊 This Month   │  │ 📧 Inquiries    │  │ 🎯 Leads   │ │
│  │                 │  │                 │  │            │ │
│  │ 42 Connectors   │  │ 127 Total       │  │ 23% Conv   │ │
│  │ +12% vs last    │  │ 18 Unassigned   │  │ 15 Won     │ │
│  └─────────────────┘  └─────────────────┘  └────────────┘ │
│                                                             │
│  Top 10 Downloaded Products                                │
│  ────────────────────────────────                          │
│  1. CS-R502KxxPF - 342 downloads                          │
│  2. CS-T502VKxxPF - 298 downloads                         │
│  3. X04-63N235-MA - 256 downloads                         │
│  ...                                                       │
│                                                             │
│  Inquiries by Product                                      │
│  ────────────────────────                                  │
│  [Bar Chart: CS-R502KxxPF leads with 23 inquiries]        │
│                                                             │
│  Geographic Distribution                                   │
│  ────────────────────────                                  │
│  🇩🇪 Germany: 34%                                          │
│  🇺🇸 USA: 28%                                              │
│  🇨🇳 China: 18%                                            │
│  🇮🇹 Italy: 12%                                            │
│  🌍 Other: 8%                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2.4 Advanced Inquiry Features

**Lead Scoring:**
```typescript
interface InquiryScore {
  inquiry_id: string;
  score: number; // 0-100
  factors: {
    company_size: number; // Known company = higher score
    quantity: number; // Higher quantity = higher score
    timeline: number; // Immediate need = higher score
    engagement: number; // Visited multiple products = higher score
    completeness: number; // Filled all fields = higher score
  };
  priority_recommendation: 'low' | 'normal' | 'high' | 'urgent';
}
```

**Auto-responder:**
- Immediate email confirmation to customer
- Includes inquiry reference number
- Expected response time
- Link to track inquiry status (optional)

**Follow-up Automation:**
- Alert if inquiry not assigned within 2 hours
- Alert if no response sent within 24 hours
- Escalation to sales manager if no action after 48 hours

**Integration with Email:**
- Two-way email sync (inquiry responses via email update status)
- Email templates with merge fields
- Attach product datasheets automatically

#### 2.5 CAD File Management (NEW)

**CAD Library:**
- Organized by connector model
- Support for multiple formats per product:
  - STEP (3D solid model)
  - IGES (3D surface model)
  - DXF (2D drawings)
  - PCB footprints (Eagle, KiCad, Altium)
- Preview CAD files in browser (3D viewer for STEP/IGES)
- Track download counts per file type
- Bulk upload CAD files with auto-association to products

**3D Viewer Integration:**
- Embedded 3D viewer on product detail page
- Rotate, zoom, measure dimensions
- Export screenshots
- Option to download native file

---

### Phase 3: World-Class Features (8-10 weeks) - Nice-to-Have

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

POST   /api/v1/inquiries (for partner portals to submit leads)
GET    /api/v1/inquiries (for CRM integration)
```

**Features:**
- API key authentication
- Rate limiting per client
- Webhook support for events:
  - `connector.created`
  - `connector.updated`
  - `connector.published`
  - `inquiry.created`
  - `inquiry.status_changed`
- OpenAPI/Swagger documentation
- Client SDKs (JavaScript, Python)

**Use Cases:**
- Distributor portals sync product catalog
- CRM systems pull inquiry data automatically
- Partner websites embed product search
- Mobile app backend

#### 3.2 Advanced Parametric Search (Public Site)

**Engineer-Focused Search:**
```
┌─────────────────────────────────────────────────────────────┐
│  Find the Perfect Connector                                 │
│─────────────────────────────────────────────────────────────│
│                                                             │
│  Basic Specs                                               │
│  Pole Count: [2] [4] [6] [8] [10] [12] [Custom ▼]        │
│  Gender: [ ] Female  [ ] Male  [ ] PCB                     │
│  Orientation: [ ] Horizontal  [ ] Vertical                 │
│                                                             │
│  Electrical Requirements                                   │
│  Current Rating: [_____] A (minimum)                       │
│  Voltage Rating: [_____] V (minimum)                       │
│  Pitch: [2.54] [3.96] [5.08] [8.0] mm                     │
│                                                             │
│  Environmental                                             │
│  Operating Temp: [-40°C] to [125°C]                       │
│  Certifications: [UL] [CE] [RoHS] [REACH]                 │
│                                                             │
│  Availability                                              │
│  [✓] Has CAD files                                         │
│  [✓] Has datasheet                                         │
│  [ ] Has 3D model                                          │
│                                                             │
│  [Search 347 Connectors]                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Natural Language Search:**
- "Find me a 6-pole female connector for automotive"
- "Show connectors rated for 125°C with UL certification"
- Powered by AI to understand engineer terminology

#### 3.3 Customer Portal (Self-Service)

**Features for Logged-In Customers:**
- View inquiry history
- Track inquiry status in real-time
- Download previous quotes
- Save favorite connectors
- Create custom product lists
- Request samples with one click (auto-fills contact info)
- Access order history (if integrated with ERP)

**Benefits:**
- Reduces sales team workload
- Improves customer experience
- Builds customer loyalty
- Tracks engagement per customer

#### 3.4 Comparison Tool

**Side-by-Side Comparison:**
```
┌─────────────────────────────────────────────────────────────┐
│  Compare Connectors                  [Add Product ▼]        │
│─────────────────────────────────────────────────────────────│
│                                                             │
│                 CS-R502KxxPF  CS-T502VKxxPF  X04-63N235-MA │
│                                                             │
│  Pole Count          2              2              4       │
│  Gender             Female        Male           Female    │
│  Orientation        Horiz         Vert           Horiz     │
│  Current Rating     8A            8A             8A        │
│  Voltage Rating     250V          250V           250V      │
│  Wire Gauge         18-22 AWG     18-22 AWG      18-22 AWG │
│  Pitch              5.08mm        5.08mm         5.08mm    │
│  Operating Temp     -40 to 105°C -40 to 105°C   -40 to 125°C│
│                                                             │
│  CAD Files          ✓ STEP/DXF    ✓ STEP/DXF    ✓ STEP    │
│  Datasheet          ✓             ✓             ✓          │
│  UL Certified       ✓             ✓             ✓          │
│                                                             │
│  [Request Quote] [Request Quote] [Request Quote]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3.5 Mobile Admin App (PWA or Native)

**Lightweight Interface for Sales Reps:**
- View connector catalog on mobile
- **Respond to inquiries on-the-go**
- **Upload photos from trade shows**
- **Scan business cards to create inquiries**
- Approve/reject reviews
- Push notifications for new inquiries

**Use Cases:**
- Trade shows: Quick product lookups
- Customer visits: Show catalog on tablet
- On-the-road: Respond to urgent inquiries

#### 3.6 Email Campaign Integration

**Lead Nurturing:**
- Segment customers by:
  - Products viewed
  - Inquiries submitted
  - Geographic region
  - Industry/application
- Send targeted email campaigns:
  - New product announcements
  - Technical tips & best practices
  - Case studies
  - Trade show invitations
- Track email engagement (opens, clicks)
- Auto-follow-up sequences

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
  role user_role NOT NULL DEFAULT 'sales_viewer',
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
  'sales_viewer'
);

-- =============================================
-- CUSTOMER INQUIRIES (NEW)
-- =============================================

CREATE TABLE customer_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_number TEXT UNIQUE NOT NULL,

  -- Contact Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,

  -- Inquiry Details
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('quote', 'samples', 'technical', 'general')),
  connector_id TEXT REFERENCES connectors(id),
  connector_model TEXT,
  quantity_needed INTEGER,
  application_description TEXT,
  technical_question TEXT,

  -- Project Info
  project_timeline TEXT,
  annual_volume TEXT,
  how_did_you_hear TEXT,
  newsletter_opt_in BOOLEAN DEFAULT false,

  -- Status & Assignment
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'quoted', 'won', 'lost', 'closed')),
  assigned_to UUID REFERENCES admin_users(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Lead Scoring
  lead_score INTEGER, -- 0-100
  score_factors JSONB,

  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,

  -- Sales Tracking
  quote_sent_at TIMESTAMP WITH TIME ZONE,
  quote_amount DECIMAL(10,2),
  close_date TIMESTAMP WITH TIME ZONE,
  close_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON customer_inquiries(status, submitted_at DESC);
CREATE INDEX idx_inquiries_assigned ON customer_inquiries(assigned_to, status);
CREATE INDEX idx_inquiries_connector ON customer_inquiries(connector_id);
CREATE INDEX idx_inquiries_email ON customer_inquiries(email);

-- =============================================
-- INQUIRY ACTIVITY LOG
-- =============================================

CREATE TABLE inquiry_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID REFERENCES customer_inquiries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id),
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inquiry_activities ON inquiry_activities(inquiry_id, created_at DESC);

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

  INDEX idx_audit_user (user_id),
  INDEX idx_audit_timestamp (timestamp DESC),
  INDEX idx_audit_entity (entity_type, entity_id)
);

-- =============================================
-- CONNECTOR ENHANCEMENTS
-- =============================================

ALTER TABLE connectors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- NEW: Documentation fields
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS datasheet_pdf TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS cad_step TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS cad_iges TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS cad_dxf TEXT;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS certifications JSONB;

-- NEW: Analytics fields
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0;

-- Check constraint
ALTER TABLE connectors ADD CONSTRAINT check_status
  CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- =============================================
-- DOWNLOAD TRACKING (NEW)
-- =============================================

CREATE TABLE download_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connector_id TEXT REFERENCES connectors(id),
  file_type TEXT NOT NULL, -- 'datasheet', 'cad_step', 'cad_iges', 'technical_drawing'
  ip_address INET,
  country TEXT,
  user_agent TEXT,
  referrer_url TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_downloads_connector ON download_logs(connector_id, downloaded_at DESC);
CREATE INDEX idx_downloads_type ON download_logs(file_type, downloaded_at DESC);

-- =============================================
-- VERSION HISTORY
-- =============================================

CREATE TABLE connector_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connector_id TEXT REFERENCES connectors(id),
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
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
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  language TEXT NOT NULL,
  field TEXT NOT NULL,
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

ALTER TABLE connectors ADD COLUMN series_id TEXT REFERENCES series(id);

-- =============================================
-- MEDIA METADATA
-- =============================================

CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  bucket TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES admin_users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Usage tracking
  used_in_connectors TEXT[],
  download_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_media_bucket ON media_files(bucket);
CREATE INDEX idx_media_type ON media_files(file_type);

-- =============================================
-- RLS POLICIES
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

-- Sales viewers can read all + manage inquiries
CREATE POLICY "Sales viewer access on connectors"
  ON connectors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'sales_viewer'
    )
  );

-- Inquiry policies
CREATE POLICY "Sales can manage inquiries"
  ON customer_inquiries
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'content_manager', 'sales_viewer')
    )
  );
```

### Triggers for Automation

```sql
-- Auto-increment inquiry_number
CREATE OR REPLACE FUNCTION generate_inquiry_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.inquiry_number := 'INQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((
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

-- Update connector counts on inquiry
CREATE OR REPLACE FUNCTION update_connector_inquiry_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE connectors
  SET inquiry_count = inquiry_count + 1
  WHERE id = NEW.connector_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_inquiry_count
  AFTER INSERT ON customer_inquiries
  FOR EACH ROW
  WHEN (NEW.connector_id IS NOT NULL)
  EXECUTE FUNCTION update_connector_inquiry_count();

-- Log inquiry status changes
CREATE OR REPLACE FUNCTION log_inquiry_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO inquiry_activities (inquiry_id, user_id, activity_type, description, metadata)
    VALUES (
      NEW.id,
      NEW.updated_by,
      'status_change',
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_status_changes
  AFTER UPDATE ON customer_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION log_inquiry_status_change();
```

---

## Technical Architecture

### Architecture Decision: Integrated Admin

**Recommendation: Integrated Admin within Next.js App**

**Implementation:**
```
src/
├── app/
│   ├── (public)/              # Public-facing site
│   │   ├── [locale]/
│   │   │   ├── catalog/
│   │   │   ├── connector/[id]/
│   │   │   ├── resources/
│   │   │   └── contact/       # NEW: Inquiry form
│   │   └── layout.tsx
│   │
│   └── (admin)/               # Admin portal
│       ├── admin/
│       │   ├── layout.tsx
│       │   ├── dashboard/
│       │   ├── connectors/
│       │   ├── inquiries/     # NEW: Inquiry management
│       │   ├── media/
│       │   ├── translations/
│       │   ├── analytics/     # NEW: Analytics dashboard
│       │   ├── users/
│       │   └── settings/
│       └── middleware.ts
```

### API Design: Hybrid Approach

**Server Actions for:**
- Form submissions (create/update/delete connectors)
- Inquiry management (assign, update status)
- Simple mutations

**Route Handlers for:**
- File uploads (streaming)
- Inquiry submission (public endpoint)
- Webhook endpoints
- CSV/Excel exports
- Download tracking

**Example: Public Inquiry Submission**
```typescript
// app/api/inquiries/route.ts
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 1. Validate input
    const validated = InquirySchema.parse(data)

    // 2. Calculate lead score
    const score = calculateLeadScore(validated)

    // 3. Insert inquiry
    const { data: inquiry, error } = await supabase
      .from('customer_inquiries')
      .insert({
        ...validated,
        lead_score: score,
        ip_address: request.ip,
        user_agent: request.headers.get('user-agent')
      })
      .select()
      .single()

    // 4. Auto-assign to sales rep
    const assignedRep = await autoAssignInquiry(inquiry)

    // 5. Send notifications
    await sendInquiryNotification(inquiry, assignedRep)
    await sendCustomerConfirmation(inquiry)

    // 6. Return success
    return NextResponse.json({
      success: true,
      inquiry_number: inquiry.inquiry_number,
      message: 'Thank you! We will respond within 24 hours.'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
```

---

## Success Metrics & KPIs

### Quantitative Metrics

**Efficiency Metrics:**
| Metric | Baseline | 3 Months | 6 Months | 12 Months |
|--------|----------|----------|----------|-----------|
| Time to add connector | N/A | 5 min | 3 min | 2 min |
| Bulk import time (100 items) | N/A | 10 min | 5 min | 3 min |
| **Inquiry response time** | Unknown | < 12 hr | < 4 hr | < 2 hr |

**Quality Metrics:**
| Metric | Target |
|--------|--------|
| Data error rate | < 2% |
| Translation completeness | > 95% |
| CAD file availability | > 80% |

**Lead Generation:**
| Metric | Target |
|--------|--------|
| Monthly inquiries | 50+ |
| Inquiry-to-quote conversion | > 60% |
| Quote-to-win conversion | > 30% |
| **Overall lead-to-customer** | > 18% |

---

## Implementation Phases

### Phase 1: MVP (8-10 weeks) - $40-60k

**Goal: Launch functional admin + inquiry system**

**Week 1-2: Foundation**
- Authentication system
- Admin layout
- RBAC implementation

**Week 3-4: Core CRUD**
- Connector management
- Form validation
- Media upload

**Week 5-6: Inquiry System** ⭐
- Inquiry form (public site)
- Inquiry management UI (admin)
- Auto-assignment logic
- Email notifications

**Week 7-8: Essential Features**
- Translation interface
- Series management
- Basic analytics

**Week 9-10: Launch**
- User testing
- Documentation
- Training

### Phase 2: Enhanced (6-8 weeks) - $30-40k

**Bulk operations**
**Smart validation**
**Advanced analytics**
**Lead scoring**
**CAD file management**

### Phase 3: World-Class (8-10 weeks) - $40-50k

**Public API**
**Parametric search**
**Customer portal**
**Mobile app**
**Email campaigns**

---

## Estimated Costs

**Development:**
- Phase 1: $40-60k
- Phase 2: $30-40k
- Phase 3: $40-50k
- **Total: $110-150k**

**Monthly Operations:** ~$90/month
- Supabase Pro: $25
- Vercel Pro: $20
- Sentry: $26
- Resend (emails): $20

**ROI:**
- Time saved: $3,250/month
- **Lead value: ~$5,000/month** (assuming 20 new customers/year @ $3k average)
- **Total value: $8,250/month = $99k/year**
- **Payback: 6-9 months**

---

## Appendix: Competitor Analysis (Based on Industry Knowledge)

### Molex & TE Connectivity - Key Features

**What They Do Well:**
- Comprehensive parametric search (20+ filters)
- Extensive CAD library (STEP, IGES, PCB footprints)
- Technical documentation (datasheets, application notes, white papers)
- Sample request system with account tracking
- Distributor locator
- Product comparison tools
- Mobile-friendly design

**What We Can Match (or Beat):**
- ✅ Parametric search (tailored to your products)
- ✅ CAD file downloads (STEP, IGES, DXF)
- ✅ Technical drawings and datasheets
- ✅ Multi-language support (6 languages vs. their 8-10)
- ✅ **Better inquiry tracking** (they route to general sales)
- ✅ **Faster time to quote** (smaller company = more agile)
- ✅ **More personal service** (your differentiator)

**What We Won't Match (Yet):**
- ❌ Tens of thousands of products (you have 1000 target)
- ❌ E-commerce/shopping cart (not your business model)
- ❌ Live inventory (not needed for B2B sales model)
- ❌ Distributor portal (Phase 3+ feature)

---

**END OF REVISED PRD**

This PRD is now focused on **catalog + lead generation** for a traditional B2B sales model. No e-commerce, no pricing, no inventory - just great product catalog and inquiry management.

Ready to start Phase 1?
