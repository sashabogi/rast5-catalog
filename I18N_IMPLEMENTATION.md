# RAST 5 Catalog - Internationalization (i18n) Implementation

## Overview

Complete internationalization support has been implemented for the RAST 5 Connector Catalog with **6 languages**:
- English (en) - Default
- Spanish (es)
- Italian (it)
- Russian (ru)
- German (de)
- Portuguese (pt)

## Implementation Details

### 1. Core Configuration

#### Installed Packages
- **next-intl** (v4.3.11) - Industry-standard i18n library for Next.js 15 App Router

#### Configuration Files

**`src/i18n.ts`** - Main i18n configuration
- Defines supported locales and default locale
- Exports locale metadata (names, flags)
- Configures message loading from JSON files

**`middleware.ts`** - Route handling
- Automatic locale detection from browser settings
- URL-based locale routing (`/en/...`, `/es/...`, etc.)
- Redirects root `/` to default language `/en`

**`next.config.ts`** - Next.js integration
- Integrated next-intl plugin for proper build optimization

### 2. Routing Structure

All routes now include a `[locale]` parameter:

```
Previous:           New Structure:
/                  → /en (default)
/catalog           → /en/catalog
/resources         → /es/resources
                     /it/catalog
                     etc.
```

**Directory Structure:**
```
src/app/
  [locale]/
    layout.tsx              # Root layout with locale provider
    page.tsx                # Homepage
    catalog/
      page.tsx              # Catalog page
    connector/
      [id]/
        page.tsx            # Connector detail page
    resources/
      page.tsx              # Resources index
      connector-guide/
        page.tsx
      terminals/
        page.tsx
      installation/
        page.tsx
```

### 3. Translation Files

Located in `/messages/` directory:

```
messages/
  en.json     # English (base)
  es.json     # Spanish
  it.json     # Italian
  ru.json     # Russian
  de.json     # German
  pt.json     # Portuguese
```

**Translation Coverage:**
- Navigation (navbar, links, buttons)
- Homepage (hero, features, categories, selection guide CTA)
- Catalog page (filters, search, results)
- Connector detail page (tabs, specifications, compatibility)
- Resources pages (all resource links and descriptions)
- Language switcher UI

**Translation Structure Example:**
```json
{
  "HomePage": {
    "hero": {
      "title": "RAST 5 Connector Catalog",
      "description": "Professional catalog of RAST 5...",
      "browseCatalog": "Browse Catalog"
    },
    "features": {
      "title": "Why Use This Catalog?",
      "view360": {...}
    }
  }
}
```

### 4. Components

#### LanguageSwitcher Component
**Location:** `src/components/LanguageSwitcher.tsx`

Features:
- Dropdown menu with all 6 languages
- Flag icons for visual identification
- Language names in native script (Español, Italiano, Русский, etc.)
- Smooth transitions when switching
- Maintains current page context (switches `/en/catalog` to `/es/catalog`)
- Click-outside detection for UX
- Checkmark for current language

#### Updated Components

**Navbar** (`src/components/Navbar.tsx`)
- Now locale-aware
- Includes LanguageSwitcher
- All links include locale parameter
- Highlights active page

**ConnectorCard** (`src/components/ConnectorCard.tsx`)
- Links include locale in URL
- Maintains locale when navigating to connector details

**CatalogFilters** (`src/components/CatalogFilters.tsx`)
- URL updates preserve locale
- Filter state maintained across language switches

### 5. Translation Usage

#### Server Components (async pages)
```typescript
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('HomePage')

  return <h1>{t('hero.title')}</h1>
}
```

#### Client Components
```typescript
'use client'
import { useTranslations, useLocale } from 'next-intl'

export function Component() {
  const t = useTranslations('Navbar')
  const locale = useLocale()

  return <Link href={`/${locale}/catalog`}>{t('browseCatalog')}</Link>
}
```

### 6. SEO Optimization

- `lang` attribute on `<html>` tag matches current locale
- Metadata translated (future enhancement: add hreflang tags)
- Clean, SEO-friendly URLs: `/es/catalogo` structure
- Static generation for all locale combinations

### 7. Build Configuration

#### Static Generation
All locale combinations are pre-generated at build time:
- `/en`, `/es`, `/it`, `/ru`, `/de`, `/pt`
- All sub-routes for each locale
- Reduces server load and improves performance

#### Build Output (Sample)
```
Route (app)
├ ● /[locale]                              165 B
├   ├ /en
├   ├ /es
├   ├ /it
├   └ [+3 more paths]
├ ● /[locale]/catalog                    6.83 kB
├   ├ /en/catalog
├   ├ /es/catalog
...
```

