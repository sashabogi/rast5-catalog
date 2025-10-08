# RAST 5 Catalog - Component Architecture & Design Specification

## Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Component Architecture](#component-architecture)
3. [Page-by-Page Design Plans](#page-by-page-design-plans)
4. [Styling Guide](#styling-guide)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Developer Guidelines](#developer-guidelines)

---

## Design System Overview

### Design Philosophy
Transform the RAST 5 catalog from functional to **professional, industrial-grade** using the tidy-next template's design patterns while preserving all existing functionality and the complete i18n system.

### Core Principles
1. **Enhancement, Not Replacement**: Build upon existing components, never replace them
2. **Translation-First**: Every text element uses next-intl translations
3. **Professional Industrial Aesthetic**: Clean, technical, trustworthy design
4. **Feature Preservation**: Maintain all 360° videos, filters, Supabase integration
5. **Mobile-First Responsive**: Every component works across all screen sizes

### Visual Identity

#### Typography Hierarchy
```
Display (Playfair Display - Serif):
- Hero Titles: text-5xl md:text-6xl lg:text-7xl, font-playfair-display, font-bold
- Section Titles: text-3xl md:text-4xl, font-playfair-display, font-bold
- Card Titles: text-xl md:text-2xl, font-playfair-display, font-semibold

Body (Inter - Sans-serif):
- Large Body: text-lg md:text-xl, font-inter, leading-relaxed
- Standard Body: text-base, font-inter, leading-normal
- Small Body: text-sm, font-inter, leading-normal
- Captions: text-xs, font-inter, uppercase, tracking-wide
```

#### Color System
```css
/* Primary Palette */
--slate-900: #101d2d    /* Dark backgrounds, hero sections */
--slate-800: #1e293b    /* Body text */
--slate-700: #334155    /* Secondary buttons */
--slate-600: #475569    /* Muted text */
--slate-400: #94a3b8    /* Disabled text */
--slate-100: #f1f5f9    /* Light backgrounds */
--slate-50: #f8fafc     /* Subtle backgrounds */

/* Accent Colors */
--blue-600: #2174ea     /* Primary actions, links */
--blue-500: #5696ff     /* Hover states, accents */
--blue-50: #eff6ff      /* Light blue backgrounds */

/* Semantic Colors */
--green-600: #16a34a    /* Success, in-stock */
--green-50: #f0fdf4     /* Success backgrounds */
--orange-600: #ea580c   /* Male connectors */
--orange-50: #fff7ed    /* Warning backgrounds */
--red-600: #dc2626      /* Special versions, errors */
--amber-600: #d97706    /* Warnings */
--amber-50: #fffbeb     /* Warning backgrounds */

/* Gender-Specific (preserve existing) */
Female connectors: blue-500
Male connectors: orange-500
PCB Headers: green-500
```

#### Spacing Scale
```
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Section Vertical: py-12 md:py-20 lg:py-24
Section Gap: space-y-12 md:space-y-16 lg:space-y-20
Card Padding: p-4 md:p-6 lg:p-8
Element Gap: gap-4 md:gap-6 lg:gap-8
```

#### Shadow & Elevation
```
Card Default: shadow-sm
Card Hover: shadow-lg
Card Active: shadow-xl
Modal/Dialog: shadow-2xl
Navbar: shadow-md with backdrop-blur
```

#### Border Radius
```
Small elements (badges): rounded-md (6px)
Cards: rounded-xl (12px)
Large cards/images: rounded-2xl (16px)
Buttons: rounded-lg (8px)
```

---

## Component Architecture

### Component Hierarchy Diagram

```
App Root
├── Layouts
│   ├── RootLayout (app/layout.tsx)
│   │   └── LocaleLayout (app/[locale]/layout.tsx)
│   │       ├── Navbar (shared)
│   │       └── Page Content
│   │
│   └── Shared Components (used across pages)
│       ├── Navbar
│       ├── Footer (NEW)
│       ├── LanguageSwitcher (existing)
│       └── PageHero (NEW - reusable hero pattern)
│
├── Homepage Components
│   ├── HeroSection (REDESIGN)
│   ├── FeaturesSection (REDESIGN)
│   ├── CategoryCards (ENHANCE)
│   ├── CTASection (NEW - selection guide)
│   └── StatsSection (NEW OPTIONAL)
│
├── Catalog Components
│   ├── CatalogFilters (ENHANCE)
│   ├── CatalogContent (existing - enhance styling)
│   ├── ConnectorCard (ENHANCE)
│   ├── FilterBar (ENHANCE)
│   └── EmptyState (NEW)
│
├── Connector Detail Components
│   ├── ConnectorHero (REDESIGN)
│   ├── Video360Player (preserve)
│   ├── SpecsTable (ENHANCE)
│   ├── QuickSpecs (ENHANCE)
│   ├── ProductTabs (ENHANCE)
│   ├── TerminalGallery (preserve)
│   ├── MatingConnectorCarousel (ENHANCE)
│   └── AssemblyVariantsGrid (ENHANCE)
│
├── Resources Components
│   ├── ResourcesHub (REDESIGN)
│   ├── ResourceCard (NEW)
│   ├── SelectionWizard (preserve functionality)
│   └── DocumentationDownload (NEW)
│
└── UI Components (existing shadcn/ui - enhance styling)
    ├── Button (add template variants)
    ├── Card (add template styling)
    ├── Badge (preserve gender colors)
    ├── Tabs (enhance)
    ├── Dialog (enhance)
    ├── Input (enhance)
    ├── Checkbox (enhance)
    └── [all other Radix components]
```

### New Shared Components to Create

#### 1. PageHero Component
**Purpose**: Reusable dark hero section pattern from template
**Props**:
```typescript
interface PageHeroProps {
  title: string | ReactNode
  description?: string
  actions?: ReactNode
  image?: string
  video?: string
  variant?: 'dark' | 'light' | 'gradient'
  size?: 'small' | 'medium' | 'large'
}
```

**Design Pattern**:
- Dark slate-900 background with clip-path polygon (template style)
- Centered on mobile, two-column on desktop
- Left: Title + Description + Actions
- Right: Image/Video (optional)
- AOS fade-in animations

**Usage**: Homepage hero, catalog header, resource pages

---

#### 2. Footer Component
**Purpose**: Professional footer with company info and navigation
**Sections**:
- Company logo and tagline
- Quick links (Catalog, Resources, etc.)
- Language selector
- Copyright notice

**Design**:
- Dark background (slate-900)
- White/slate-400 text
- 4-column grid on desktop, stacked on mobile

---

#### 3. SectionContainer Component
**Purpose**: Consistent section wrapper with proper spacing
**Props**:
```typescript
interface SectionContainerProps {
  children: ReactNode
  background?: 'white' | 'slate' | 'blue'
  spacing?: 'small' | 'medium' | 'large'
  containerWidth?: 'default' | 'narrow' | 'wide'
}
```

**Design**:
- max-w-7xl container by default
- Proper padding (py-12 md:py-20 lg:py-24)
- Background variants for alternating sections

---

#### 4. FeatureBlock Component
**Purpose**: Reusable feature highlight with icon
**Props**:
```typescript
interface FeatureBlockProps {
  icon: ReactNode
  title: string
  description: string
  variant?: 'vertical' | 'horizontal'
  accentColor?: string
}
```

**Design**:
- Icon with colored background circle
- Bold title (font-playfair-display)
- Gray description text
- Hover effect with subtle lift

---

#### 5. EmptyState Component
**Purpose**: Consistent empty/error states
**Props**:
```typescript
interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  variant?: 'info' | 'warning' | 'error'
}
```

---

### Component Enhancement Specifications

#### Navbar (ENHANCE EXISTING)

**Current State**: Basic white navbar with links and language switcher
**Enhancement Plan**:

1. **Visual Improvements**:
   ```tsx
   Background: bg-white/95 backdrop-blur-md (glassmorphism)
   Shadow: shadow-md (subtle depth)
   Border: border-b border-slate-200
   Height: h-20 (larger, more presence)
   ```

2. **Logo Area**:
   ```tsx
   - Larger brand name (text-2xl font-playfair-display font-bold)
   - Add tagline below on desktop (text-sm text-slate-600)
   - Cable icon stays blue-600
   ```

3. **Navigation Links**:
   ```tsx
   Desktop:
   - Larger font (text-base instead of text-sm)
   - Hover underline animation (border-b-2 border-blue-600)
   - Active state: font-semibold + blue-600

   Resources: Convert to dropdown menu
   - Terminal Guide
   - Installation Guide
   - Selection Wizard
   - Documentation
   ```

4. **Mobile Menu**:
   - Full-screen overlay with dark background
   - Large navigation items (text-2xl)
   - Smooth slide-in animation
   - Close button (X) in top-right

5. **Sticky Behavior**:
   ```tsx
   - sticky top-0 z-50
   - On scroll: Add shadow-lg + reduce height slightly
   - Background opacity transition
   ```

**Files to Modify**:
- `/src/components/Navbar.tsx`

**i18n Keys to Add**:
```json
"Navbar": {
  "brandName": "RAST 5 Catalog",
  "tagline": "Professional Connector Solutions",
  "browseCatalog": "Browse Catalog",
  "resources": "Resources",
  "resourcesDropdown": {
    "terminals": "Terminal Guide",
    "installation": "Installation Guide",
    "wizard": "Selection Wizard",
    "documentation": "Documentation"
  }
}
```

---

#### ConnectorCard (ENHANCE EXISTING)

**Current State**: Good foundation with 360° video on hover
**Enhancement Plan**:

1. **Card Structure**:
   ```tsx
   Container:
   - rounded-2xl (larger radius for modern look)
   - border border-slate-200 (visible border)
   - bg-white shadow-sm
   - hover:shadow-xl hover:border-blue-600 (accent on hover)
   - transition-all duration-300 (smooth)

   Aspect Ratio: aspect-video (preserve)
   Video Background: bg-gradient-to-br from-slate-900 to-slate-700
   ```

2. **Content Section**:
   ```tsx
   Padding: p-6 (more breathing room)

   Title:
   - text-xl font-playfair-display font-semibold
   - text-slate-900
   - group-hover:text-blue-600 transition

   Description:
   - text-base text-slate-600 (larger than current)
   - mb-4 (more space)

   Badges:
   - Larger (px-3 py-1.5)
   - Keep gender colors
   - Add subtle shadow
   ```

3. **Hover Effects**:
   ```tsx
   - Card lifts: transform scale-105
   - Shadow increases: shadow-sm → shadow-xl
   - Border color: slate-200 → blue-600
   - Video starts playing (preserve existing)
   ```

4. **Loading State**:
   ```tsx
   - Skeleton with gradient animation
   - Pulse effect on placeholder
   ```

**Files to Modify**:
- `/src/components/ConnectorCard.tsx`

**No new translations needed** (uses existing connector data)

---

#### CatalogFilters (ENHANCE EXISTING)

**Current State**: Functional sticky filter bar
**Enhancement Plan**:

1. **Container**:
   ```tsx
   Background: bg-white/95 backdrop-blur-md
   Border: border-b border-slate-200
   Shadow: shadow-md (when scrolled)
   Padding: py-6 (more vertical space)
   ```

2. **Search Bar**:
   ```tsx
   Input:
   - h-12 (taller)
   - rounded-xl (more rounded)
   - border-2 focus:border-blue-600
   - text-base (larger text)
   - Placeholder in slate-500

   Icon:
   - Larger search icon (h-5 w-5)
   - Clear button with hover effect
   ```

3. **Filter Groups**:
   ```tsx
   Labels:
   - text-sm font-semibold uppercase tracking-wide
   - text-slate-700
   - mb-3

   Desktop Layout:
   - Horizontal scroll if needed
   - Gap-8 between groups

   Mobile:
   - Collapsible accordion
   - Smooth height transition
   - Filter count badge on collapsed state
   ```

4. **Filter Buttons/Checkboxes**:
   ```tsx
   Active:
   - bg-blue-600 text-white
   - shadow-md

   Inactive:
   - bg-white border-2 border-slate-300
   - hover:border-blue-600 hover:bg-blue-50

   Transition: all duration-200
   ```

5. **Active Filters Display**:
   ```tsx
   - Horizontal chips below filters
   - Each chip: bg-blue-100 text-blue-700 rounded-full
   - X button to remove individual filter
   - "Clear All" button in red/destructive color
   ```

**Files to Modify**:
- `/src/components/CatalogFilters.tsx`

**i18n Updates**: Ensure all filter labels use translations

---

#### CatalogContent (ENHANCE EXISTING)

**Current State**: Grid layout with connector cards
**Enhancement Plan**:

1. **Grid**:
   ```tsx
   Layout: grid gap-6 md:gap-8
   Columns:
   - Mobile: grid-cols-1
   - Tablet: md:grid-cols-2
   - Desktop: lg:grid-cols-3
   - Wide: xl:grid-cols-4 (for large screens)
   ```

2. **Results Header**:
   ```tsx
   Before Grid:
   - "Showing X connectors" text
   - Sort dropdown (optional enhancement)
   - View toggle: Grid/List (future)

   Styling:
   - flex justify-between items-center
   - mb-8
   - text-slate-600
   ```

3. **Empty State**:
   ```tsx
   Use EmptyState component:
   - Large search icon
   - "No connectors found" title
   - "Try adjusting filters" description
   - "Reset Filters" button
   ```

4. **Loading State**:
   ```tsx
   Skeleton Grid:
   - Same grid layout
   - 6-9 skeleton cards
   - Pulse animation
   - Gradient shimmer effect
   ```

**Files to Modify**:
- `/src/components/CatalogContent.tsx`

---

## Page-by-Page Design Plans

### 1. Homepage (`/[locale]/page.tsx`)

**Current State**: Basic sections with gradient backgrounds
**Redesign Goals**: Professional landing page that showcases catalog value

#### Layout Structure

```
┌─────────────────────────────────────┐
│         NAVBAR                      │
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │
│   (Dark background, clip-path)      │
│   - Large title                     │
│   - Description                     │
│   - CTA buttons                     │
│   - Hero image/video (optional)     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    FEATURES SECTION (White BG)      │
│   - 3 feature blocks in grid        │
│   - Icons, titles, descriptions     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  CATEGORY CARDS (Light Gray BG)     │
│   - 3 category cards in grid        │
│   - Clickable, filter links         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   STATS SECTION (Optional)          │
│   - Connector count, categories     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    SELECTION GUIDE CTA (Dark BG)    │
│   - Call to action for wizard       │
│   - Large button                    │
│                                     │
├─────────────────────────────────────┤
│         FOOTER                      │
└─────────────────────────────────────┘
```

#### Hero Section Design

**Layout**:
```tsx
<section className="relative bg-slate-900 overflow-hidden">
  {/* Clip-path polygon background */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"
       style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }} />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: Content */}
      <div className="text-white" data-aos="fade-right">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair-display font-bold mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="primary">
            {/* Browse Catalog */}
          </Button>
          <Button size="lg" variant="secondary">
            {/* Resources */}
          </Button>
        </div>
      </div>

      {/* Right: Image/Visual (optional) */}
      <div className="hidden lg:block" data-aos="fade-left">
        {/* Featured connector image or abstract visual */}
      </div>
    </div>
  </div>
</section>
```

**Features**:
- AOS animations: fade-right on content, fade-left on image
- Dark gradient background (slate-900 to blue-900)
- Clip-path polygon for modern shape
- Responsive text sizing
- Two-column layout on desktop

**i18n Keys**:
```json
"HomePage": {
  "hero": {
    "title": "RAST 5 Connector Catalog",
    "description": "Professional catalog of RAST 5 electrical connectors...",
    "browseCatalog": "Browse Catalog",
    "resources": "View Resources"
  }
}
```

---

#### Features Section Design

**Layout**:
```tsx
<section className="py-20 md:py-28 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16" data-aos="fade-up">
      <h2 className="text-4xl md:text-5xl font-playfair-display font-bold text-slate-900 mb-4">
        {t('features.title')}
      </h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        {t('features.subtitle')}
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      {/* Feature 1: 360° Views */}
      <div className="text-center" data-aos="fade-up" data-aos-delay="100">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
          <Play className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-playfair-display font-semibold mb-3">
          {t('features.view360.title')}
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {t('features.view360.description')}
        </p>
      </div>

      {/* Feature 2: Compatibility */}
      {/* Feature 3: Documentation */}
    </div>
  </div>
</section>
```

**Features**:
- Centered title with subtitle
- 3-column grid on desktop
- Icon circles with brand colors
- Staggered AOS animations (100ms, 200ms, 300ms delay)
- Playfair Display for feature titles

---

#### Category Cards Section Design

**Layout**:
```tsx
<section className="py-20 md:py-28 bg-slate-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16" data-aos="fade-up">
      <h2 className="text-4xl md:text-5xl font-playfair-display font-bold text-slate-900 mb-4">
        {t('categories.title')}
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Socket Category */}
      <Link href={`/${locale}/catalog?category=X-For+socket+terminals`}>
        <Card className="h-full hover:shadow-xl hover:border-blue-600 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Cable className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-playfair-display font-semibold group-hover:text-blue-600 transition">
                {t('categories.socket.title')}
              </h3>
            </div>
            <p className="text-slate-600 mb-4">
              {t('categories.socket.description')}
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              {t('categories.browse')}
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Tab Category */}
      {/* PCB Category */}
    </div>
  </div>
</section>
```

**Features**:
- Cards with colored icon circles
- Hover effects: shadow, border, icon movement
- Links to filtered catalog
- Responsive grid

---

#### Selection Guide CTA Section Design

**Layout**:
```tsx
<section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
  {/* Background pattern (optional) */}
  <div className="absolute inset-0 opacity-10">
    {/* Grid pattern or abstract shapes */}
  </div>

  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div data-aos="zoom-in">
      <Lightbulb className="h-16 w-16 text-blue-200 mx-auto mb-6" />
      <h2 className="text-4xl md:text-5xl font-playfair-display font-bold text-white mb-6">
        {t('selectionGuide.title')}
      </h2>
      <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
        {t('selectionGuide.description')}
      </p>
      <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
        <Compass className="mr-2 h-6 w-6" />
        {t('selectionGuide.launchGuide')}
      </Button>
    </div>
  </div>
</section>
```

**Features**:
- Gradient blue background
- Centered content
- Large call-to-action button
- Zoom-in animation on scroll

---

### 2. Catalog Page (`/[locale]/catalog/page.tsx`)

**Current State**: Filter bar + grid of cards
**Redesign Goals**: E-commerce quality browsing experience

#### Layout Structure

```
┌─────────────────────────────────────┐
│         NAVBAR                      │
├─────────────────────────────────────┤
│                                     │
│      PAGE HEADER (White BG)         │
│   - Title                           │
│   - Description                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     FILTER BAR (Sticky)             │
│   - Search                          │
│   - Category, Poles, etc.           │
│   - Active filters chips            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      RESULTS HEADER                 │
│   - Count / Sort / View toggle      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      CONNECTOR GRID                 │
│   - 3-4 columns responsive          │
│   - Enhanced cards                  │
│                                     │
├─────────────────────────────────────┤
│         FOOTER                      │
└─────────────────────────────────────┘
```

#### Page Header Design

**Layout**:
```tsx
<div className="bg-white border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-slate-900 mb-4">
      {t('title')}
    </h1>
    <p className="text-xl text-slate-600 max-w-3xl">
      {t('description')}
    </p>
  </div>
</div>
```

**Features**:
- Clean white background
- Large title
- Subtle bottom border
- Constrained description width

#### Enhanced Filter Bar (See Component Enhancement above)

#### Results Header Design

**Layout**:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <p className="text-slate-600">
      {t('results.showing', { count: filteredCount })}
    </p>

    <div className="flex gap-3">
      {/* Sort Dropdown (optional) */}
      <Select>
        <SelectTrigger className="w-48">
          <span>{t('sort.label')}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="model">{t('sort.model')}</SelectItem>
          <SelectItem value="poles">{t('sort.poles')}</SelectItem>
        </SelectContent>
      </Select>

      {/* View Toggle (future) */}
    </div>
  </div>
</div>
```

#### Grid Layout Design

**Layout**:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
    {connectors.map((connector, index) => (
      <div key={connector.id} data-aos="fade-up" data-aos-delay={index * 50}>
        <ConnectorCard connector={connector} />
      </div>
    ))}
  </div>
</div>
```

**Features**:
- Responsive column count
- Staggered fade-up animations
- Consistent gap spacing

---

### 3. Connector Detail Page (`/[locale]/connector/[id]/page.tsx`)

**Current State**: Good structure, needs visual polish
**Redesign Goals**: Professional product page like high-end e-commerce

#### Layout Structure

```
┌─────────────────────────────────────┐
│         NAVBAR                      │
├─────────────────────────────────────┤
│      BREADCRUMBS (White BG)         │
├─────────────────────────────────────┤
│                                     │
│      PRODUCT HERO (2 columns)       │
│   Left: 360° Video                  │
│   Right: Title, Specs, Status       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      QUICK SPECS (4 columns)        │
│   - Poles, Type, Orientation, etc.  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│          TABBED CONTENT             │
│   - Overview                        │
│   - Compatibility                   │
│   - Documentation                   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      ACTION BUTTONS                 │
│   - Add to Project (disabled)       │
│   - Request Quote (disabled)        │
│                                     │
├─────────────────────────────────────┤
│         FOOTER                      │
└─────────────────────────────────────┘
```

#### Breadcrumbs Design

**Layout**:
```tsx
<div className="bg-slate-50 border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <nav className="flex items-center space-x-2 text-sm">
      <Link href={`/${locale}`} className="text-slate-600 hover:text-blue-600 transition">
        {t('breadcrumbs.home')}
      </Link>
      <ChevronRight className="h-4 w-4 text-slate-400" />
      <Link href={`/${locale}/catalog`} className="text-slate-600 hover:text-blue-600 transition">
        {t('breadcrumbs.catalog')}
      </Link>
      <ChevronRight className="h-4 w-4 text-slate-400" />
      <span className="text-slate-900 font-medium">{connector.model}</span>
    </nav>
  </div>
</div>
```

#### Product Hero Design

**Layout**:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="grid lg:grid-cols-2 gap-12 items-start">
    {/* Left: Video */}
    <div className="sticky top-24" data-aos="fade-right">
      <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="aspect-square">
          <Video360Player
            videoUrl={connector.video_360_url}
            showControls={true}
          />
        </div>
      </div>

      {/* Badges below video */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <Badge size="lg" className={genderColor}>
          {connector.gender}
        </Badge>
        {/* Other badges */}
      </div>
    </div>

    {/* Right: Info */}
    <div className="space-y-6" data-aos="fade-left">
      {/* Title */}
      <div>
        <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-slate-900 mb-3">
          {connector.model}
        </h1>
        <p className="text-xl text-slate-600">
          {connector.display_name}
        </p>

        {/* Special Notes Alert */}
        {connector.special_notes && (
          <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">{connector.special_notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Specs Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-xl font-playfair-display">
            {t('specs.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody className="divide-y divide-slate-200">
              {/* Spec rows with hover effect */}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card className="border-green-200 bg-green-50 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-lg font-semibold text-green-900">
                {t('status.inStock')}
              </span>
            </div>
            <span className="text-sm text-green-700">
              {t('status.contactForAvailability')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

**Features**:
- Sticky video on left (stays in view on scroll)
- Two-column responsive layout
- Large, bold title
- Alert for special notes
- Enhanced card styling for specs
- Green status card

#### Quick Specs Row Design

**Layout**:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {quickSpecs.map((spec, index) => (
      <Card
        key={index}
        className="border-2 hover:border-blue-600 transition-colors"
        data-aos="fade-up"
        data-aos-delay={index * 100}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
              {spec.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                {spec.label}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {spec.value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

**Features**:
- 4-column grid on desktop
- Icon + label + value layout
- Hover border effect
- Staggered animations

#### Tabbed Content Design

**Enhancement**: Keep existing tab structure, enhance visual design

**Tab List**:
```tsx
<TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-14 bg-slate-100 p-1 rounded-xl">
  <TabsTrigger
    value="overview"
    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold transition-all"
  >
    {t('tabs.overview')}
  </TabsTrigger>
  {/* Other tabs */}
</TabsList>
```

**Tab Content**:
- Keep existing content structure
- Add more spacing (space-y-8)
- Enhance card shadows
- Add AOS animations to content

#### Mating Connectors Carousel

**Enhancement**:
```tsx
<div className="relative">
  <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
    {matingConnectors.map((mate) => (
      <Card className="min-w-[320px] snap-start hover:shadow-2xl transition-all group">
        <CardContent className="p-0">
          <Link href={`/${locale}/connector/${mate.id}`}>
            <div className="aspect-square bg-slate-900 relative overflow-hidden rounded-t-xl">
              <video src={mate.video_360_url} autoPlay muted loop />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-lg">
                    {t('compatibility.viewDetails')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-playfair-display font-bold text-slate-900 group-hover:text-blue-600 transition">
                {mate.model}
              </h3>
              <p className="text-slate-600 mt-2">{mate.display_name}</p>

              {/* Badges */}
            </div>
          </Link>
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Scroll indicators (optional) */}
</div>
```

**Features**:
- Horizontal scroll with snap points
- Larger cards (320px min-width)
- Hover overlay with gradient
- Title color change on hover

---

### 4. Resources Pages (`/[locale]/resources/*`)

**Current State**: Basic card layouts
**Redesign Goals**: Hub for guides and tools

#### Resources Hub Page Design

**Layout**:
```
┌─────────────────────────────────────┐
│         NAVBAR                      │
├─────────────────────────────────────┤
│                                     │
│      PAGE HERO (Dark BG)            │
│   - "Resources & Guides"            │
│   - Description                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    RESOURCE CARD GRID               │
│   - Terminal Guide                  │
│   - Installation Guide              │
│   - Selection Wizard                │
│   - Documentation Library           │
│                                     │
├─────────────────────────────────────┤
│         FOOTER                      │
└─────────────────────────────────────┘
```

#### Resource Card Design

**New Component**: `ResourceCard.tsx`

```tsx
<Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-blue-600">
  <CardContent className="p-8">
    {/* Icon */}
    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
      <Book className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
    </div>

    {/* Title */}
    <h3 className="text-2xl font-playfair-display font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
      {title}
    </h3>

    {/* Description */}
    <p className="text-slate-600 mb-6 leading-relaxed">
      {description}
    </p>

    {/* Link */}
    <div className="flex items-center text-blue-600 font-semibold">
      {t('learnMore')}
      <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-2 transition-transform" />
    </div>
  </CardContent>
</Card>
```

**Features**:
- Lift on hover (-translate-y-2)
- Icon background color change
- Title color change
- Arrow slide animation
- Large, comfortable padding

---

## Styling Guide

### Button Variants

**Primary Button**:
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
```

**Secondary Button**:
```tsx
className="bg-white hover:bg-slate-50 text-blue-600 font-semibold border-2 border-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
```

**Outline Button**:
```tsx
className="bg-transparent hover:bg-slate-100 text-slate-700 font-semibold border-2 border-slate-300 hover:border-slate-400 rounded-lg transition-all duration-200"
```

**Destructive Button**:
```tsx
className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
```

### Card Variants

**Default Card**:
```tsx
className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
```

**Featured Card**:
```tsx
className="bg-white border-2 border-blue-600 rounded-xl shadow-lg"
```

**Interactive Card** (clickable):
```tsx
className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
```

**Status Card** (success):
```tsx
className="bg-green-50 border-2 border-green-200 rounded-xl shadow-md"
```

**Status Card** (warning):
```tsx
className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg shadow-md"
```

### Badge Variants

**Gender Badges** (preserve existing):
```tsx
Female: "bg-blue-500 text-white px-3 py-1 rounded-md font-medium shadow-sm"
Male: "bg-orange-500 text-white px-3 py-1 rounded-md font-medium shadow-sm"
PCB: "bg-green-500 text-white px-3 py-1 rounded-md font-medium shadow-sm"
```

**Info Badge**:
```tsx
className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-medium"
```

**Special Version Badge**:
```tsx
className="bg-red-600 text-white px-3 py-1 rounded-md font-semibold shadow-md"
```

### Input/Form Elements

**Text Input**:
```tsx
className="w-full h-12 px-4 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
```

**Checkbox** (custom):
```tsx
className="w-5 h-5 border-2 border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
```

**Select/Dropdown**:
```tsx
className="w-full h-12 px-4 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base appearance-none"
```

### Animation Utilities

**AOS Configuration** (in layout):
```tsx
AOS.init({
  duration: 600,
  easing: 'ease-out-sine',
  once: true,
  offset: 100,
  disable: 'phone'
});
```

**Common AOS Attributes**:
```tsx
data-aos="fade-up"           // Elements entering from bottom
data-aos="fade-right"        // Content from left
data-aos="fade-left"         // Images from right
data-aos="zoom-in"           // CTAs, important elements
data-aos-delay="100"         // Stagger animations (100, 200, 300)
```

**CSS Transitions**:
```tsx
// Smooth all properties
className="transition-all duration-300 ease-out"

// Specific properties
className="transition-colors duration-200"
className="transition-shadow duration-300"
className="transition-transform duration-300"
```

### Responsive Utilities

**Container Widths**:
```tsx
Default: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Narrow: max-w-4xl mx-auto px-4 sm:px-6 lg:px-8
Wide: max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8
```

**Grid Patterns**:
```tsx
// 2-column
className="grid md:grid-cols-2 gap-8"

// 3-column
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"

// 4-column
className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

// Feature grid
className="grid md:grid-cols-3 gap-8 lg:gap-12"
```

**Spacing Scale**:
```tsx
// Sections
py-12 md:py-20 lg:py-24

// Card content
p-6 md:p-8 lg:p-10

// Element gaps
gap-4 md:gap-6 lg:gap-8
space-y-6 md:space-y-8
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Set up design system and shared components

1. **Install Dependencies**
   - Upgrade Tailwind CSS to v4
   - Install AOS library
   - Install @headlessui/react
   - Configure Google Fonts (Inter, Playfair Display)

2. **Create Shared Components**
   - PageHero component
   - Footer component
   - SectionContainer component
   - FeatureBlock component
   - EmptyState component
   - ResourceCard component

3. **Update Tailwind Config**
   - Add custom color variables
   - Configure typography scale
   - Add custom spacing
   - Set up AOS integration

4. **Setup AOS**
   - Initialize in root layout
   - Test animations

**Deliverables**:
- All shared components created and tested
- Design system fully configured
- Documentation for new components

---

### Phase 2: Navigation & Header (Week 1)
**Goal**: Professional navigation that sets visual tone

1. **Navbar Enhancement**
   - Apply glassmorphism effect
   - Larger logo and branding
   - Resources dropdown menu
   - Mobile menu redesign
   - Sticky scroll behavior

2. **Footer Creation**
   - Company info section
   - Navigation links
   - Language selector
   - Copyright

3. **Translation Updates**
   - Add navbar translations
   - Add footer translations
   - Test all 6 languages

**Deliverables**:
- Enhanced Navbar component
- New Footer component
- All translations updated
- Responsive on all devices

---

### Phase 3: Homepage Redesign (Week 2)
**Goal**: Stunning landing page that showcases catalog

1. **Hero Section**
   - Dark background with clip-path
   - Large typography
   - CTA buttons
   - AOS animations

2. **Features Section**
   - 3-column grid
   - Icon circles
   - Staggered animations

3. **Category Cards**
   - Enhanced card styling
   - Hover effects
   - Filter links

4. **Selection Guide CTA**
   - Gradient background
   - Large button
   - Compelling copy

5. **Testing**
   - All 6 languages
   - Responsive layouts
   - Animations work

**Deliverables**:
- Fully redesigned homepage
- AOS animations implemented
- All sections responsive
- Translation-complete

---

### Phase 4: Catalog Page Enhancement (Week 2)
**Goal**: Professional browsing experience

1. **Filter Bar Enhancement**
   - Visual polish
   - Better mobile UX
   - Active filter chips
   - Clear all functionality

2. **Connector Card Enhancement**
   - Larger radius
   - Better hover effects
   - Enhanced badges
   - Smooth transitions

3. **Grid Layout**
   - Results header
   - Responsive columns
   - Loading states
   - Empty states

4. **Testing**
   - Filter functionality preserved
   - Video playback works
   - Supabase integration intact

**Deliverables**:
- Enhanced catalog experience
- All filters working
- Professional card designs
- Mobile-optimized

---

### Phase 5: Connector Detail Page (Week 3)
**Goal**: E-commerce quality product pages

1. **Breadcrumbs**
   - Clean styling
   - Proper links

2. **Product Hero**
   - Two-column layout
   - Sticky video
   - Enhanced specs table
   - Status card

3. **Quick Specs**
   - 4-column grid
   - Icon + label + value
   - Hover effects

4. **Tab Content**
   - Enhanced tab styling
   - Better content spacing
   - AOS animations

5. **Mating Connectors**
   - Larger carousel cards
   - Hover overlays
   - Smooth scrolling

6. **Testing**
   - 360° video works
   - All tabs functional
   - Terminal gallery preserved
   - Documentation downloads work

**Deliverables**:
- Professional detail pages
- All features preserved
- Enhanced visual design
- Mobile-responsive

---

### Phase 6: Resources Pages (Week 3)
**Goal**: Helpful hub for guides and tools

1. **Resources Hub**
   - Hero section
   - Resource card grid
   - Clear navigation

2. **Individual Resource Pages**
   - Consistent styling
   - Enhanced layouts
   - Preserve functionality

3. **Selection Wizard**
   - Visual polish (no logic changes)
   - Better progress indicator
   - Enhanced result cards

**Deliverables**:
- Redesigned resources hub
- All guide pages enhanced
- Wizard preserved and polished

---

### Phase 7: Polish & Testing (Week 4)
**Goal**: Production-ready quality

1. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers

2. **Language Testing**
   - Test all 6 languages
   - Verify all translations
   - Check text overflow

3. **Performance Optimization**
   - Image optimization
   - Code splitting
   - AOS performance

4. **Accessibility Audit**
   - Keyboard navigation
   - Screen reader testing
   - Color contrast
   - ARIA labels

5. **Final QA**
   - All features work
   - No console errors
   - Responsive on all devices
   - Animations smooth

**Deliverables**:
- Fully tested application
- Performance optimized
- Accessibility compliant
- Production-ready

---

## Developer Guidelines

### Code Style & Organization

#### File Naming
- Components: PascalCase (e.g., `PageHero.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- CSS files: kebab-case (e.g., `custom-utilities.css`)

#### Component Structure
```tsx
// 1. Imports
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

// 2. Type definitions
interface ComponentProps {
  // ...
}

// 3. Component
export function Component({ prop }: ComponentProps) {
  // 4. Hooks
  const t = useTranslations('Namespace')
  const [state, setState] = useState()

  // 5. Handlers
  const handleClick = () => {
    // ...
  }

  // 6. Render
  return (
    <div className="...">
      {/* ... */}
    </div>
  )
}
```

### Translation Best Practices

#### Always Use Translations
```tsx
// ❌ WRONG
<h1>RAST 5 Catalog</h1>

// ✅ CORRECT
const t = useTranslations('HomePage')
<h1>{t('title')}</h1>
```

#### Server Components
```tsx
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return <h1>{t('title')}</h1>
}
```

#### Client Components
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function Component() {
  const t = useTranslations('Navbar')
  return <button>{t('browseCatalog')}</button>
}
```

### Styling Best Practices

#### Use Template Utilities
```tsx
// Prefer template CSS utilities over inline styles
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

#### Responsive Design
```tsx
// Mobile-first approach
className="text-base md:text-lg lg:text-xl"

// Prefer Tailwind breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

#### Component Variants
```tsx
// Use conditional classes for variants
const cardClasses = cn(
  "base-classes",
  variant === 'featured' && "border-2 border-blue-600",
  isHovered && "shadow-xl"
)
```

### Animation Guidelines

#### AOS Attributes
```tsx
// Basic fade-up
<div data-aos="fade-up">Content</div>

// With delay for stagger
<div data-aos="fade-up" data-aos-delay="100">Item 1</div>
<div data-aos="fade-up" data-aos-delay="200">Item 2</div>

// Hero content
<div data-aos="fade-right">Left content</div>
<div data-aos="fade-left">Right content</div>

// Important CTAs
<div data-aos="zoom-in">Call to action</div>
```

#### CSS Transitions
```tsx
// Standard transition
className="transition-all duration-300 ease-out"

// Hover effects
className="hover:shadow-lg hover:-translate-y-1 transition-all"

// Focus states
className="focus:ring-4 focus:ring-blue-100 transition-all"
```

### Performance Considerations

#### Image Optimization
```tsx
import Image from 'next/image'

<Image
  src={imageSrc}
  alt={t('imageAlt')}
  width={800}
  height={600}
  loading="lazy"
  className="rounded-xl"
/>
```

#### Code Splitting
```tsx
// Lazy load heavy components
const Video360Player = dynamic(() => import('./Video360Player'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

#### Suspense Boundaries
```tsx
<Suspense fallback={<LoadingState />}>
  <HeavyComponent />
</Suspense>
```

### Accessibility Requirements

#### Semantic HTML
```tsx
// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<nav>, <main>, <article>, <section>, <aside>
```

#### ARIA Labels
```tsx
<button aria-label={t('closeMenu')}>
  <X className="h-4 w-4" />
</button>

<input
  type="search"
  aria-label={t('searchPlaceholder')}
  placeholder={t('searchPlaceholder')}
/>
```

#### Keyboard Navigation
```tsx
// Ensure all interactive elements are keyboard-accessible
<Link href={url} className="focus:ring-2 focus:ring-blue-600">
  {/* ... */}
</Link>

// Add keyboard handlers where needed
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick()
  }
}}
```

#### Color Contrast
- Text on white: Use slate-800 or darker (minimum 4.5:1)
- Text on dark backgrounds: Use white or slate-100
- Test with browser DevTools

### Testing Checklist

Before considering a component complete:

- [ ] Works in all 6 languages (en, it, es, de, ru, pt)
- [ ] All text uses translations (no hardcoded strings)
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Keyboard accessible (tab navigation works)
- [ ] Screen reader friendly (test with VoiceOver/NVDA)
- [ ] Hover states work on desktop
- [ ] Touch states work on mobile
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] No console errors or warnings
- [ ] Animations are smooth (60fps)
- [ ] Supabase data displays correctly
- [ ] Links work with locale prefix (/${locale}/...)
- [ ] Images have alt text
- [ ] Buttons have proper labels

### Git Workflow

#### Branch Naming
```bash
# Already on: redesign-professional-template
# Make feature branches from this if needed
git checkout -b feature/navbar-enhancement
```

#### Commit Messages
```bash
# Use clear, descriptive commits
git commit -m "Enhance Navbar with glassmorphism and dropdown menu"
git commit -m "Add PageHero shared component with AOS animations"
git commit -m "Redesign homepage hero section with dark background"
```

#### Before Committing
1. Test locally (npm run dev)
2. Check all 6 languages
3. Verify no console errors
4. Test responsive layouts
5. Run TypeScript check: `npm run build`

### Common Patterns

#### Conditional Rendering with Translations
```tsx
{connector.special_notes && (
  <div className="alert">
    <AlertCircle />
    <p>{connector.special_notes}</p>
  </div>
)}
```

#### Mapping with Translations
```tsx
{categories.map((category, index) => (
  <Card key={category.id} data-aos="fade-up" data-aos-delay={index * 100}>
    <h3>{t(`categories.${category.key}.title`)}</h3>
    <p>{t(`categories.${category.key}.description`)}</p>
  </Card>
))}
```

#### Dynamic Links with Locale
```tsx
import { useLocale } from 'next-intl'

const locale = useLocale()

<Link href={`/${locale}/catalog?category=${category}`}>
  {t('viewCategory')}
</Link>
```

#### Gender Color Helper
```tsx
const getGenderColor = (gender: string) => {
  switch (gender) {
    case 'Female': return 'bg-blue-500'
    case 'Male': return 'bg-orange-500'
    case 'PCB Header': return 'bg-green-500'
    default: return 'bg-slate-500'
  }
}
```

---

## Summary

This design specification provides a complete blueprint for transforming the RAST 5 catalog from functional to professional, industrial-grade quality while preserving all existing features and the complete i18n system.

### Key Success Factors

1. **Enhancement Over Replacement**: Every change builds upon existing components
2. **Translation Integrity**: All 6 languages maintained throughout
3. **Feature Preservation**: 360° videos, filters, Supabase integration all intact
4. **Professional Aesthetics**: Template design system applied consistently
5. **User Experience**: Mobile-responsive, accessible, performant

### Implementation Priority

1. Foundation & shared components (Week 1)
2. Navigation & homepage (Week 1-2)
3. Catalog experience (Week 2)
4. Detail pages (Week 3)
5. Resources & polish (Week 3-4)

### Expected Outcome

A professional, industrial-quality connector catalog that:
- Builds trust with clean, modern design
- Makes browsing intuitive and enjoyable
- Maintains all technical functionality
- Works perfectly in 6 languages
- Performs excellently on all devices
- Sets a new standard for technical catalogs

---

**Document Version**: 1.0
**Last Updated**: 2025-10-07
**For Project**: RAST 5 Catalog Redesign
**Branch**: redesign-professional-template
