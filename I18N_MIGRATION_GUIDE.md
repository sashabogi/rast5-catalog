# i18n Migration Guide

## Overview

This guide helps developers update existing code to work with the new internationalization (i18n) system.

## What Changed

### Before i18n Implementation
- URLs: `/catalog`, `/resources`, etc.
- Hard-coded English text
- No language switching

### After i18n Implementation
- URLs: `/en/catalog`, `/es/catalog`, etc.
- All text from translation files
- Language switcher in navbar
- 6 languages supported

## Step-by-Step Migration

### 1. Update Page Components

#### Old Pattern (Before)
```typescript
export default function CatalogPage() {
  return (
    <div>
      <h1>Connector Catalog</h1>
      <p>Browse all RAST 5 connectors</p>
    </div>
  )
}
```

#### New Pattern (After) - Server Component
```typescript
import { getTranslations } from 'next-intl/server'

export default async function CatalogPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('CatalogPage')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

#### New Pattern (After) - Client Component
```typescript
'use client'
import { useTranslations } from 'next-intl'

export default function CatalogFilters() {
  const t = useTranslations('CatalogPage')

  return (
    <div>
      <h1>{t('filters.title')}</h1>
      <input placeholder={t('filters.search')} />
    </div>
  )
}
```

### 2. Update Links

#### Old Pattern (Before)
```typescript
<Link href="/catalog">Browse Catalog</Link>
<Link href="/connector/123">View Details</Link>
```

#### New Pattern (After)
```typescript
'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'

function NavLinks() {
  const locale = useLocale()

  return (
    <>
      <Link href={`/${locale}/catalog`}>Browse Catalog</Link>
      <Link href={`/${locale}/connector/123`}>View Details</Link>
    </>
  )
}
```

### 3. Update Navigation Logic

#### Old Pattern (Before)
```typescript
const router = useRouter()
router.push('/catalog')
```

#### New Pattern (After)
```typescript
'use client'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

function Component() {
  const locale = useLocale()
  const router = useRouter()

  const navigate = () => {
    router.push(`/${locale}/catalog`)
  }

  return <button onClick={navigate}>Go to Catalog</button>
}
```

### 4. Update URL Building

#### Old Pattern (Before)
```typescript
const catalogUrl = `/catalog?category=${category}`
```

#### New Pattern (After)
```typescript
const locale = useLocale()
const catalogUrl = `/${locale}/catalog?category=${category}`
```

### 5. Extract Hard-Coded Strings

#### Identify Hard-Coded Text
```typescript
// ❌ Before - Hard-coded
<button>Submit</button>
<h1>Connector Catalog</h1>
<p>No results found</p>
```

#### Add to Translation Files
```json
// messages/en.json
{
  "Common": {
    "buttons": {
      "submit": "Submit"
    }
  },
  "CatalogPage": {
    "title": "Connector Catalog",
    "noResults": "No results found"
  }
}
```

#### Use Translations
```typescript
// ✅ After - Translated
const t = useTranslations('Common')
const tCatalog = useTranslations('CatalogPage')

<button>{t('buttons.submit')}</button>
<h1>{tCatalog('title')}</h1>
<p>{tCatalog('noResults')}</p>
```

### 6. Update Layout Files

#### Old Pattern (Before)
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

#### New Pattern (After)
```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 7. Update Dynamic Routes

#### Old Pattern (Before)
```typescript
// app/connector/[id]/page.tsx
export default function ConnectorDetail({
  params: { id }
}: {
  params: { id: string }
}) {
  // component code
}
```

#### New Pattern (After)
```typescript
// app/[locale]/connector/[id]/page.tsx
export default async function ConnectorDetail({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('ConnectorDetailPage')

  // component code
}
```

## Common Migration Patterns

### Pattern 1: Page with Server Component

```typescript
// Before
export default function Page() {
  return <div>Content</div>
}

// After
export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('PageName')

  return <div>{t('content')}</div>
}
```

### Pattern 2: Client Component with State

```typescript
// Before
'use client'
export default function Component() {
  const [value, setValue] = useState('')
  return <input placeholder="Search..." />
}

// After
'use client'
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('ComponentName')
  const [value, setValue] = useState('')

  return <input placeholder={t('searchPlaceholder')} />
}
```

### Pattern 3: Component with Navigation

```typescript
// Before
'use client'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()

  const goToPage = () => {
    router.push('/catalog')
  }

  return <button onClick={goToPage}>Go</button>
}

// After
'use client'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export default function Component() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('ComponentName')

  const goToPage = () => {
    router.push(`/${locale}/catalog`)
  }

  return <button onClick={goToPage}>{t('buttonLabel')}</button>
}
```

## Directory Structure Migration

