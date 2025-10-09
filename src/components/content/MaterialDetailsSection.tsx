'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Activity } from 'lucide-react'

interface MaterialDetailsSectionProps {
  translationNamespace?: string
}

export function MaterialDetailsSection({ translationNamespace = 'TerminalsGuide' }: MaterialDetailsSectionProps) {
  const t = useTranslations(translationNamespace)

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50" data-aos="fade-up">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-inter font-bold text-slate-900">
          {t('technicalSpecs.materialDetails.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h4 className="font-inter font-bold text-lg mb-4 text-slate-800">
              {t('technicalSpecs.materialDetails.contactMaterial.heading')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-inter text-slate-700">
                  {t('technicalSpecs.materialDetails.contactMaterial.baseMaterial')}
                </span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-inter text-slate-700">
                  {t('technicalSpecs.materialDetails.contactMaterial.plating')}
                </span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-inter text-slate-700">
                  {t('technicalSpecs.materialDetails.contactMaterial.matingArea')}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-inter font-bold text-lg mb-4 text-slate-800">
              {t('technicalSpecs.materialDetails.performanceCharacteristics.heading')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-inter text-slate-700">
                  {t('technicalSpecs.materialDetails.performanceCharacteristics.contactResistance')}
                </span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-inter text-slate-700">
                  {t('technicalSpecs.materialDetails.performanceCharacteristics.insertionForce')}
                </span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-inter text-slate-700">
                  {t('technicalSpecs.materialDetails.performanceCharacteristics.operatingTemperature')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
