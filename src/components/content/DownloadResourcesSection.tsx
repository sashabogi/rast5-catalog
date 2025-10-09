'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface DownloadResourcesSectionProps {
  translationNamespace?: string
}

export function DownloadResourcesSection({ translationNamespace = 'TerminalsGuide' }: DownloadResourcesSectionProps) {
  const t = useTranslations(translationNamespace)

  return (
    <div className="text-center" data-aos="fade-up">
      <h2 className="text-3xl font-inter font-bold text-white mb-6">
        {t('downloadResources.title')}
      </h2>
      <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
        {t('downloadResources.description')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="mr-2 h-5 w-5" />
          {t('downloadResources.specsPdf')}
        </Button>
        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
          <Download className="mr-2 h-5 w-5" />
          {t('downloadResources.installationPdf')}
        </Button>
      </div>
    </div>
  )
}