### Old Structure
```
src/app/
  layout.tsx
  page.tsx
  catalog/
    page.tsx
  connector/
    [id]/
      page.tsx
  resources/
    page.tsx
```

### New Structure
```
src/app/
  [locale]/              # NEW: Locale wrapper
    layout.tsx          # Moved here with i18n provider
    page.tsx            # Moved here with translations
    catalog/
      page.tsx          # Updated with translations
    connector/
      [id]/
        page.tsx        # Updated with locale param
    resources/
      page.tsx          # Updated with translations
```

## Breaking Changes Checklist

- [ ] All page components now receive `params: Promise<{ locale: string }>`
- [ ] All URLs must include locale: `/en/page` instead of `/page`
- [ ] Server components use `getTranslations` (async)
- [ ] Client components use `useTranslations` (hook)
- [ ] Links must use `useLocale()` to build URLs
- [ ] Hard-coded strings replaced with translation keys
- [ ] Root layout moved to `[locale]/layout.tsx`

## Testing Your Migration

### 1. Check TypeScript Compilation
```bash
npm run build
```
Look for type errors related to params or translation usage.

### 2. Test All Routes
```bash
npm run dev
```

Visit each URL pattern:
- `/en` (should work)
- `/es/catalog` (should work)
- `/it/resources` (should work)
- `/` (should redirect to `/en`)

### 3. Verify Translations
- Switch languages using the language switcher
- Check that all text changes
- Look for English fallback text in other languages (indicates missing translation)

### 4. Test Navigation
- Click all links
- Verify locale persists across pages
- Test back/forward browser buttons

## Common Issues During Migration

### Issue 1: "useTranslations cannot be called in async function"
**Cause:** Using hook in server component

**Solution:**
```typescript
// ❌ Wrong
export default async function Page() {
  const t = useTranslations('Page')
}

// ✅ Correct
export default async function Page() {
  const t = await getTranslations('Page')
}
```

### Issue 2: Links go to 404
**Cause:** Missing locale in URL

**Solution:**
```typescript
// ❌ Wrong
<Link href="/catalog">

// ✅ Correct
const locale = useLocale()
<Link href={`/${locale}/catalog`}>
```

### Issue 3: Translation key not found
**Cause:** Missing translation or wrong key path

**Solution:**
1. Check `/messages/en.json` for key
2. Verify key path matches JSON structure
3. Ensure all language files have the key

### Issue 4: Page params type error
**Cause:** Not using Promise for params in Next.js 15

**Solution:**
```typescript
// ❌ Wrong
params: { locale: string }

// ✅ Correct
params: Promise<{ locale: string }>
```

## Automated Migration Steps

### 1. Move Files
```bash
# Create locale directory
mkdir -p src/app/[locale]

# Move pages
mv src/app/page.tsx src/app/[locale]/page.tsx
mv src/app/layout.tsx src/app/[locale]/layout.tsx
mv src/app/catalog src/app/[locale]/catalog
mv src/app/resources src/app/[locale]/resources
mv src/app/connector src/app/[locale]/connector
```

### 2. Update Imports (Find & Replace)

Find: `import.*from 'next-intl'`
Replace with appropriate import:
- Server: `import { getTranslations } from 'next-intl/server'`
- Client: `import { useTranslations, useLocale } from 'next-intl'`

### 3. Add Locale to All Links

Find: `href="/`
Replace: `href={\`/${locale}/`

Then add: `const locale = useLocale()`

## Post-Migration Checklist

- [ ] Build succeeds without errors
- [ ] All pages load in all 6 languages
- [ ] Language switcher works on every page
- [ ] Navigation maintains locale
- [ ] No hard-coded English text remains
- [ ] All translation keys exist in all language files
- [ ] TypeScript types are correct
- [ ] No console errors
- [ ] Links work correctly
- [ ] Browser language detection works

## Rollback Plan

If migration fails and you need to rollback:

1. **Restore from Git:**
   ```bash
   git checkout HEAD~1 -- src/app/
   ```

2. **Remove i18n packages:**
   ```bash
   npm uninstall next-intl
   ```

3. **Restore original next.config.ts:**
   Remove `withNextIntl` wrapper

4. **Remove middleware.ts**

5. **Delete messages/ directory**

## Getting Help

If you encounter issues:

1. Check `I18N_IMPLEMENTATION.md` for detailed docs
2. Review `I18N_QUICK_REFERENCE.md` for common patterns
3. Compare your code with working examples in existing pages
4. Check next-intl documentation: https://next-intl-docs.vercel.app/

## Success Indicators

You've successfully migrated when:

✅ `npm run build` completes without errors
✅ All routes work in all 6 languages
✅ Language switcher appears and functions
✅ No hard-coded text visible
✅ TypeScript has no errors
✅ All links maintain locale

---

**Migration Complete!** 🎉

Next steps: Deploy and test in production environment.