## How to Use

### Adding New Translations

1. **Add to all language files** in `/messages/`
2. **Use consistent key structure** across all languages
3. **Maintain hierarchy** - Group related translations

Example:
```json
// messages/en.json
{
  "NewSection": {
    "title": "New Feature",
    "description": "Feature description"
  }
}

// messages/es.json
{
  "NewSection": {
    "title": "Nueva Característica",
    "description": "Descripción de la característica"
  }
}
```

### Using in Components

**In Server Components:**
```typescript
const t = await getTranslations('NewSection')
return <h1>{t('title')}</h1>
```

**In Client Components:**
```typescript
const t = useTranslations('NewSection')
return <h1>{t('title')}</h1>
```

### Creating Locale-Aware Links

Always include locale in internal links:

```typescript
import { useLocale } from 'next-intl'

function MyComponent() {
  const locale = useLocale()

  return (
    <Link href={`/${locale}/catalog`}>
      Browse Catalog
    </Link>
  )
}
```

### Adding a New Language

1. Add locale to `src/i18n.ts`:
```typescript
export const locales = ['en', 'es', 'it', 'ru', 'de', 'pt', 'fr'] as const;
```

2. Add locale metadata:
```typescript
export const localeNames: Record<Locale, string> = {
  // ... existing
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  // ... existing
  fr: '🇫🇷',
};
```

3. Create translation file: `messages/fr.json`

4. Copy structure from `messages/en.json` and translate all strings

5. Rebuild the application

## Testing

### Manual Testing Checklist

- [ ] All 6 languages load correctly
- [ ] Language switcher works on all pages
- [ ] Locale persists across navigation
- [ ] URL structure correct: `/{locale}/{page}`
- [ ] No English fallback text appears in other languages
- [ ] Browser language detection works
- [ ] All links maintain locale parameter
- [ ] Filter state preserved when switching languages
- [ ] Page titles and metadata translated

### Testing Different Languages

1. **Direct URL Access:**
   - `/en/catalog`
   - `/es/catalog`
   - `/it/catalog`
   - etc.

2. **Language Switcher:**
   - Click language dropdown in navbar
   - Select different language
   - Verify page reloads with new locale
   - Verify all content translated

3. **Browser Settings:**
   - Clear cookies/cache
   - Set browser language to Spanish
   - Visit root URL `/`
   - Should redirect to `/es`

## Technical Notes

### Next.js 15 Compatibility

This implementation is fully compatible with Next.js 15 App Router:
- Uses async params (`Promise<{ locale: string }>`)
- Server components use `getTranslations`
- Client components use `useTranslations`
- Middleware properly configured for route matching

### Performance

- **Static Generation:** All locale routes pre-rendered at build time
- **Code Splitting:** Translation files loaded only for active locale
- **No Client-Side Overhead:** Translations bundled at build time
- **Fast Language Switching:** Client-side navigation (no full page reload)

### Maintenance

**Keep translations synchronized:**
- When adding features, update ALL 6 language files
- Use the English file as the source of truth
- Maintain consistent key structure
- Consider using a translation management service for larger projects

**Translation Quality:**
- Technical terms (connector, terminal, pole) accurately translated
- Professional tone maintained across all languages
- Numbers, units, and technical specs remain consistent
- Brand names (RAST 5) untranslated

## Migration from Non-i18n Version

### Breaking Changes

1. **URL Structure:** All URLs now require locale prefix
   - Old: `/catalog` → New: `/en/catalog`

2. **Page Parameters:** All pages now receive `params: Promise<{ locale: string }>`

3. **Hard-coded Strings:** All UI text must use translation keys

4. **Links:** All `<Link>` components must include locale

### Backwards Compatibility

The middleware automatically redirects:
- `/` → `/en` (default locale)
- Legacy URLs without locale → redirected with locale detection

## Future Enhancements

- [ ] Add hreflang tags for better SEO
- [ ] Implement RTL support for Arabic/Hebrew if needed
- [ ] Add date/number formatting per locale
- [ ] Translation management system integration
- [ ] Crowdin or similar for community translations
- [ ] Automated translation memory
- [ ] A/B testing for different translations

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Translation Files](/messages/)
- [i18n Configuration](/src/i18n.ts)
- [Middleware Configuration](/middleware.ts)

## Support

For questions or issues with internationalization:
1. Check this documentation
2. Review translation files in `/messages/`
3. Test with build: `npm run build`
4. Check Next.js console for i18n errors
