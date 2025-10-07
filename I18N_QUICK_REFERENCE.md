# i18n Quick Reference Guide

## Supported Languages

| Code | Language   | Flag |
|------|------------|------|
| en   | English    | 🇬🇧  |
| es   | Español    | 🇪🇸  |
| it   | Italiano   | 🇮🇹  |
| ru   | Русский    | 🇷🇺  |
| de   | Deutsch    | 🇩🇪  |
| pt   | Português  | 🇵🇹  |

## Common Tasks

### 1. Use Translations in Components

**Server Component (async):**
```typescript
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('PageName')

  return <h1>{t('title')}</h1>
}
```

**Client Component:**
```typescript
'use client'
import { useTranslations } from 'next-intl'

export function Component() {
  const t = useTranslations('ComponentName')

  return <h1>{t('title')}</h1>
}
```

### 2. Create Locale-Aware Links

```typescript
'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export function NavLink() {
  const locale = useLocale()

  return <Link href={`/${locale}/catalog`}>Catalog</Link>
}
```

### 3. Get Current Locale

```typescript
'use client'
import { useLocale } from 'next-intl'

export function Component() {
  const locale = useLocale() // 'en', 'es', etc.

  return <div>Current language: {locale}</div>
}
```

### 4. Add New Translations

**Step 1:** Add to English file first (`/messages/en.json`):
```json
{
  "NewFeature": {
    "title": "My New Feature",
    "description": "Feature description"
  }
}
```

**Step 2:** Add to all other language files with translations:
```json
// messages/es.json
{
  "NewFeature": {
    "title": "Mi Nueva Característica",
    "description": "Descripción de la característica"
  }
}
```

**Step 3:** Use in component:
```typescript
const t = await getTranslations('NewFeature')
return <h1>{t('title')}</h1>
```

### 5. Test Different Languages

**Development:**
```bash
# Visit different locale URLs
http://localhost:3000/en
http://localhost:3000/es/catalog
http://localhost:3000/it/resources
```

**Production:**
```bash
npm run build
npm start
```

## File Locations

| What                  | Where                                    |
|-----------------------|------------------------------------------|
| Translation files     | `/messages/*.json`                       |
| i18n config           | `/src/i18n.ts`                          |
| Middleware            | `/middleware.ts`                        |
| Language switcher     | `/src/components/LanguageSwitcher.tsx`  |
| Locale pages          | `/src/app/[locale]/**`                  |

## Translation File Structure

```json
{
  "SectionName": {
    "subsection": {
      "key": "Translation value",
      "anotherKey": "Another value"
    },
    "simpleKey": "Simple translation"
  }
}
```

**Access in code:**
```typescript
t('SectionName.subsection.key')      // "Translation value"
t('SectionName.simpleKey')            // "Simple translation"
```

## URL Structure

| Page              | English      | Spanish         | Italian         |
|-------------------|--------------|-----------------|-----------------|
| Homepage          | `/en`        | `/es`           | `/it`           |
| Catalog           | `/en/catalog`| `/es/catalog`   | `/it/catalog`   |
| Connector Detail  | `/en/connector/123` | `/es/connector/123` | `/it/connector/123` |
| Resources         | `/en/resources` | `/es/resources` | `/it/resources` |

## Common Patterns

### Dynamic Content with Translations

```typescript
const t = useTranslations('CatalogPage')

// With variables (if implemented)
<p>{t('results.showing', { count: connectors.length })}</p>

// Conditional translations
{error ? t('errors.loadFailed') : t('success.loaded')}
```

### Server Component with Locale

```typescript
export default async function Page({
  params
}: {
  params: Promise<{ locale: string, id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('PageName')

  // Use locale and translations
}
```

### Client Component with Multiple Translation Namespaces

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function Component() {
  const tCommon = useTranslations('Common')
  const tPage = useTranslations('PageSpecific')

  return (
    <>
      <button>{tCommon('buttons.submit')}</button>
      <h1>{tPage('title')}</h1>
    </>
  )
}
```

## Debugging

### Check Current Locale
```typescript
console.log('Current locale:', useLocale())
```

### Verify Translation Key Exists
```typescript
const t = useTranslations('Section')
console.log('Translation:', t('key'))
// If key doesn't exist, you'll see the key path returned
```

### Build-Time Checks
```bash
# Check for missing translations
npm run build

# Look for warnings about missing keys or locale issues
```

## Common Issues & Solutions

### Issue: "useTranslations cannot be called in async function"
**Solution:** Use `getTranslations` instead of `useTranslations` in server components

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

### Issue: Links don't maintain locale
**Solution:** Always include locale in href

```typescript
// ❌ Wrong
<Link href="/catalog">Catalog</Link>

// ✅ Correct
const locale = useLocale()
<Link href={`/${locale}/catalog`}>Catalog</Link>
```

### Issue: 404 on root URL
**Expected:** Root `/` redirects to `/en` - this is correct behavior

### Issue: Translation not showing
**Checklist:**
1. Is the key in ALL language files?
2. Is the JSON syntax valid?
3. Is the translation namespace correct?
4. Did you restart dev server after adding translations?

## Performance Tips

1. **Static Generation:** All locale routes are pre-generated at build time
2. **Code Splitting:** Each locale's translations are loaded separately
3. **Client Navigation:** Language switching doesn't reload the entire page
4. **Caching:** Built pages are cached for fast delivery

## Adding a New Language

1. Add to `src/i18n.ts`:
   ```typescript
   export const locales = ['en', 'es', 'it', 'ru', 'de', 'pt', 'fr']
   export const localeNames = { ..., fr: 'Français' }
   export const localeFlags = { ..., fr: '🇫🇷' }
   ```

2. Create `/messages/fr.json` with all translations

3. Rebuild: `npm run build`

4. Test: Visit `/fr`

## Keyboard Shortcuts (Dev)

| Action              | Shortcut         |
|---------------------|------------------|
| Switch to English   | Visit `/en`      |
| Switch to Spanish   | Visit `/es`      |
| Reload translations | Restart dev server |

## Resources

- **Full Documentation:** See `I18N_IMPLEMENTATION.md`
- **Translation Files:** `/messages/`
- **next-intl Docs:** https://next-intl-docs.vercel.app/
- **Configuration:** `/src/i18n.ts`

---

**Need Help?** Check `I18N_IMPLEMENTATION.md` for detailed documentation.
