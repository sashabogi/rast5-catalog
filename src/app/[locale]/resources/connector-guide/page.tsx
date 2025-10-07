'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase/client'
import { Connector } from '@/types/database'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
  Package,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  Play,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

// Types for wizard state
type ApplicationType = 'wire-to-wire' | 'wire-to-board' | 'board-to-board' | null
type Orientation = 'horizontal' | 'vertical' | 'either' | null

interface WizardState {
  applicationType: ApplicationType
  poleCount: number | null
  orientation: Orientation
  requiresLocking: boolean
  specialVersion: boolean
  specificKeying: boolean
}

interface ConnectorResults {
  sockets: Connector[]
  tabs: Connector[]
  headers: Connector[]
}

export default function ConnectorGuidePage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('ConnectorGuide')

  const [step, setStep] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<ConnectorResults>({ sockets: [], tabs: [], headers: [] })
  const [wizardState, setWizardState] = useState<WizardState>({
    applicationType: null,
    poleCount: null,
    orientation: null,
    requiresLocking: false,
    specialVersion: false,
    specificKeying: false
  })

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  // Check if current step is valid
  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return wizardState.applicationType !== null
      case 2:
        return wizardState.poleCount !== null
      case 3:
        return wizardState.orientation !== null
      case 4:
        return true // Optional step, always valid
      default:
        return true
    }
  }

  // Fetch results based on wizard selections
  const fetchResults = async () => {
    setLoading(true)
    try {
      const { poleCount, orientation, applicationType } = wizardState

      // Build base query
      let socketQuery = supabase
        .from('connectors')
        .select('*')
        .eq('gender', 'Female')
        .eq('pole_count', poleCount!)
        .order('model')

      let tabQuery = supabase
        .from('connectors')
        .select('*')
        .eq('gender', 'Male')
        .eq('pole_count', poleCount!)
        .order('model')

      let headerQuery = supabase
        .from('connectors')
        .select('*')
        .eq('gender', 'PCB')
        .eq('pole_count', poleCount!)
        .order('model')

      // Apply orientation filter
      if (orientation && orientation !== 'either') {
        const orientationValue = orientation.charAt(0).toUpperCase() + orientation.slice(1)
        socketQuery = socketQuery.eq('orientation', orientationValue)
        tabQuery = tabQuery.eq('orientation', orientationValue)
        headerQuery = headerQuery.eq('orientation', orientationValue)
      }

      // Apply special version filter
      if (wizardState.specialVersion) {
        socketQuery = socketQuery.eq('is_special_version', true)
        tabQuery = tabQuery.eq('is_special_version', true)
        headerQuery = headerQuery.eq('is_special_version', true)
      }

      // Fetch based on application type
      let sockets: Connector[] = []
      let tabs: Connector[] = []
      let headers: Connector[] = []

      switch (applicationType) {
        case 'wire-to-wire':
          const [socketResult, tabResult] = await Promise.all([
            socketQuery,
            tabQuery
          ])
          sockets = socketResult.data || []
          tabs = tabResult.data || []
          break

        case 'wire-to-board':
          const [socketResult2, headerResult] = await Promise.all([
            socketQuery,
            headerQuery
          ])
          sockets = socketResult2.data || []
          headers = headerResult.data || []
          break

        case 'board-to-board':
          const headerResult2 = await headerQuery
          headers = headerResult2.data || []
          break
      }

      setResults({ sockets, tabs, headers })
    } catch (error) {
      console.error('Error fetching connectors:', error)
    } finally {
      setLoading(false)
    }
  }

  // Navigate to next step
  const handleNext = async () => {
    if (!isStepValid()) return

    if (step < totalSteps) {
      if (step === 4) {
        // Before moving to results, fetch data
        await fetchResults()
      }
      setStep(step + 1)
    }
  }

  // Navigate to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Reset wizard
  const handleReset = () => {
    setWizardState({
      applicationType: null,
      poleCount: null,
      orientation: null,
      requiresLocking: false,
      specialVersion: false,
      specificKeying: false
    })
    setStep(1)
    setResults({ sockets: [], tabs: [], headers: [] })
  }

  // Update wizard state
  const updateState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('pageTitle')}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {t('pageDescription')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('progress.step')} {step} {t('progress.of')} {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% {t('progress.complete')}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Application Type */}
        {step === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t('step1.title')}</CardTitle>
              <CardDescription>
                {t('step1.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={wizardState.applicationType || ''}
                onValueChange={(value) => updateState({ applicationType: value as ApplicationType })}
              >
                <div className="grid gap-4">
                  {/* Wire-to-Wire */}
                  <div
                    className={`flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardState.applicationType === 'wire-to-wire'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateState({ applicationType: 'wire-to-wire' })}
                  >
                    <RadioGroupItem value="wire-to-wire" id="wire-to-wire" />
                    <div className="flex-1">
                      <Label htmlFor="wire-to-wire" className="text-lg font-semibold cursor-pointer">
                        {t('step1.wireToWire.title')}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('step1.wireToWire.description')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{t('step1.wireToWire.socketBadge')}</Badge>
                        <Badge variant="outline">{t('step1.wireToWire.tabBadge')}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Wire-to-Board */}
                  <div
                    className={`flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardState.applicationType === 'wire-to-board'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateState({ applicationType: 'wire-to-board' })}
                  >
                    <RadioGroupItem value="wire-to-board" id="wire-to-board" />
                    <div className="flex-1">
                      <Label htmlFor="wire-to-board" className="text-lg font-semibold cursor-pointer">
                        {t('step1.wireToBoard.title')}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('step1.wireToBoard.description')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{t('step1.wireToBoard.socketBadge')}</Badge>
                        <Badge variant="outline">{t('step1.wireToBoard.pcbBadge')}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Board-to-Board */}
                  <div
                    className={`flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardState.applicationType === 'board-to-board'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateState({ applicationType: 'board-to-board' })}
                  >
                    <RadioGroupItem value="board-to-board" id="board-to-board" />
                    <div className="flex-1">
                      <Label htmlFor="board-to-board" className="text-lg font-semibold cursor-pointer">
                        {t('step1.boardToBoard.title')}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('step1.boardToBoard.description')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{t('step1.boardToBoard.pcbBadge1')}</Badge>
                        <Badge variant="outline">{t('step1.boardToBoard.pcbBadge2')}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pole Count */}
        {step === 2 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t('step2.title')}</CardTitle>
              <CardDescription>
                {t('step2.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={wizardState.poleCount?.toString() || ''}
                onValueChange={(value) => updateState({ poleCount: parseInt(value) })}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                    <div
                      key={count}
                      className={`relative flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        wizardState.poleCount === count
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateState({ poleCount: count })}
                    >
                      <RadioGroupItem
                        value={count.toString()}
                        id={`pole-${count}`}
                        className="absolute top-2 right-2"
                      />
                      <div className="text-center">
                        <Zap className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                        <Label
                          htmlFor={`pole-${count}`}
                          className="text-2xl font-bold cursor-pointer"
                        >
                          {count}
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          {count === 1 ? t('step2.pole') : t('step2.poles')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Orientation */}
        {step === 3 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t('step3.title')}</CardTitle>
              <CardDescription>
                {t('step3.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={wizardState.orientation || ''}
                onValueChange={(value) => updateState({ orientation: value as Orientation })}
              >
                <div className="grid gap-4">
                  {/* Horizontal */}
                  <div
                    className={`flex items-start space-x-4 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardState.orientation === 'horizontal'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateState({ orientation: 'horizontal' })}
                  >
                    <RadioGroupItem value="horizontal" id="horizontal" />
                    <div className="flex-1">
                      <Label htmlFor="horizontal" className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                        <ArrowUpDown className="h-5 w-5 rotate-90" />
                        {t('step3.horizontal.title')}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('step3.horizontal.description')}
                      </p>
                    </div>
                  </div>

                  {/* Vertical */}
                  <div
                    className={`flex items-start space-x-4 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardState.orientation === 'vertical'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateState({ orientation: 'vertical' })}
                  >
                    <RadioGroupItem value="vertical" id="vertical" />
                    <div className="flex-1">
                      <Label htmlFor="vertical" className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                        <ArrowUpDown className="h-5 w-5" />
                        {t('step3.vertical.title')}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('step3.vertical.description')}
                      </p>
                    </div>
                  </div>

                  {/* Either */}
                  <div
                    className={`flex items-start space-x-4 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardState.orientation === 'either'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateState({ orientation: 'either' })}
                  >
                    <RadioGroupItem value="either" id="either" />
                    <div className="flex-1">
                      <Label htmlFor="either" className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {t('step3.either.title')}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('step3.either.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Special Requirements */}
        {step === 4 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t('step4.title')}</CardTitle>
              <CardDescription>
                {t('step4.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Locking Mechanism */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="locking"
                  checked={wizardState.requiresLocking}
                  onCheckedChange={(checked) =>
                    updateState({ requiresLocking: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="locking" className="text-base font-semibold cursor-pointer">
                    {t('step4.locking.title')}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('step4.locking.description')}
                  </p>
                </div>
              </div>

              {/* Special Version */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="special"
                  checked={wizardState.specialVersion}
                  onCheckedChange={(checked) =>
                    updateState({ specialVersion: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="special" className="text-base font-semibold cursor-pointer">
                    {t('step4.specialVersion.title')}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('step4.specialVersion.description')}
                  </p>
                </div>
              </div>

              {/* Specific Keying */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="keying"
                  checked={wizardState.specificKeying}
                  onCheckedChange={(checked) =>
                    updateState({ specificKeying: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="keying" className="text-base font-semibold cursor-pointer">
                    {t('step4.keying.title')}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('step4.keying.description')}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {t('step4.infoMessage')}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Results */}
        {step === 5 && (
          <div className="space-y-8">
            {loading ? (
              <Card className="shadow-lg">
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto text-blue-600 animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    {t('step5.loading')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results Header */}
                <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{t('step5.resultsTitle')}</h2>
                        <p className="text-blue-100">
                          {t('step5.basedOn', {
                            poleCount: wizardState.poleCount ?? 0,
                            orientation: wizardState.orientation ?? '',
                            applicationType: wizardState.applicationType?.replace('-', ' ') ?? ''
                          })}
                        </p>
                      </div>
                      <CheckCircle className="h-12 w-12" />
                    </div>
                  </CardContent>
                </Card>

                {/* Socket Connectors */}
                {results.sockets.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Badge className="bg-blue-500 text-white">{t('step5.sockets.femaleBadge')}</Badge>
                        {t('step5.sockets.title')}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {results.sockets.length === 1
                          ? t('step5.sockets.found', { count: results.sockets.length })
                          : t('step5.sockets.foundPlural', { count: results.sockets.length })}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.sockets.map((connector) => (
                        <ConnectorCard key={connector.id} connector={connector} locale={locale} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab Connectors */}
                {results.tabs.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Badge className="bg-orange-500 text-white">{t('step5.tabs.maleBadge')}</Badge>
                        {t('step5.tabs.title')}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {results.tabs.length === 1
                          ? t('step5.tabs.found', { count: results.tabs.length })
                          : t('step5.tabs.foundPlural', { count: results.tabs.length })}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.tabs.map((connector) => (
                        <ConnectorCard key={connector.id} connector={connector} locale={locale} />
                      ))}
                    </div>
                  </div>
                )}

                {/* PCB Headers */}
                {results.headers.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Badge className="bg-green-500 text-white">{t('step5.headers.pcbBadge')}</Badge>
                        {t('step5.headers.title')}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {results.headers.length === 1
                          ? t('step5.headers.found', { count: results.headers.length })
                          : t('step5.headers.foundPlural', { count: results.headers.length })}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.headers.map((connector) => (
                        <ConnectorCard key={connector.id} connector={connector} locale={locale} />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {results.sockets.length === 0 &&
                  results.tabs.length === 0 &&
                  results.headers.length === 0 && (
                    <Card className="shadow-lg border-amber-200 bg-amber-50">
                      <CardContent className="py-12 text-center">
                        <AlertCircle className="h-16 w-16 mx-auto text-amber-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {t('step5.noResults.title')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {t('step5.noResults.description')}
                        </p>
                        <Button onClick={handleReset} variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          {t('step5.noResults.buttonText')}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              size="lg"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('navigation.back')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              size="lg"
            >
              {step === 4 ? t('navigation.showResults') : t('navigation.next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Results Navigation */}
        {step === 5 && (
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} size="lg">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('navigation.refineSelection')}
            </Button>
            <Button onClick={handleReset} size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('navigation.startOver')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Connector Result Card Component
interface ConnectorCardProps {
  connector: Connector
  locale: string
}

function ConnectorCard({ connector, locale }: ConnectorCardProps) {
  const t = useTranslations('ConnectorGuide.connectorCard')

  const genderColor =
    connector.gender === 'Female'
      ? 'bg-blue-500'
      : connector.gender === 'Male'
      ? 'bg-orange-500'
      : 'bg-green-500'

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
      <Link href={`/${locale}/connector/${connector.id}`}>
        {/* Video Thumbnail */}
        <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
          <video
            src={connector.video_360_url}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge className="bg-white/90 text-black">
              <Play className="h-3 w-3 mr-1" />
              {t('view360')}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {connector.model}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {connector.display_name ||
              t('poleConnector', { count: connector.pole_count, gender: connector.gender })}
          </p>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={`${genderColor} text-white`}>{connector.gender}</Badge>
            <Badge variant="outline">
              <Zap className="h-3 w-3 mr-1" />
              {t('poleLabel', { count: connector.pole_count })}
            </Badge>
            {connector.orientation && (
              <Badge variant="secondary">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                {connector.orientation}
              </Badge>
            )}
          </div>

          {/* Special Notes */}
          {connector.is_special_version && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-xs text-amber-800 font-medium">{t('specialVersion')}</p>
            </div>
          )}

          {/* View Details Button */}
          <Button variant="outline" className="w-full mt-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
            {t('viewDetails')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
