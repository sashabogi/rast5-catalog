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

**Phase 1: Foundation Complete** ✅
- ✅ Next.js 14 project with TypeScript
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Supabase client configuration
- ✅ 360° Video player component
- ✅ Base layout and navigation
- ✅ Home, catalog, and resources pages

**Next: Database Setup & Data Migration** 🚧

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Video**: Video.js with VR plugin
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

See project root for detailed documentation:
- `PROJECT-PLAN.md` - Complete technical plan
- `QUICK-START.md` - Step-by-step setup
- `360-VIDEO-IMPLEMENTATION.md` - Video details
- `KEY-CLARIFICATIONS.md` - Important decisions

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

The easiest way to deploy is using [Vercel](https://vercel.com/new).
