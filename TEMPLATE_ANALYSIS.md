# Tidy-Next Template Analysis

## Overview
The tidy-next template is a professional Next.js 15 template with modern design patterns, custom Tailwind CSS v4 configuration, and extensive component library.

## Technical Stack

### Core Technologies
- **Next.js**: 15.1.6 (vs our 15.5.4 - compatible)
- **React**: 19.0.0 (same as ours ✓)
- **TypeScript**: 5.7.3
- **Tailwind CSS**: v4.0.3 (we have v3 - UPGRADE NEEDED)
- **AOS (Animate On Scroll)**: 3.0.0-beta.6
- **@headlessui/react**: 2.2.0 for UI components

### Content & Styling
- **MDX Support**: @mdx-js/loader, @mdx-js/react, @next/mdx, next-mdx-remote
- **Code Highlighting**: rehype-pretty-code
- **Tailwind Plugins**: @tailwindcss/forms, @tailwindcss/typography
- **Date Utilities**: date-fns

## Design System

### Typography
**Primary Font**: Inter (sans-serif)
- Used for body text, navigation, buttons
- Variable: `--font-inter`

**Display Font**: Playfair Display (serif)
- Used for headings and hero titles
- Variable: `--font-playfair-display`
- Creates elegant, professional look

### Color Palette
- **Background**: White (`bg-white`)
- **Text**: Slate-800 (`text-slate-800`)
- **Accent**: Blue-600 (`text-blue-600`, `bg-blue-600`)
- **Dark Sections**: Slate-900 (`bg-slate-900`)
- **Muted Text**: Slate-400/500 (`text-slate-400`)

### Custom Theme Variables
```css
--color-slate-900: #101d2d
--color-blue-500: #5696ff
--color-blue-600: #2174ea
```

### Typography Scale
Custom line-heights and letter-spacing for every size:
- xs: 0.75rem (line-height: 1.5)
- sm: 0.875rem (line-height: 1.5715)
- base: 1rem (line-height: 1.5, letter-spacing: -0.01em)
- lg through 6xl with optimized spacing

## CSS Architecture

### Tailwind CSS v4 Features
```css
@import 'tailwindcss';
@plugin "@tailwindcss/forms" { strategy: base; }
@plugin "@tailwindcss/typography" { strategy: base; }
@custom-variant dark (&:is(.dark *));
@theme { /* custom variables */ }
```

### Custom Styles
- **utility-patterns.css** - Reusable utility classes
- **range-slider.css** - Custom slider component
- **toggle-switch.css** - Custom toggle component
- **theme.css** - Additional theming

## Component Library (40+ Components)

### Hero Sections
- `hero-home.tsx` - Homepage hero with dark background
- `hero-about.tsx` - About page hero
- `hero-blog.tsx` - Blog listing hero
- `hero-pricing.tsx` - Pricing page hero
- `hero-support.tsx` - Support page hero
- `hero-wol.tsx` - Wall of Love hero

### Features
- `features-home.tsx` - Homepage features
- `features-home-02.tsx` - Alternative feature layout
- `features-home-03.tsx` - Third feature variant
- `features-blocks.tsx` - Feature blocks grid
- `features-table.tsx` - Feature comparison table
- `features-pricing.tsx` - Pricing features

### Call-to-Action
- `cta.tsx` - Standard CTA
- `cta-02.tsx` - Alternative CTA
- `cta-dark.tsx` - Dark variant
- `cta-box.tsx` - Boxed CTA
- `cta-pricing.tsx` - Pricing-specific CTA

### Social Proof
- `testimonials.tsx` - Customer testimonials (62KB - extensive)
- `clients.tsx` - Client logos
- `clients-02.tsx` - Alternative client display
- `customers.tsx` - Customer stories

### Other Components
- `pricing-tables.tsx` - Pricing comparison
- `team-members.tsx` - Team display
- `team.tsx` - Team section
- `faqs.tsx` - FAQ accordion
- `stats.tsx` - Statistics display
- `stats-02.tsx` - Alternative stats
- `target.tsx` - Target audience section
- `newsletter.tsx` - Newsletter signup
- `modal-video-01.tsx` - Video modal
- `modal-video-02.tsx` - Alternative video modal
- `related-stories.tsx` - Blog related posts (32KB)

### UI Components
- `header.tsx` - Main navigation
- `footer.tsx` - Site footer
- `logo.tsx` - Brand logo
- `mobile-menu.tsx` - Mobile navigation

### Blog Components
- `blog-tags.tsx` - Tag display
- `post-item.tsx` - Blog post card
- `post-date.tsx` - Date formatter

## Route Structure

### Route Groups
**`(default)` group**: Main pages with full navigation
- `/` - Homepage
- `/about` - About page
- `/blog` - Blog listing
- `/blog/[slug]` - Blog post
- `/pricing` - Pricing page
- `/support` - Support page
- `/wall-of-love` - Testimonials

