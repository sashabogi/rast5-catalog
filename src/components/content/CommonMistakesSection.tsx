'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface CommonMistakesSectionProps {
  translationNamespace?: string
}

export function CommonMistakesSection({ translationNamespace = 'TerminalsGuide' }: CommonMistakesSectionProps) {
  const t = useTranslations(translationNamespace)

  const mistakes = [
    {
      mistake: t('commonMistakes.mistakes.1.mistake'),
      consequence: t('commonMistakes.mistakes.1.consequence'),
      solution: t('commonMistakes.mistakes.1.solution')
    },
    {
      mistake: t('commonMistakes.mistakes.2.mistake'),
      consequence: t('commonMistakes.mistakes.2.consequence'),
      solution: t('commonMistakes.mistakes.2.solution')
    },
    {
      mistake: t('commonMistakes.mistakes.3.mistake'),
      consequence: t('commonMistakes.mistakes.3.consequence'),
      solution: t('commonMistakes.mistakes.3.solution')
    },
    {
      mistake: t('commonMistakes.mistakes.4.mistake'),
      consequence: t('commonMistakes.mistakes.4.consequence'),
      solution: t('commonMistakes.mistakes.4.solution')
    }
  ]

  return (
    <div className="w-full">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-4xl font-inter font-bold text-slate-900 mb-6">
          {t('commonMistakes.sectionTitle')}
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          {t('commonMistakes.sectionDescription')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8" data-aos="fade-up" data-aos-delay="100">
        {mistakes.map((item, index) => (
          <Card key={index} className="border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-inter font-bold text-amber-900">{item.mistake}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <h4 className="font-inter font-bold text-sm text-red-800 mb-2">
                  {t('commonMistakes.consequenceLabel')}
                </h4>
                <p className="text-sm text-slate-700">{item.consequence}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="font-inter font-bold text-sm text-green-800 mb-2">
                  {t('commonMistakes.solutionLabel')}
                </h4>
                <p className="text-sm text-slate-700">{item.solution}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
