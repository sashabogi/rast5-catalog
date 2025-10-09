'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WrenchIcon } from 'lucide-react'

interface RequiredToolsSectionProps {
  translationNamespace?: string
}

export function RequiredToolsSection({ translationNamespace = 'TerminalsGuide' }: RequiredToolsSectionProps) {
  const t = useTranslations(translationNamespace)

  return (
    <Card className="mb-12 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50" data-aos="fade-up">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-inter font-bold text-slate-900">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <WrenchIcon className="h-6 w-6 text-white" />
          </div>
          {t('installation.requiredTools.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
            <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
              {t('installation.requiredTools.crimpingTool.title')}
            </h4>
            <p className="text-sm text-slate-600">
              {t('installation.requiredTools.crimpingTool.description')}
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
            <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
              {t('installation.requiredTools.wireStripper.title')}
            </h4>
            <p className="text-sm text-slate-600">
              {t('installation.requiredTools.wireStripper.description')}
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
            <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
              {t('installation.requiredTools.insertionTool.title')}
            </h4>
            <p className="text-sm text-slate-600">
              {t('installation.requiredTools.insertionTool.description')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
