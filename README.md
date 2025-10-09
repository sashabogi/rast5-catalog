# RAST 5 Connector Catalog

Professional catalog website for RAST 5 electrical connectors with 360° interactive views, detailed specifications, and compatibility information.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📋 Project Status

### Public Site - Production Ready ✅
- ✅ Next.js 15 with TypeScript & App Router
- ✅ Internationalization (6 languages: en, it, es, de, ru, pt)
- ✅ Supabase database with full connector catalog
- ✅ 360° Video player with interactive controls
- ✅ Advanced filtering system (series, gender, pole count, termination, etc.)
- ✅ Connector detail pages with specifications & compatibility
- ✅ Resource pages (Installation Guide, Terminal Guide, Connector Selection Guide)
- ✅ Technical drawings download system
- ✅ Responsive design with Tailwind CSS + shadcn/ui

### Admin Backend - Production Ready ✅
- ✅ Role-Based Access Control (4 roles: super_admin, content_manager, translator, sales_viewer)
- ✅ User management system (create, edit, delete, restore users)
- ✅ Permission-based authorization with 21 granular permissions
- ✅ Audit logging system with partitioned tables
- ✅ Protected routes with multi-locale middleware
- ✅ Secure authentication with Supabase Auth
- ✅ Admin dashboard with stats cards
- ✅ Comprehensive documentation and testing

**Status:** ✅ Both public site and admin backend are production-ready and deployed

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI**: shadcn/ui + Radix UI components
- **i18n**: next-intl (6 languages)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with RBAC
- **Video**: Video.js with VR plugin
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

## 🗄️ Database Setup Required

See `../QUICK-START.md` for complete setup instructions:

1. Create Supabase project
2. Create 3 storage buckets (connector-videos, terminal-images, keying-pdfs)
3. Run database schema SQL
4. Update `.env.local` with credentials

## 🎯 Next Steps

1. **Configure Supabase** - Create project and run schema
2. **Run Data Migration** - Populate database from RAST 5 folder
3. **Build Catalog Page** - Display connectors with filtering
4. **Build Detail Pages** - Individual connector pages
5. **Deploy to Vercel** - Production deployment

## 📁 Key Files

- `/src/app/page.tsx` - Home page
- `/src/app/catalog/page.tsx` - Catalog listing
- `/src/components/Video360Player.tsx` - 360° video player
- `/src/lib/supabase/client.ts` - Database client
- `/src/types/database.ts` - TypeScript types

## 📚 Documentation

### Public Site Documentation
- `I18N_COMPLETE_DOCUMENTATION.md` - Internationalization system (6 languages)
- `FILTER_SYSTEM.md` - Advanced catalog filtering
- `CONNECTOR_GUIDE.md` - Connector selection guide implementation
- `INSTALLATION_PAGE_MIGRATION_SUMMARY.md` - Installation guide details
- `TERMINALS_MIGRATION_REPORT.md` - Terminal guide implementation

### Admin Backend Documentation
- `ADMIN_BACKEND_PRD_REVISED.md` - Product Requirements Document
- `ADMIN_QUICK_START.md` - Admin setup and usage guide
- `USER_MANAGEMENT_DOCUMENTATION.md` - User management features
- `MIDDLEWARE_DOCUMENTATION.md` - Route protection and authorization
- `RBAC_COMPONENTS_SUMMARY.md` - Permission system overview
- `PROGRESS.md` - Complete implementation progress (10 phases)

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

The easiest way to deploy is using [Vercel](https://vercel.com/new).
