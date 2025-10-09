'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { Button } from '@/components/ui/button'
import { WizardProgressBar } from '@/components/content/WizardProgressBar'
import {
  Step1ApplicationType,
  Step2PoleCount,
  Step3Orientation,
  Step4SpecialRequirements,
  ConnectorResultsDisplay,
} from '@/components/content/wizard'
import { useConnectorWizard } from '@/hooks/useConnectorWizard'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Compass,
  Package,
  Zap,
  ArrowUpDown,
  Settings,
  CheckCircle,
  ArrowRight,
  Info,
} from 'lucide-react'

export default function ConnectorGuidePage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('ConnectorGuide')

  const {
    step,
    totalSteps,
    loading,
    results,
    wizardState,
    isStepValid,
    handleNext,
    handleBack,
    handleReset,
    updateState,
  } = useConnectorWizard()

  const stepTitles = [
    t('step1.title'),
    t('step2.title'),
    t('step3.title'),
    t('step4.title'),
    t('step5.resultsTitle')
  ]

  const stepIcons = [Package, Zap, ArrowUpDown, Settings, CheckCircle]

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
      <WizardProgressBar
        currentStep={step}
        totalSteps={totalSteps}
        stepTitles={stepTitles}
        stepIcons={stepIcons}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Application Type */}
        {step === 1 && (
          <Step1ApplicationType
            selectedValue={wizardState.applicationType}
            onValueChange={(value) => updateState({ applicationType: value })}
            translations={{
              title: t('step1.title'),
              description: t('step1.description'),
              wireToWire: {
                title: t('step1.wireToWire.title'),
                description: t('step1.wireToWire.description'),
                socketBadge: t('step1.wireToWire.socketBadge'),
                tabBadge: t('step1.wireToWire.tabBadge'),
              },
              wireToBoard: {
                title: t('step1.wireToBoard.title'),
                description: t('step1.wireToBoard.description'),
                socketBadge: t('step1.wireToBoard.socketBadge'),
                pcbBadge: t('step1.wireToBoard.pcbBadge'),
              },
              boardToBoard: {
                title: t('step1.boardToBoard.title'),
                description: t('step1.boardToBoard.description'),
                pcbBadge1: t('step1.boardToBoard.pcbBadge1'),
                pcbBadge2: t('step1.boardToBoard.pcbBadge2'),
              },
            }}
          />
        )}

        {/* Step 2: Pole Count */}
        {step === 2 && (
          <Step2PoleCount
            selectedValue={wizardState.poleCount}
            onValueChange={(value) => updateState({ poleCount: value })}
            translations={{
              title: t('step2.title'),
              description: t('step2.description'),
              pole: t('step2.pole'),
              poles: t('step2.poles'),
            }}
          />
        )}

        {/* Step 3: Orientation */}
        {step === 3 && (
          <Step3Orientation
            selectedValue={wizardState.orientation}
            onValueChange={(value) => updateState({ orientation: value })}
            translations={{
              title: t('step3.title'),
              description: t('step3.description'),
              horizontal: {
                title: t('step3.horizontal.title'),
                description: t('step3.horizontal.description'),
              },
              vertical: {
                title: t('step3.vertical.title'),
                description: t('step3.vertical.description'),
              },
              either: {
                title: t('step3.either.title'),
                description: t('step3.either.description'),
              },
            }}
          />
        )}

        {/* Step 4: Special Requirements */}
        {step === 4 && (
          <Step4SpecialRequirements
            wizardState={wizardState}
            onUpdate={updateState}
            translations={{
              title: t('step4.title'),
              description: t('step4.description'),
              locking: {
                title: t('step4.locking.title'),
                description: t('step4.locking.description'),
              },
              specialVersion: {
                title: t('step4.specialVersion.title'),
                description: t('step4.specialVersion.description'),
              },
              keying: {
                title: t('step4.keying.title'),
                description: t('step4.keying.description'),
              },
              infoMessage: t('step4.infoMessage'),
            }}
          />
        )}

        {/* Step 5: Results */}
        {step === 5 && (
          <ConnectorResultsDisplay
            loading={loading}
            results={results}
            wizardState={wizardState}
            locale={locale}
            onReset={handleReset}
            translations={{
              loading: t('step5.loading'),
              resultsTitle: t('step5.resultsTitle'),
              basedOn: (params) => t('step5.basedOn', params),
              sockets: {
                femaleBadge: t('step5.sockets.femaleBadge'),
                title: t('step5.sockets.title'),
                found: (params) => t('step5.sockets.found', params),
                foundPlural: (params) => t('step5.sockets.foundPlural', params),
              },
              tabs: {
                maleBadge: t('step5.tabs.maleBadge'),
                title: t('step5.tabs.title'),
                found: (params) => t('step5.tabs.found', params),
                foundPlural: (params) => t('step5.tabs.foundPlural', params),
              },
              headers: {
                pcbBadge: t('step5.headers.pcbBadge'),
                title: t('step5.headers.title'),
                found: (params) => t('step5.headers.found', params),
                foundPlural: (params) => t('step5.headers.foundPlural', params),
              },
              noResults: {
                title: t('step5.noResults.title'),
                description: t('step5.noResults.description'),
                buttonText: t('step5.noResults.buttonText'),
              },
            }}
          />
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
