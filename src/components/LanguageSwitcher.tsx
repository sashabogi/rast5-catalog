'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LanguageSwitcher')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false)

    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    router.push(newPath)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-50"
        aria-label={t('selectLanguage')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeFlags[locale as Locale]}</span>
        <span className="hidden md:inline">{localeNames[locale as Locale]}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1" role="menu">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  locale === loc
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span className="text-xl">{localeFlags[loc]}</span>
                <span className="flex-1 text-left">{localeNames[loc]}</span>
                {locale === loc && (
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
