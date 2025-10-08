# RAST 5 Catalog System Brief for All Agents

## ⚠️ CRITICAL: What NOT to Break

This is a FULLY FUNCTIONAL production system with:

### 1. **Complete i18n System - DO NOT BREAK**
- **6 Languages**: English (en), Italian (it), Spanish (es), German (de), Russian (ru), Portuguese (pt)
- **360+ translation keys** across all pages
- Uses `next-intl` with getTranslations({ locale, namespace })
- All routes are `[locale]` dynamic segments: `/en/catalog`, `/it/catalog`, etc.
- **Translation files location**: `/messages/[lang].json`
- **Every new component MUST use translations** - NO hardcoded text

### 2. **Supabase Integration - DO NOT BREAK**
- Database: Live connector data from Supabase
- Tables: connectors, terminals, assembly_variants, mating_connectors
- Storage: 360° videos, terminal images, keying PDFs
- **Client**: `src/lib/supabase/client.ts`
- **ALL data fetching uses Supabase** - do not mock data

### 3. **Core Features - MUST PRESERVE**
- ✅ 360° interactive video players (video.js + videojs-vr)
- ✅ Advanced catalog filters (category, gender, poles, orientation, application)
- ✅ URL-based filter state management
- ✅ Connector detail pages with full specs
- ✅ Terminal component gallery with modal viewer
- ✅ Mating connectors carousel
- ✅ Assembly variants grid
- ✅ Keying documentation downloads
- ✅ Resources section (Terminal Guide, Installation Guide, Selection Wizard)
- ✅ Interactive 5-step connector selection wizard
- ✅ Language switcher in navbar

### 4. **Current Tech Stack**
- **Next.js**: 15.5.4 with App Router
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Tailwind CSS**: v4 (just upgraded)
- **UI Components**:
  - Radix UI (@radix-ui/react-*)
  - Custom shadcn/ui components
  - DO NOT replace these - extend them
- **Fonts**:
  - Inter (body text) - `font-inter`
  - Playfair Display (headings) - `font-playfair-display`
- **Animations**: Framer Motion (existing) + AOS (new for template)

## 📐 Template Design System to Apply

### Color Palette
```css
--color-slate-900: #101d2d  (dark backgrounds)
--color-blue-500: #5696ff   (accent)
--color-blue-600: #2174ea   (primary)
--color-white: #ffffff      (backgrounds)
--color-slate-800: (body text)
--color-slate-400: (muted text)
```

### Typography
- **Body**: Inter font, `text-slate-800`
- **Headings**: Playfair Display, `font-playfair-display`
- **Scale**: Custom Tailwind theme with optimized line-heights

### Component Patterns from Template
1. **Hero Sections**: Dark background (`bg-slate-900`) with clip-path
2. **Cards**: White with subtle shadow, hover effects
3. **Buttons**: Primary (`bg-blue-600`), Secondary (`bg-slate-700`)
4. **Spacing**: `max-w-6xl mx-auto px-4 sm:px-6`
5. **Sections**: Alternating white/gray backgrounds

## 🏗️ Current Architecture

### File Structure
```
src/
├── app/
│   ├── [locale]/              # i18n routes
│   │   ├── layout.tsx         # Locale layout with fonts
│   │   ├── page.tsx           # Homepage
│   │   ├── catalog/           # Connector catalog
│   │   ├── connectors/[id]/   # Detail pages
│   │   └── resources/         # Guides
│   ├── css/
│   │   ├── style.css          # Template CSS (NEW)
│   │   └── additional-styles/ # Template utilities
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Redirect to /en
├── components/
│   ├── Navbar.tsx             # Main navigation
│   ├── LanguageSwitcher.tsx   # Language dropdown
│   ├── CatalogFilters.tsx     # Filter sidebar
│   ├── ConnectorCard.tsx      # Catalog item
│   └── ui/                    # shadcn/ui components
├── lib/
│   └── supabase/              # Database client
└── messages/
    ├── en.json                # English translations
    ├── it.json                # Italian
    ├── es.json                # Spanish
    ├── de.json                # German
    ├── ru.json                # Russian
    └── pt.json                # Portuguese
```

### Key Components to Update (NOT replace)
1. **Navbar.tsx** - Apply template header styling
2. **HomePage** - Redesign with template hero/sections
3. **CatalogPage** - Apply template card grid
4. **ConnectorDetailPage** - Professional layout
5. **ResourcesPage** - Template card design

## 🎯 Redesign Requirements

### 1. Component Design Principles
- **Reusable**: Create shared components, not one-offs
- **Translatable**: All text via next-intl
- **Responsive**: Mobile-first design
- **Accessible**: Proper ARIA labels
- **Performant**: Lazy loading, optimized images

### 2. Must-Have Design Elements
- Dark hero sections with professional typography
- Clean white content areas
- Consistent card designs throughout
- Smooth hover/transition effects
- Professional color scheme (slate/blue)

