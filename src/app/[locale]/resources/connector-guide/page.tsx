'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
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
  Loader2,
  Compass,
  Cable,
  CircuitBoard,
  Settings,
  Shield,
  Info,
  ArrowRight
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

  const stepTitles = [
    t('step1.title'),
    t('step2.title'),
    t('step3.title'),
    t('step4.title'),
    t('step5.resultsTitle')
  ]

  const stepIcons = [
    Package,
    Zap,
    ArrowUpDown,
    Settings,
    CheckCircle
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <PageHero
        title={
          <span className="font-inter font-bold">
            {t('pageTitle')}
          </span>
        }
        subtitle={t('pageDescription')}
        icon={
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
            <Compass className="w-10 h-10 text-white" />
          </div>
        }
        isDark={true}
      />

      {/* Progress Indicator */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Steps Navigation */}
          <div className="flex items-center justify-between mb-6">
            {stepTitles.map((title, index) => {
              const Icon = stepIcons[index]
              const isActive = index + 1 === step
              const isCompleted = index + 1 < step

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    index < stepTitles.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-green-600'
                          : 'bg-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <Icon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div
                        className={`absolute top-1/2 left-full w-full h-1 -translate-y-1/2 transition-all duration-500 ${
                          isCompleted ? 'bg-green-600' : 'bg-slate-300'
                        }`}
                        style={{ width: 'calc(100% - 3rem)' }}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-3 text-xs font-inter font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <Progress value={progress} className="h-3 bg-slate-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-inter font-bold text-white mix-blend-difference">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Application Type */}
        {step === 1 && (
          <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
              <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                {t('step1.title')}
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 mt-2">
                {t('step1.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <RadioGroup
                value={wizardState.applicationType || ''}
                onValueChange={(value) => updateState({ applicationType: value as ApplicationType })}
              >
                <div className="grid gap-6">
                  {/* Wire-to-Wire */}
                  <div
                    className={`group relative flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      wizardState.applicationType === 'wire-to-wire'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                    onClick={() => updateState({ applicationType: 'wire-to-wire' })}
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <RadioGroupItem value="wire-to-wire" id="wire-to-wire" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Label htmlFor="wire-to-wire" className="text-xl font-inter font-bold cursor-pointer text-slate-900">
                            {t('step1.wireToWire.title')}
                          </Label>
                          <p className="text-base text-slate-600 mt-2">
                            {t('step1.wireToWire.description')}
                          </p>
                        </div>
                        <Cable className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Badge variant="outline" className="bg-white">
                          {t('step1.wireToWire.socketBadge')}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {t('step1.wireToWire.tabBadge')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Wire-to-Board */}
                  <div
                    className={`group relative flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      wizardState.applicationType === 'wire-to-board'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                    onClick={() => updateState({ applicationType: 'wire-to-board' })}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <RadioGroupItem value="wire-to-board" id="wire-to-board" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Label htmlFor="wire-to-board" className="text-xl font-inter font-bold cursor-pointer text-slate-900">
                            {t('step1.wireToBoard.title')}
                          </Label>
                          <p className="text-base text-slate-600 mt-2">
                            {t('step1.wireToBoard.description')}
                          </p>
                        </div>
                        <CircuitBoard className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Badge variant="outline" className="bg-white">
                          {t('step1.wireToBoard.socketBadge')}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {t('step1.wireToBoard.pcbBadge')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Board-to-Board */}
                  <div
                    className={`group relative flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      wizardState.applicationType === 'board-to-board'
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                        : 'border-slate-200 hover:border-green-300 bg-white'
                    }`}
                    onClick={() => updateState({ applicationType: 'board-to-board' })}
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <RadioGroupItem value="board-to-board" id="board-to-board" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Label htmlFor="board-to-board" className="text-xl font-inter font-bold cursor-pointer text-slate-900">
                            {t('step1.boardToBoard.title')}
                          </Label>
                          <p className="text-base text-slate-600 mt-2">
                            {t('step1.boardToBoard.description')}
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Badge variant="outline" className="bg-white">
                          {t('step1.boardToBoard.pcbBadge1')}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {t('step1.boardToBoard.pcbBadge2')}
                        </Badge>
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
          <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50 border-b-2 border-slate-200">
              <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                {t('step2.title')}
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 mt-2">
                {t('step2.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <RadioGroup
                value={wizardState.poleCount?.toString() || ''}
                onValueChange={(value) => updateState({ poleCount: parseInt(value) })}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                    <div
                      key={count}
                      className={`group relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                        wizardState.poleCount === count
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg scale-105'
                          : 'border-slate-200 hover:border-orange-300 bg-white'
                      }`}
                      onClick={() => updateState({ poleCount: count })}
                      data-aos="zoom-in"
                      data-aos-delay={50 * count}
                    >
                      <RadioGroupItem
                        value={count.toString()}
                        id={`pole-${count}`}
                        className="absolute top-3 right-3"
                      />
                      <Zap className="h-10 w-10 mb-3 text-orange-600 group-hover:scale-110 transition-transform" />
                      <span className="text-3xl font-inter font-bold text-slate-900">
                        {count}
                      </span>
                      <span className="text-sm text-slate-600 mt-1">
                        {count === 1 ? t('step2.pole') : t('step2.poles')}
                      </span>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Orientation */}
        {step === 3 && (
          <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b-2 border-slate-200">
              <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                {t('step3.title')}
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 mt-2">
                {t('step3.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <RadioGroup
                value={wizardState.orientation || ''}
                onValueChange={(value) => updateState({ orientation: value as Orientation })}
              >
                <div className="grid gap-6">
                  {/* Horizontal */}
                  <div
                    className={`group flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      wizardState.orientation === 'horizontal'
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                        : 'border-slate-200 hover:border-green-300 bg-white'
                    }`}
                    onClick={() => updateState({ orientation: 'horizontal' })}
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <RadioGroupItem value="horizontal" id="horizontal" className="mt-1" />
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <Label htmlFor="horizontal" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-3">
                          <ArrowUpDown className="h-6 w-6 rotate-90 text-green-600" />
                          {t('step3.horizontal.title')}
                        </Label>
                        <p className="text-base text-slate-600 mt-2">
                          {t('step3.horizontal.description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical */}
                  <div
                    className={`group flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      wizardState.orientation === 'vertical'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                    onClick={() => updateState({ orientation: 'vertical' })}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <RadioGroupItem value="vertical" id="vertical" className="mt-1" />
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <Label htmlFor="vertical" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-3">
                          <ArrowUpDown className="h-6 w-6 text-blue-600" />
                          {t('step3.vertical.title')}
                        </Label>
                        <p className="text-base text-slate-600 mt-2">
                          {t('step3.vertical.description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Either */}
                  <div
                    className={`group flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      wizardState.orientation === 'either'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                    onClick={() => updateState({ orientation: 'either' })}
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <RadioGroupItem value="either" id="either" className="mt-1" />
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <Label htmlFor="either" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-3">
                          <Package className="h-6 w-6 text-purple-600" />
                          {t('step3.either.title')}
                        </Label>
                        <p className="text-base text-slate-600 mt-2">
                          {t('step3.either.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Special Requirements */}
        {step === 4 && (
          <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b-2 border-slate-200">
              <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                {t('step4.title')}
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 mt-2">
                {t('step4.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Locking Mechanism */}
              <div
                className="group flex items-start space-x-4 p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <Checkbox
                  id="locking"
                  checked={wizardState.requiresLocking}
                  onCheckedChange={(checked) =>
                    updateState({ requiresLocking: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="locking" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    {t('step4.locking.title')}
                  </Label>
                  <p className="text-base text-slate-600 mt-2">
                    {t('step4.locking.description')}
                  </p>
                </div>
              </div>

              {/* Special Version */}
              <div
                className="group flex items-start space-x-4 p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <Checkbox
                  id="special"
                  checked={wizardState.specialVersion}
                  onCheckedChange={(checked) =>
                    updateState({ specialVersion: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="special" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    {t('step4.specialVersion.title')}
                  </Label>
                  <p className="text-base text-slate-600 mt-2">
                    {t('step4.specialVersion.description')}
                  </p>
                </div>
              </div>

              {/* Specific Keying */}
              <div
                className="group flex items-start space-x-4 p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-green-300 bg-gradient-to-br from-white to-green-50"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <Checkbox
                  id="keying"
                  checked={wizardState.specificKeying}
                  onCheckedChange={(checked) =>
                    updateState({ specificKeying: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="keying" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    {t('step4.keying.title')}
                  </Label>
                  <p className="text-base text-slate-600 mt-2">
                    {t('step4.keying.description')}
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200" data-aos="fade-up" data-aos-delay="400">
                <p className="text-base text-blue-800 flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
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
              <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
                <CardContent className="py-16 text-center">
                  <Loader2 className="h-16 w-16 mx-auto text-blue-600 animate-spin mb-6" />
                  <p className="text-xl font-inter font-semibold text-slate-900">
                    {t('step5.loading')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results Header */}
                <Card className="shadow-2xl border-2 border-blue-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white" data-aos="fade-up">
                  <CardContent className="py-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-inter font-bold mb-3">{t('step5.resultsTitle')}</h2>
                        <p className="text-blue-100 text-lg">
                          {t('step5.basedOn', {
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
                          {t('step5.sockets.femaleBadge')}
                        </Badge>
                        {t('step5.sockets.title')}
                      </h3>
                      <p className="text-lg text-slate-600">
                        {results.sockets.length === 1
                          ? t('step5.sockets.found', { count: results.sockets.length })
                          : t('step5.sockets.foundPlural', { count: results.sockets.length })}
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
                          {t('step5.tabs.maleBadge')}
                        </Badge>
                        {t('step5.tabs.title')}
                      </h3>
                      <p className="text-lg text-slate-600">
                        {results.tabs.length === 1
                          ? t('step5.tabs.found', { count: results.tabs.length })
                          : t('step5.tabs.foundPlural', { count: results.tabs.length })}
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
                          {t('step5.headers.pcbBadge')}
                        </Badge>
                        {t('step5.headers.title')}
                      </h3>
                      <p className="text-lg text-slate-600">
                        {results.headers.length === 1
                          ? t('step5.headers.found', { count: results.headers.length })
                          : t('step5.headers.foundPlural', { count: results.headers.length })}
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

                {/* No Results */}
                {results.sockets.length === 0 &&
                  results.tabs.length === 0 &&
                  results.headers.length === 0 && (
                    <Card className="shadow-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50" data-aos="fade-up">
                      <CardContent className="py-16 text-center">
                        <AlertCircle className="h-20 w-20 mx-auto text-amber-600 mb-6" />
                        <h3 className="text-2xl font-inter font-bold text-slate-900 mb-3">
                          {t('step5.noResults.title')}
                        </h3>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                          {t('step5.noResults.description')}
                        </p>
                        <Button onClick={handleReset} size="lg" variant="outline" className="hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300">
                          <RotateCcw className="mr-2 h-5 w-5" />
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
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              size="lg"
              className="hover:bg-slate-100 transition-all duration-300"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              {t('navigation.back')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300"
            >
              {step === 4 ? t('navigation.showResults') : t('navigation.next')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Results Navigation */}
        {step === 5 && (
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={handleBack}
              size="lg"
              className="hover:bg-slate-100 transition-all duration-300"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              {t('navigation.refineSelection')}
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              {t('navigation.startOver')}
            </Button>
          </div>
        )}
      </div>

      {/* Help Section */}
      <SectionContainer variant="dark" spacing="medium">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-inter font-bold text-white mb-6">
            Need Assistance?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Our technical experts are here to help you find the perfect connector solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Contact Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              View Documentation
              <Info className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </SectionContainer>
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
      ? 'from-blue-600 to-indigo-600'
      : connector.gender === 'Male'
      ? 'from-orange-600 to-red-600'
      : 'from-green-600 to-emerald-600'

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-slate-200 hover:border-blue-400">
      <Link href={`/${locale}/connector/${connector.id}`}>
        {/* Video Thumbnail */}
        <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
          <video
            src={connector.video_360_url}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="bg-white/95 text-black shadow-lg">
              <Play className="h-3 w-3 mr-1" />
              {t('view360')}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6">
          <h4 className="font-inter font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
            {connector.model}
          </h4>
          <p className="text-base text-slate-600 mb-4">
            {connector.display_name ||
              t('poleConnector', { count: connector.pole_count, gender: connector.gender })}
          </p>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`bg-gradient-to-r ${genderColor} text-white`}>
              {connector.gender}
            </Badge>
            <Badge variant="outline" className="border-slate-300">
              <Zap className="h-3 w-3 mr-1" />
              {t('poleLabel', { count: connector.pole_count })}
            </Badge>
            {connector.orientation && (
              <Badge variant="secondary" className="bg-slate-100">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                {connector.orientation}
              </Badge>
            )}
          </div>

          {/* Special Notes */}
          {connector.is_special_version && (
            <div className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl">
              <p className="text-sm text-amber-800 font-inter font-semibold">
                {t('specialVersion')}
              </p>
            </div>
          )}

          {/* View Details Button */}
          <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
            {t('viewDetails')}
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}