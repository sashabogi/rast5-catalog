'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cable, Info, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface RelatedResourcesSectionProps {
  translationNamespace?: string
}

export function RelatedResourcesSection({ translationNamespace = 'TerminalsGuide' }: RelatedResourcesSectionProps) {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations(translationNamespace)

  return (
    <div className="w-full">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-inter font-bold text-slate-900 mb-4">
          {t('relatedResources.sectionTitle')}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="100">
        <Link href={`/${locale}/catalog`}>
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-slate-200 hover:border-blue-400 bg-white h-full">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Cable className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="font-inter font-bold text-xl">{t('relatedResources.browseCatalog.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('relatedResources.browseCatalog.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                {t('relatedResources.browseCatalog.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/${locale}/resources/connector-guide`}>
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-slate-200 hover:border-green-400 bg-white h-full">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Info className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="font-inter font-bold text-xl">{t('relatedResources.selectionGuide.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('relatedResources.selectionGuide.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300">
                {t('relatedResources.selectionGuide.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/${locale}/resources`}>
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-slate-200 hover:border-purple-400 bg-white h-full">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="font-inter font-bold text-xl">{t('relatedResources.allResources.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('relatedResources.allResources.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300">
                {t('relatedResources.allResources.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
