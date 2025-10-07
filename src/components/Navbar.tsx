'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Cable, Book, Search } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Navbar')

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname?.startsWith(`/${locale}${path}/`)
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <Cable className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">{t('brandName')}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/${locale}/catalog`}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isActive('/catalog')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>{t('browseCatalog')}</span>
            </Link>

            <Link
              href={`/${locale}/resources`}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isActive('/resources')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Book className="h-4 w-4" />
              <span>{t('resources')}</span>
            </Link>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
