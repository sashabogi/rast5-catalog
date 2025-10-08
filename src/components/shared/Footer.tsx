'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Cable } from 'lucide-react'
import { LanguageSwitcher } from '../LanguageSwitcher'

export function Footer() {
  const locale = useLocale()
  const t = useTranslations('Footer')

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Cable className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl">
                {t('brandName')}
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              {t('tagline')}
            </p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/catalog`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('catalog')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/resources`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('resources')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('resources')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/resources/terminals`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('terminalGuide')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/resources/installation`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('installationGuide')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/resources/selection-guide`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('selectionGuide')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-slate-400 text-sm text-center">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
