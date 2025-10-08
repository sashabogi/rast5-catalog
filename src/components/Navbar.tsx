'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Cable, BookOpen, Wrench, Compass } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Dropdown } from './shared/Dropdown'

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Navbar')

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname?.startsWith(`/${locale}${path}/`)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-3 group">
              <Cable className="h-8 w-8 text-blue-600 transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-slate-900">
                  {t('brandName')}
                </span>
                <span className="hidden sm:block text-xs text-slate-600">
                  {t('tagline')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Browse Catalog */}
            <Link
              href={`/${locale}/catalog`}
              className={`px-4 py-2 text-base font-medium transition-all duration-200 rounded-lg relative group ${
                isActive('/catalog')
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              <span>{t('browseCatalog')}</span>
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200 ${
                  isActive('/catalog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* Resources Dropdown */}
            <Dropdown title={t('resources')}>
              <li>
                <Link
                  href={`/${locale}/resources/terminals`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{t('resourcesDropdown.terminals')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/resources/installation`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Wrench className="h-4 w-4" />
                  <span>{t('resourcesDropdown.installation')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/resources/connector-guide`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Compass className="h-4 w-4" />
                  <span>{t('resourcesDropdown.wizard')}</span>
                </Link>
              </li>
            </Dropdown>

            {/* Language Switcher */}
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button - TODO: Implement mobile menu in future phase */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