### 3. Pages to Redesign
1. **Homepage** (`/[locale]/page.tsx`)
   - Hero with dark background
   - Feature blocks (360° views, compatibility, docs)
   - Category cards
   - Selection guide CTA

2. **Navbar** (`/components/Navbar.tsx`)
   - Template header styling
   - Keep language switcher
   - Dropdown for Resources

3. **Catalog Page** (`/[locale]/catalog/page.tsx`)
   - Template card grid
   - Keep ALL filters
   - Maintain Supabase integration

4. **Connector Details** (`/[locale]/connectors/[id]/page.tsx`)
   - Professional e-commerce layout
   - Keep 360° video
   - Keep all tabs and sections

5. **Resources Pages**
   - Apply template card design
   - Keep all functionality

## 🚫 What NOT to Do

1. ❌ DO NOT hardcode any text - use translations
2. ❌ DO NOT replace Supabase - extend it
3. ❌ DO NOT remove existing components - enhance them
4. ❌ DO NOT break i18n - test all 6 languages
5. ❌ DO NOT remove features - preserve everything
6. ❌ DO NOT create duplicate components - reuse existing
7. ❌ DO NOT ignore responsive design
8. ❌ DO NOT commit without local testing

## ✅ What TO Do

1. ✅ Use existing components as base
2. ✅ Add template styling on top
3. ✅ Create shared/reusable components
4. ✅ Use next-intl for ALL text
5. ✅ Test in all 6 languages
6. ✅ Maintain all Supabase queries
7. ✅ Keep all existing functionality
8. ✅ Apply template design patterns consistently
9. ✅ Use TypeScript properly
10. ✅ Test locally before any Git operations

## 📝 Example: Proper Translation Usage

```tsx
// ❌ WRONG - Hardcoded text
<h1>RAST 5 Connector Catalog</h1>

// ✅ CORRECT - Using translations
import { useTranslations } from 'next-intl';

function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}

// Server component version
import { getTranslations } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return <h1>{t('title')}</h1>;
}
```

## 📝 Example: Proper Component Enhancement

```tsx
// ❌ WRONG - Creating new component from scratch
export function NewConnectorCard() {
  return (
    <div className="card">
      <h3>Hardcoded Title</h3>
      {/* ... */}
    </div>
  );
}

// ✅ CORRECT - Enhancing existing component
import { ConnectorCard } from '@/components/ConnectorCard';

// Apply template styling to existing component
<ConnectorCard
  connector={connector}
  className="hover:shadow-lg transition-shadow" // Add template effects
/>

// Or extend the component
export function EnhancedConnectorCard({ connector }) {
  const t = useTranslations('CatalogPage');

  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow">
      {/* Use existing data structure */}
      <h3 className="font-playfair-display text-xl">{connector.model_number}</h3>
      <p className="text-slate-600">{t('poles', { count: connector.pole_count })}</p>
    </div>
  );
}
```

## 🔍 Testing Checklist

Before considering ANY task complete:

- [ ] All 6 languages load correctly
- [ ] All links work with locale prefix
- [ ] Supabase data displays
- [ ] Filters work properly
- [ ] 360° videos play
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] Local server runs without issues

## 📚 Key Files Reference

### Translation Example
`/messages/en.json` structure:
```json
{
  "HomePage": {
    "title": "RAST 5 Connector Catalog",
    "subtitle": "Professional catalog description..."
  },
  "CatalogPage": {
    "title": "Browse Connectors",
    "filters": { ... },
    "connector": { ... }
  }
}
```

### Supabase Query Example
```tsx
const { data: connectors } = await supabase
  .from('connectors')
  .select(`
    *,
    terminals (*)
  `)
  .order('model_number');
```

### Route Example
- Homepage: `/en`, `/it`, `/es`, etc.
- Catalog: `/en/catalog?category=X-For+socket+terminals`
- Detail: `/en/connectors/640456113`
- Resources: `/en/resources/terminals`

## 🎨 Design Implementation Order

1. **First**: Navbar (sets visual tone)
2. **Second**: Homepage (showcases design system)
3. **Third**: Catalog cards (most visible)
4. **Fourth**: Detail pages (complex layout)
5. **Last**: Resources (consistency check)

## 🔗 Important Context

- **Branch**: `redesign-professional-template`
- **Base**: `main` branch (fully functional)
- **Template Source**: `/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/tidy-next`
- **Template Analysis**: See `TEMPLATE_ANALYSIS.md`
- **Local Server**: http://localhost:3000
- **No commits until approved by user**

## 📞 Communication

If you encounter:
- Translation missing: Add to all 6 language files
- Component conflict: Extend, don't replace
- Feature unclear: Ask for clarification
- Breaking change: STOP and discuss

Remember: This is a working production system. Enhance, don't destroy.
