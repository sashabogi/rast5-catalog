import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ProductBreadcrumbsProps {
  locale: string
  model: string
  translations: {
    home: string
    catalog: string
  }
}

export function ProductBreadcrumbs({ locale, model, translations }: ProductBreadcrumbsProps) {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-slate-600" data-aos="fade-right">
          <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors font-semibold">
            {translations.home}
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <Link href={`/${locale}/catalog`} className="hover:text-blue-600 transition-colors font-semibold">
            {translations.catalog}
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="text-slate-900 font-bold">{model}</span>
        </nav>
      </div>
    </div>
  )
}
