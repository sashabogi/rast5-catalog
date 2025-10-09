'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Cable, Wrench, Settings, Zap, CheckCircle2, AlertTriangle } from 'lucide-react'

const stepIcons = {
  step1: Cable,
  step2: Wrench,
  step3: Settings,
  step4: Zap,
  step5: CheckCircle2,
}

const stepColors = {
  step1: 'blue',
  step2: 'orange',
  step3: 'green',
  step4: 'purple',
  step5: 'indigo',
}

interface InstallationStepsProps {
  namespace?: string
}

export function InstallationSteps({ namespace = 'InstallationGuide' }: InstallationStepsProps) {
  const t = useTranslations(namespace)

  const installationSteps = [
    { id: 'step1', badge: t('steps.step1.badge'), title: t('steps.step1.title') },
    { id: 'step2', badge: t('steps.step2.badge'), title: t('steps.step2.title') },
    { id: 'step3', badge: t('steps.step3.badge'), title: t('steps.step3.title') },
    { id: 'step4', badge: t('steps.step4.badge'), title: t('steps.step4.title') },
    { id: 'step5', badge: t('steps.step5.badge'), title: t('steps.step5.title') },
  ]

  return (
    <Card className="border-2 border-slate-200" data-aos="fade-up">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-inter font-bold text-slate-900">
          {t('steps.title')}
        </CardTitle>
        <CardDescription className="text-base text-slate-600">
          {t('steps.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-4">
          {installationSteps.map((step, index) => {
            const StepIcon = stepIcons[step.id as keyof typeof stepIcons]
            const color = stepColors[step.id as keyof typeof stepColors]

            return (
              <AccordionItem
                key={step.id}
                value={step.id}
                className="border-2 rounded-xl px-6 hover:shadow-lg transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-600 to-${color}-700 flex items-center justify-center`}
                    >
                      <StepIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <Badge className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {step.badge}
                      </Badge>
                      <span className="block font-inter font-bold text-lg text-slate-900">
                        {step.title}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <StepContent stepId={step.id} t={t} />
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}

// Individual step content component
function StepContent({ stepId, t }: { stepId: string; t: ReturnType<typeof useTranslations> }) {
  // Render different content based on step ID
  const renderStepSpecificContent = () => {
    switch (stepId) {
      case 'step1':
        return <Step1Content t={t} />
      case 'step2':
        return <Step2Content t={t} />
      case 'step3':
        return <Step3Content t={t} />
      case 'step4':
        return <Step4Content t={t} />
      case 'step5':
        return <Step5Content t={t} />
      default:
        return null
    }
  }

  return <div className="space-y-6">{renderStepSpecificContent()}</div>
}

// Step 1: Terminal Selection
function Step1Content({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6">
      {/* Understanding Terminal Types */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h4 className="font-inter font-bold text-lg mb-4 text-slate-900">
          {t('steps.step1.understandingTypes.title')}
        </h4>
        <p className="text-slate-700 mb-4">{t('steps.step1.understandingTypes.description')}</p>
        <div className="grid gap-3">
          {Object.keys(t.raw('steps.step1.understandingTypes.types')).map((key) => (
            <div key={key} className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="font-inter font-bold text-blue-600">{key}:</span>{' '}
              <span className="text-slate-700">{t(`steps.step1.understandingTypes.types.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wire Gauge Compatibility Table */}
      <div className="p-6 bg-white rounded-xl border-2 border-slate-200">
        <h4 className="font-inter font-bold text-lg mb-4 text-slate-900">
          {t('steps.step1.wireGaugeCompatibility.title')}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-inter font-bold text-slate-900">
                  {t('steps.step1.wireGaugeCompatibility.table.headers.awg')}
                </th>
                <th className="text-left py-3 px-4 font-inter font-bold text-slate-900">
                  {t('steps.step1.wireGaugeCompatibility.table.headers.mm')}
                </th>
                <th className="text-left py-3 px-4 font-inter font-bold text-slate-900">
                  {t('steps.step1.wireGaugeCompatibility.table.headers.compatible')}
                </th>
              </tr>
            </thead>
            <tbody>
              {['1', '2', '3'].map((rowNum) => (
                <tr key={rowNum} className="border-b border-slate-200">
                  <td className="py-3 px-4 font-inter text-slate-700">
                    {t(`steps.step1.wireGaugeCompatibility.table.rows.${rowNum}.awg`)}
                  </td>
                  <td className="py-3 px-4 font-inter text-slate-700">
                    {t(`steps.step1.wireGaugeCompatibility.table.rows.${rowNum}.mm`)}
                  </td>
                  <td className="py-3 px-4 font-inter text-slate-700">
                    {t(`steps.step1.wireGaugeCompatibility.table.rows.${rowNum}.compatible`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-inter font-bold text-yellow-900 mb-2">
              {t('steps.step1.important.title')}
            </h5>
            <p className="text-sm text-yellow-800">{t('steps.step1.important.message')}</p>
          </div>
        </div>
      </div>

      {/* Selection Checklist */}
      <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
        <h5 className="font-inter font-bold text-green-900 mb-3">
          {t('steps.step1.checklist.title')}
        </h5>
        <ul className="space-y-2">
          {['1', '2', '3', '4'].map((num) => (
            <li key={num} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-700">{t(`steps.step1.checklist.items.${num}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Step 2: Wire Preparation
function Step2Content({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6">
      {/* Strip Length */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
        <h4 className="font-inter font-bold text-lg mb-4 text-slate-900">
          {t('steps.step2.stripLength.title')}
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="text-2xl font-inter font-bold text-orange-600 mb-1">
              {t('steps.step2.stripLength.recommended')}
            </div>
            <div className="text-sm text-slate-600">{t('steps.step2.stripLength.recommendedLabel')}</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="text-2xl font-inter font-bold text-orange-600 mb-1">
              {t('steps.step2.stripLength.imperial')}
            </div>
            <div className="text-sm text-slate-600">{t('steps.step2.stripLength.imperialLabel')}</div>
          </div>
        </div>
      </div>

      {/* Preparation Steps */}
      <div className="space-y-3">
        <h4 className="font-inter font-bold text-lg text-slate-900">
          {t('steps.step2.preparationSteps.title')}
        </h4>
        {['1', '2', '3', '4', '5'].map((num) => (
          <div key={num} className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center text-sm font-inter font-bold flex-shrink-0">
                {num}
              </div>
              <div>
                <h5 className="font-inter font-semibold text-slate-900 mb-1">
                  {t(`steps.step2.preparationSteps.items.${num}.title`)}
                </h5>
                <p className="text-sm text-slate-600">
                  {t(`steps.step2.preparationSteps.items.${num}.description`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Good vs Bad Strip */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 bg-green-50 border-2 border-green-200 rounded-xl">
          <h5 className="font-inter font-bold text-green-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {t('steps.step2.goodStrip.title')}
          </h5>
          <ul className="space-y-2 text-sm text-slate-700">
            {['1', '2', '3', '4'].map((num) => (
              <li key={num} className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                {t(`steps.step2.goodStrip.items.${num}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 bg-red-50 border-2 border-red-200 rounded-xl">
          <h5 className="font-inter font-bold text-red-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('steps.step2.badStrip.title')}
          </h5>
          <ul className="space-y-2 text-sm text-slate-700">
            {['1', '2', '3', '4'].map((num) => (
              <li key={num} className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                {t(`steps.step2.badStrip.items.${num}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Step 3: Terminal Crimping - This is the most detailed step
function Step3Content({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [activeTab, setActiveTab] = useState<'good' | 'bad'>('good')

  return (
    <div className="space-y-6">
      {/* Critical Quality Notice */}
      <div className="p-5 bg-red-50 border-2 border-red-300 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-inter font-bold text-red-900 mb-2">
              {t('steps.step3.criticalQuality.title')}
            </h4>
            <p className="text-sm text-red-800">{t('steps.step3.criticalQuality.message')}</p>
          </div>
        </div>
      </div>

      {/* Tool Selection */}
      <div className="space-y-3">
        <h4 className="font-inter font-bold text-lg text-slate-900">
          {t('steps.step3.toolSelection.title')}
        </h4>
        <div className="grid gap-3">
          <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <h5 className="font-inter font-semibold text-green-900 mb-1">
              {t('steps.step3.toolSelection.recommended.title')}
            </h5>
            <p className="text-sm text-slate-700">
              {t('steps.step3.toolSelection.recommended.description')}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <h5 className="font-inter font-semibold text-yellow-900 mb-1">
              {t('steps.step3.toolSelection.acceptable.title')}
            </h5>
            <p className="text-sm text-slate-700">
              {t('steps.step3.toolSelection.acceptable.description')}
            </p>
          </div>
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <h5 className="font-inter font-semibold text-red-900 mb-1">
              {t('steps.step3.toolSelection.notRecommended.title')}
            </h5>
            <p className="text-sm text-slate-700">
              {t('steps.step3.toolSelection.notRecommended.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Crimping Procedure */}
      <div className="space-y-3">
        <h4 className="font-inter font-bold text-lg text-slate-900">
          {t('steps.step3.procedure.title')}
        </h4>
        {['1', '2', '3', '4', '5'].map((num) => (
          <div key={num} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-sm font-inter font-bold flex-shrink-0">
                {num}
              </div>
              <div>
                <h5 className="font-inter font-semibold text-slate-900 mb-1">
                  {t(`steps.step3.procedure.items.${num}.title`)}
                </h5>
                <p className="text-sm text-slate-600">
                  {t(`steps.step3.procedure.items.${num}.description`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Crimp Quality Inspection with Tabs */}
      <div className="p-6 bg-white border-2 border-slate-200 rounded-xl">
        <h4 className="font-inter font-bold text-lg mb-4 text-slate-900">
          {t('steps.step3.inspection.title')}
        </h4>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('good')}
            className={`px-4 py-2 rounded-lg font-inter font-semibold transition-colors ${
              activeTab === 'good'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('steps.step3.inspection.tabs.good')}
          </button>
          <button
            onClick={() => setActiveTab('bad')}
            className={`px-4 py-2 rounded-lg font-inter font-semibold transition-colors ${
              activeTab === 'bad'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('steps.step3.inspection.tabs.bad')}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'good' ? (
          <div className="space-y-3">
            <h5 className="font-inter font-bold text-green-900">
              {t('steps.step3.inspection.goodCrimp.title')}
            </h5>
            <ul className="space-y-2">
              {['1', '2', '3', '4', '5', '6'].map((num) => (
                <li key={num} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {t(`steps.step3.inspection.goodCrimp.items.${num}`)}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-slate-700 italic">
                <strong>Tip:</strong> {t('steps.step3.inspection.goodCrimp.tip')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h5 className="font-inter font-bold text-red-900">
              {t('steps.step3.inspection.badCrimp.title')}
            </h5>
            <ul className="space-y-2">
              {['1', '2', '3', '4', '5', '6'].map((num) => (
                <li key={num} className="flex items-start gap-2 text-sm text-slate-700">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {t(`steps.step3.inspection.badCrimp.items.${num}`)}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                {t('steps.step3.inspection.badCrimp.warning')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pull Test */}
      <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl">
        <h4 className="font-inter font-bold text-indigo-900 mb-3">
          {t('steps.step3.pullTest.title')}
        </h4>
        <p className="text-sm text-slate-700 mb-3">{t('steps.step3.pullTest.description')}</p>
        <ul className="space-y-1 text-sm text-slate-700">
          {['1', '2', '3', '4'].map((num) => (
            <li key={num}>{t(`steps.step3.pullTest.steps.${num}`)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Step 4: Terminal Insertion
function Step4Content({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6">
      {/* Orientation Verification */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
          {t('steps.step4.orientationVerification.title')}
        </h4>
        <p className="text-slate-700 mb-3">{t('steps.step4.orientationVerification.description')}</p>
        <ul className="space-y-2">
          {['1', '2', '3'].map((num) => (
            <li key={num} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              {t(`steps.step4.orientationVerification.items.${num}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Insertion Procedure */}
      <div className="space-y-3">
        <h4 className="font-inter font-bold text-lg text-slate-900">
          {t('steps.step4.procedure.title')}
        </h4>
        {['1', '2', '3', '4', '5'].map((num) => (
          <div key={num} className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-inter font-semibold text-slate-900 mb-1">
                  {t(`steps.step4.procedure.items.${num}.title`)}
                </h5>
                <p className="text-sm text-slate-600">
                  {t(`steps.step4.procedure.items.${num}.description`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Common Problems */}
      <div className="space-y-3">
        <h4 className="font-inter font-bold text-lg text-slate-900">
          {t('steps.step4.commonProblems.title')}
        </h4>
        {['problem1', 'problem2', 'problem3'].map((problem) => (
          <div key={problem} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="font-inter font-semibold text-yellow-900 mb-1">
              {t(`steps.step4.commonProblems.${problem}.title`)}
            </h5>
            <p className="text-sm text-slate-700">
              {t(`steps.step4.commonProblems.${problem}.solution`)}
            </p>
          </div>
        ))}
      </div>

      {/* Terminal Removal Warning */}
      <div className="p-5 bg-red-50 border-2 border-red-200 rounded-xl">
        <h4 className="font-inter font-bold text-red-900 mb-3">
          {t('steps.step4.terminalRemoval.title')}
        </h4>
        <p className="text-sm text-slate-700 mb-3">{t('steps.step4.terminalRemoval.description')}</p>
        <ul className="space-y-2 text-sm text-slate-700 mb-3">
          {['1', '2', '3', '4'].map((num) => (
            <li key={num} className="flex items-start gap-2">
              <span className="text-red-600 font-bold">{num}.</span>
              {t(`steps.step4.terminalRemoval.steps.${num}`)}
            </li>
          ))}
        </ul>
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-900 font-semibold">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            {t('steps.step4.terminalRemoval.warning')}
          </p>
        </div>
      </div>
    </div>
  )
}

// Step 5: Connector Assembly
function Step5Content({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6">
      {/* Keying Verification */}
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
        <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
          {t('steps.step5.keyingVerification.title')}
        </h4>
        <p className="text-slate-700 mb-3">{t('steps.step5.keyingVerification.description')}</p>
        <ul className="space-y-2">
          {['1', '2', '3'].map((num) => (
            <li key={num} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              {t(`steps.step5.keyingVerification.items.${num}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Housing Alignment */}
      <div className="space-y-3">
        <h4 className="font-inter font-bold text-lg text-slate-900">
          {t('steps.step5.housingAlignment.title')}
        </h4>
        {['1', '2', '3', '4'].map((num) => (
          <div key={num} className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-sm font-inter font-bold flex-shrink-0">
                {num}
              </div>
              <div>
                <h5 className="font-inter font-semibold text-slate-900 mb-1">
                  {t(`steps.step5.housingAlignment.items.${num}.title`)}
                </h5>
                <p className="text-sm text-slate-600">
                  {t(`steps.step5.housingAlignment.items.${num}.description`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strain Relief */}
      <div className="p-6 bg-white border-2 border-slate-200 rounded-xl">
        <h4 className="font-inter font-bold text-lg mb-4 text-slate-900">
          {t('steps.step5.strainRelief.title')}
        </h4>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-inter font-semibold text-blue-900 mb-2">
              {t('steps.step5.strainRelief.why.title')}
            </h5>
            <ul className="space-y-1 text-sm text-slate-700">
              {['1', '2', '3', '4'].map((num) => (
                <li key={num}>{t(`steps.step5.strainRelief.why.items.${num}`)}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="font-inter font-semibold text-green-900 mb-2">
              {t('steps.step5.strainRelief.methods.title')}
            </h5>
            <ul className="space-y-1 text-sm text-slate-700">
              {['1', '2', '3', '4'].map((num) => (
                <li key={num}>{t(`steps.step5.strainRelief.methods.items.${num}`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Final Checklist */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
        <h4 className="font-inter font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6" />
          {t('steps.step5.finalChecklist.title')}
        </h4>
        <ul className="space-y-2">
          {['1', '2', '3', '4', '5', '6', '7'].map((num) => (
            <li key={num} className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-green-600 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700 font-inter">
                {t(`steps.step5.finalChecklist.items.${num}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
