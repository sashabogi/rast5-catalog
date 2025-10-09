'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { CheckCircle, AlertCircle, Loader2, RotateCcw } from 'lucide-react'
import { WizardState, ConnectorResults } from '@/types/wizard.types'
import { ConnectorCard } from './ConnectorCard'

interface ResultsDisplayProps {
  loading: boolean
  results: ConnectorResults
  wizardState: WizardState
  locale: string
  onReset: () => void
  translations: {
    loading: string
    resultsTitle: string
    basedOn: (params: { poleCount: number; orientation: string; applicationType: string }) => string
    sockets: {
      femaleBadge: string
      title: string
      found: (params: { count: number }) => string
      foundPlural: (params: { count: number }) => string
    }
    tabs: {
      maleBadge: string
      title: string
      found: (params: { count: number }) => string
      foundPlural: (params: { count: number }) => string
    }
    headers: {
      pcbBadge: string
      title: string
      found: (params: { count: number }) => string
      foundPlural: (params: { count: number }) => string
    }
    noResults: {
      title: string
      description: string
      buttonText: string
    }
  }
}

export function ConnectorResultsDisplay({
  loading,
  results,
  wizardState,
  locale,
  onReset,
  translations: t,
}: ResultsDisplayProps) {
  if (loading) {
    return (
      <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
        <CardContent className="py-16 text-center">
          <Loader2 className="h-16 w-16 mx-auto text-blue-600 animate-spin mb-6" />
          <p className="text-xl font-inter font-semibold text-slate-900">
            {t.loading}
          </p>
        </CardContent>
      </Card>
    )
  }

  const hasResults = results.sockets.length > 0 || results.tabs.length > 0 || results.headers.length > 0

  if (!hasResults) {
    return (
      <Card className="shadow-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50" data-aos="fade-up">
        <CardContent className="py-16 text-center">
          <AlertCircle className="h-20 w-20 mx-auto text-amber-600 mb-6" />
          <h3 className="text-2xl font-inter font-bold text-slate-900 mb-3">
            {t.noResults.title}
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            {t.noResults.description}
          </p>
          <Button onClick={onReset} size="lg" variant="outline" className="hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300">
            <RotateCcw className="mr-2 h-5 w-5" />
            {t.noResults.buttonText}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <Card className="shadow-2xl border-2 border-blue-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white" data-aos="fade-up">
        <CardContent className="py-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-inter font-bold mb-3">{t.resultsTitle}</h2>
              <p className="text-blue-100 text-lg">
                {t.basedOn({
                  poleCount: wizardState.poleCount ?? 0,
                  orientation: wizardState.orientation ?? '',
                  applicationType: wizardState.applicationType?.replace('-', ' ') ?? ''
                })}
              </p>
            </div>
            <CheckCircle className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Socket Connectors */}
      {results.sockets.length > 0 && (
        <SectionContainer variant="default" spacing="small" className="px-0">
          <div className="mb-6" data-aos="fade-up">
            <h3 className="text-2xl font-inter font-bold text-slate-900 flex items-center gap-3 mb-3">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                {t.sockets.femaleBadge}
              </Badge>
              {t.sockets.title}
            </h3>
            <p className="text-lg text-slate-600">
              {results.sockets.length === 1
                ? t.sockets.found({ count: results.sockets.length })
                : t.sockets.foundPlural({ count: results.sockets.length })}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.sockets.map((connector, index) => (
              <div data-aos="zoom-in" data-aos-delay={50 * index} key={connector.id}>
                <ConnectorCard connector={connector} locale={locale} />
              </div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Tab Connectors */}
      {results.tabs.length > 0 && (
        <SectionContainer variant="default" spacing="small" className="px-0">
          <div className="mb-6" data-aos="fade-up">
            <h3 className="text-2xl font-inter font-bold text-slate-900 flex items-center gap-3 mb-3">
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-1">
                {t.tabs.maleBadge}
              </Badge>
              {t.tabs.title}
            </h3>
            <p className="text-lg text-slate-600">
              {results.tabs.length === 1
                ? t.tabs.found({ count: results.tabs.length })
                : t.tabs.foundPlural({ count: results.tabs.length })}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.tabs.map((connector, index) => (
              <div data-aos="zoom-in" data-aos-delay={50 * index} key={connector.id}>
                <ConnectorCard connector={connector} locale={locale} />
              </div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* PCB Headers */}
      {results.headers.length > 0 && (
        <SectionContainer variant="default" spacing="small" className="px-0">
          <div className="mb-6" data-aos="fade-up">
            <h3 className="text-2xl font-inter font-bold text-slate-900 flex items-center gap-3 mb-3">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1">
                {t.headers.pcbBadge}
              </Badge>
              {t.headers.title}
            </h3>
            <p className="text-lg text-slate-600">
              {results.headers.length === 1
                ? t.headers.found({ count: results.headers.length })
                : t.headers.foundPlural({ count: results.headers.length })}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.headers.map((connector, index) => (
              <div data-aos="zoom-in" data-aos-delay={50 * index} key={connector.id}>
                <ConnectorCard connector={connector} locale={locale} />
              </div>
            ))}
          </div>
        </SectionContainer>
      )}
    </div>
  )
}
