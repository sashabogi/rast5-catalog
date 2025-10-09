'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TerminalRemovalSectionProps {
  translationNamespace?: string
}

export function TerminalRemovalSection({ translationNamespace = 'TerminalsGuide' }: TerminalRemovalSectionProps) {
  const t = useTranslations(translationNamespace)

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50" data-aos="fade-up">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-inter font-bold text-red-900">
          {t('installation.terminalRemoval.title')}
        </CardTitle>
        <CardDescription className="text-red-700 text-base">
          {t('installation.terminalRemoval.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-red-200">
            <span className="font-inter font-bold text-red-600 flex-shrink-0 text-lg">1.</span>
            <span className="text-slate-700">{t('installation.terminalRemoval.steps.1')}</span>
          </li>
          <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-red-200">
            <span className="font-inter font-bold text-red-600 flex-shrink-0 text-lg">2.</span>
            <span className="text-slate-700">{t('installation.terminalRemoval.steps.2')}</span>
          </li>
          <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-red-200">
            <span className="font-inter font-bold text-red-600 flex-shrink-0 text-lg">3.</span>
            <span className="text-slate-700">{t('installation.terminalRemoval.steps.3')}</span>
          </li>
          <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-red-200">
            <span className="font-inter font-bold text-red-600 flex-shrink-0 text-lg">4.</span>
            <span className="text-slate-700">{t('installation.terminalRemoval.steps.4')}</span>
          </li>
        </ol>
      </CardContent>
    </Card>
  )
}