**`(auth)` group**: Auth pages with simplified layout
- `/signin` - Sign in
- `/reset-password` - Password reset
- `/request-demo` - Demo request

## Layout Patterns

### Default Layout
```tsx
<div className="flex flex-col min-h-screen overflow-hidden">
  <Header />
  <main className="grow">{children}</main>
  <Footer />
</div>
```

### AOS Animation
- Initialized in layout with `AOS.init()`
- Used throughout with `data-aos="fade-right"` etc.
- Duration: 600ms
- Easing: ease-out-sine
- Once: true (animate only once)
- Disabled on phone

### Header Features
- Absolute positioning with z-30
- Dark/light mode toggle
- Desktop navigation with dropdown
- Mobile menu component
- Sticky branding
- CTA buttons with arrow animations

### Footer Features
- 5-column grid layout
- Logo and tagline
- Link sections
- Social media icons
- Copyright notice

## Design Patterns

### Hero Sections
- Dark background with clip-path polygon
- Centered content on mobile, left-aligned on desktop
- Large headings with Playfair Display
- CTA buttons with hover animations
- Image/video on right side

### Buttons
- `.btn` class for consistent styling
- Primary: `bg-blue-600 hover:bg-blue-700`
- Secondary: `bg-slate-700 hover:bg-slate-800`
- Arrow animations: `group-hover:translate-x-0.5`

### Spacing
- Container: `max-w-6xl mx-auto px-4 sm:px-6`
- Section padding: `py-12 md:py-24`
- Hero padding: `pt-32 pb-20 md:pt-40 md:pb-44`

### Animations
- Smooth transitions: `transition duration-150 ease-in-out`
- Hover effects on all links
- AOS scroll animations
- Transform animations on interactive elements

## Adaptation Strategy for RAST 5

### What to Adopt
1. **Tailwind CSS v4** - Upgrade for modern features
2. **Typography System** - Inter + Playfair Display
3. **Color Palette** - Slate/Blue professional theme
4. **Component Patterns** - Hero, Features, CTA layouts
5. **Animation System** - AOS for scroll effects
6. **Header/Footer** - Clean navigation structure

### What to Preserve from RAST 5
1. **next-intl** - All 6 language translations
2. **Supabase Integration** - Connector data, images, PDFs
3. **Catalog Functionality** - Filters, search, pagination
4. **Connector Details** - 360° videos, specs, documentation
5. **Resource Pages** - Terminal Guide, Installation Guide
6. **Selection Wizard** - Interactive connector guide

### Integration Approach
1. Copy template CSS/Tailwind config to redesign branch
2. Install template dependencies (AOS, headlessui, fonts)
3. Adapt header/footer for RAST 5 navigation
4. Create RAST 5-specific hero sections using template patterns
5. Redesign catalog page with template card/grid patterns
6. Maintain all i18n with getTranslations() in new components
7. Test thoroughly across all languages

## File Structure Comparison

### Template Structure
```
tidy-next/
├── app/
│   ├── (default)/          # Main pages
│   ├── (auth)/             # Auth pages
│   ├── css/                # Styles
│   └── layout.tsx          # Root layout
├── components/             # 40+ components
│   ├── ui/                 # Header, footer, etc.
│   ├── mdx/                # MDX components
│   └── utils/              # Utilities
├── content/                # MDX content
└── public/                 # Static assets
```

### RAST 5 Structure
```
rast5-catalog/
├── src/app/
│   ├── [locale]/          # i18n routes
│   │   ├── catalog/       # Product catalog
│   │   ├── connectors/    # Detail pages
│   │   └── resources/     # Guides
│   └── page.tsx           # Redirect
├── components/            # Current components
├── lib/                   # Supabase, utils
└── messages/              # i18n translations
```

## Recommended Next Steps

1. ✅ **Create redesign branch** (completed)
2. **Install template dependencies**
   - Upgrade to Tailwind CSS v4
   - Install AOS
   - Install @headlessui/react
   - Add Google Fonts (Inter, Playfair Display)

3. **Copy styling system**
   - Copy CSS files from template
   - Adapt Tailwind config for v4
   - Update global styles

4. **Redesign homepage**
   - Create professional hero section
   - Add feature blocks for connector types
   - Include CTA for catalog/selection guide
   - Maintain language switcher

5. **Redesign catalog**
   - Use template card patterns
   - Maintain filters functionality
   - Keep Supabase integration
   - Preserve all i18n

6. **Update layouts**
   - Adapt template header for RAST 5 nav
   - Customize footer with RAST 5 links
   - Add language switcher to header

7. **Test everything**
   - All 6 languages
   - All routes and functionality
   - Responsive design
   - Animations and interactions
