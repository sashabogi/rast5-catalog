'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Home,
  ChevronRight,
  Wrench,
  Eye,
  Shield,
  ThermometerSun,
  Activity,
  HelpCircle,
  BookOpen,
  Cable,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

export default function InstallationPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('InstallationGuide')

  // Checklist state for interactive tracking
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'tools', label: t('sidebar.installationChecklist.items.tools'), checked: false },
    { id: 'safety', label: t('sidebar.installationChecklist.items.safety'), checked: false },
    { id: 'terminal-selection', label: t('sidebar.installationChecklist.items.terminal-selection'), checked: false },
    { id: 'wire-prep', label: t('sidebar.installationChecklist.items.wire-prep'), checked: false },
    { id: 'crimping', label: t('sidebar.installationChecklist.items.crimping'), checked: false },
    { id: 'insertion', label: t('sidebar.installationChecklist.items.insertion'), checked: false },
    { id: 'assembly', label: t('sidebar.installationChecklist.items.assembly'), checked: false },
    { id: 'inspection', label: t('sidebar.installationChecklist.items.inspection'), checked: false },
  ])

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const completionPercentage = Math.round(
    (checklist.filter((item) => item.checked).length / checklist.length) * 100
  )

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-orange-100 mb-4 print:hidden">
            <Link href={`/${locale}/resources`} className="hover:text-white transition-colors">
              {t('hero.breadcrumb.resources')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{t('hero.breadcrumb.current')}</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex items-center gap-4 mt-6 print:hidden">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {t('hero.badges.version')}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {t('hero.badges.lastUpdated')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                {t('quickActions.printGuide')}
              </Button>
              <Button variant="outline" asChild>
                <a href="#" download>
                  <Download className="mr-2 h-4 w-4" />
                  {t('quickActions.downloadPdf')}
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{t('quickActions.progress')}</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Critical Safety Warning */}
            <Card className="border-red-300 bg-red-50">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">
                      {t('safetyWarning.title')}
                    </h3>
                    <ul className="space-y-2 text-red-900">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <li key={num} className="flex items-start gap-2">
                          <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{t(`safetyWarning.items.${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Wrench className="h-7 w-7 text-orange-600" />
                  {t('gettingStarted.title')}
                </CardTitle>
                <CardDescription>
                  {t('gettingStarted.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">{t('gettingStarted.requiredTools.title')}</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div key={num} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{t(`gettingStarted.requiredTools.items.${num}.name`)}</p>
                          <p className="text-sm text-gray-600">
                            {t(`gettingStarted.requiredTools.items.${num}.description`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">{t('gettingStarted.workspaceSetup.title')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    {[1, 2, 3, 4].map((num) => (
                      <li key={num} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {num}
                        </div>
                        <span>{t(`gettingStarted.workspaceSetup.items.${num}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step-by-Step Installation Process */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('steps.title')}</CardTitle>
                <CardDescription>
                  {t('steps.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {/* Step 1: Terminal Selection */}
                  <AccordionItem value="step1" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">{t('steps.step1.badge')}</Badge>
                        <span className="font-semibold text-lg">{t('steps.step1.title')}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {t('steps.step1.understandingTypes.title')}
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">
                          {t('steps.step1.understandingTypes.description')}
                        </p>
                        <div className="grid gap-2">
                          {['FR', 'FT', 'VR', 'VT', 'VS', 'PC'].map((type) => (
                            <div key={type} className="bg-white p-3 rounded">
                              <p className="font-medium">
                                {t(`steps.step1.understandingTypes.types.${type}`)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('steps.step1.wireGaugeCompatibility.title')}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="border p-2 text-left">{t('steps.step1.wireGaugeCompatibility.table.headers.awg')}</th>
                                <th className="border p-2 text-left">{t('steps.step1.wireGaugeCompatibility.table.headers.mm')}</th>
                                <th className="border p-2 text-left">{t('steps.step1.wireGaugeCompatibility.table.headers.compatible')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[1, 2, 3].map((row, index) => (
                                <tr key={row} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                                  <td className="border p-2">{t(`steps.step1.wireGaugeCompatibility.table.rows.${row}.awg`)}</td>
                                  <td className="border p-2">{t(`steps.step1.wireGaugeCompatibility.table.rows.${row}.mm`)}</td>
                                  <td className="border p-2">{t(`steps.step1.wireGaugeCompatibility.table.rows.${row}.compatible`)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-1">{t('steps.step1.important.title')}</h4>
                            <p className="text-sm text-amber-800">
                              {t('steps.step1.important.message')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('steps.step1.checklist.title')}</h4>
                        <ul className="space-y-2">
                          {[1, 2, 3, 4].map((num) => (
                            <li key={num} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                              <span>{t(`steps.step1.checklist.items.${num}`)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 2: Wire Preparation */}
                  <AccordionItem value="step2" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">{t('steps.step2.badge')}</Badge>
                        <span className="font-semibold text-lg">{t('steps.step2.title')}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step2.stripLength.title')}</h4>
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-lg border">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-2xl font-bold text-orange-600">{t('steps.step2.stripLength.recommended')}</p>
                              <p className="text-sm text-gray-600">
                                {t('steps.step2.stripLength.recommendedLabel')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-orange-600">
                                {t('steps.step2.stripLength.imperial')}
                              </p>
                              <p className="text-sm text-gray-600">{t('steps.step2.stripLength.imperialLabel')}</p>
                            </div>
                          </div>
                          <div className="relative h-16 bg-white rounded border-2 border-gray-300">
                            <div className="absolute left-0 top-0 h-full w-1/3 bg-orange-200 flex items-center justify-center">
                              <span className="text-xs font-medium">{t('steps.step2.stripLength.diagram.insulation')}</span>
                            </div>
                            <div className="absolute left-1/3 top-0 h-full w-2/3 bg-orange-400 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {t('steps.step2.stripLength.diagram.strippedConductor')}
                              </span>
                            </div>
                            <div className="absolute left-1/3 top-0 h-full border-l-2 border-dashed border-red-500" />
                            <div className="absolute left-1/3 -top-6 text-xs font-medium text-red-600">
                              {t('steps.step2.stripLength.diagram.stripHere')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('steps.step2.preparationSteps.title')}</h4>
                        <ol className="space-y-3">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <li key={num} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                {num}
                              </div>
                              <div>
                                <p className="font-medium">{t(`steps.step2.preparationSteps.items.${num}.title`)}</p>
                                <p className="text-sm text-gray-600">
                                  {t(`steps.step2.preparationSteps.items.${num}.description`)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-green-900 mb-2">{t('steps.step2.goodStrip.title')}</h4>
                              <ul className="text-sm text-green-800 space-y-1">
                                {[1, 2, 3, 4].map((num) => (
                                  <li key={num}>{t(`steps.step2.goodStrip.items.${num}`)}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-red-900 mb-2">{t('steps.step2.badStrip.title')}</h4>
                              <ul className="text-sm text-red-800 space-y-1">
                                {[1, 2, 3, 4].map((num) => (
                                  <li key={num}>{t(`steps.step2.badStrip.items.${num}`)}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 3: Terminal Crimping */}
                  <AccordionItem value="step3" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">{t('steps.step3.badge')}</Badge>
                        <span className="font-semibold text-lg">{t('steps.step3.title')}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          {t('steps.step3.criticalQuality.title')}
                        </h4>
                        <p className="text-sm text-orange-800">
                          {t('steps.step3.criticalQuality.message')}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step3.toolSelection.title')}</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">{t('steps.step3.toolSelection.recommended.title')}</p>
                            <p className="text-sm text-gray-600">
                              {t('steps.step3.toolSelection.recommended.description')}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">
                              {t('steps.step3.toolSelection.acceptable.title')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {t('steps.step3.toolSelection.acceptable.description')}
                            </p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="font-medium mb-1 text-red-900">
                              {t('steps.step3.toolSelection.notRecommended.title')}
                            </p>
                            <p className="text-sm text-red-800">
                              {t('steps.step3.toolSelection.notRecommended.description')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('steps.step3.procedure.title')}</h4>
                        <ol className="space-y-3">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <li key={num} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                {num}
                              </div>
                              <div>
                                <p className="font-medium">{t(`steps.step3.procedure.items.${num}.title`)}</p>
                                <p className="text-sm text-gray-600">
                                  {t(`steps.step3.procedure.items.${num}.description`)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step3.inspection.title')}</h4>
                        <Tabs defaultValue="good" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="good" className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              {t('steps.step3.inspection.tabs.good')}
                            </TabsTrigger>
                            <TabsTrigger value="bad" className="flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              {t('steps.step3.inspection.tabs.bad')}
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="good" className="space-y-3 mt-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h5 className="font-semibold text-green-900 mb-3">
                                {t('steps.step3.inspection.goodCrimp.title')}
                              </h5>
                              <ul className="space-y-2 text-sm text-green-800">
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                  <li key={num} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{t(`steps.step3.inspection.goodCrimp.items.${num}`)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="text-sm text-blue-900 flex items-start gap-2">
                                <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{t('steps.step3.inspection.goodCrimp.tip')}</span>
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="bad" className="space-y-3 mt-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h5 className="font-semibold text-red-900 mb-3">
                                {t('steps.step3.inspection.badCrimp.title')}
                              </h5>
                              <ul className="space-y-2 text-sm text-red-800">
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                  <li key={num} className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{t(`steps.step3.inspection.badCrimp.items.${num}`)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <p className="text-sm text-amber-900 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{t('steps.step3.inspection.badCrimp.warning')}</span>
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div className="bg-gray-50 border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{t('steps.step3.pullTest.title')}</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          {t('steps.step3.pullTest.description')}
                        </p>
                        <ol className="text-sm text-gray-700 space-y-1">
                          {[1, 2, 3, 4].map((num) => (
                            <li key={num}>{t(`steps.step3.pullTest.steps.${num}`)}</li>
                          ))}
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 4: Terminal Insertion */}
                  <AccordionItem value="step4" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">{t('steps.step4.badge')}</Badge>
                        <span className="font-semibold text-lg">{t('steps.step4.title')}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step4.orientationVerification.title')}</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900 mb-3">
                            {t('steps.step4.orientationVerification.description')}
                          </p>
                          <ul className="space-y-2 text-sm text-blue-800">
                            {[1, 2, 3].map((num) => (
                              <li key={num} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{t(`steps.step4.orientationVerification.items.${num}`)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('steps.step4.procedure.title')}</h4>
                        <ol className="space-y-3">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <li key={num} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                {num}
                              </div>
                              <div>
                                <p className="font-medium">{t(`steps.step4.procedure.items.${num}.title`)}</p>
                                <p className="text-sm text-gray-600">
                                  {t(`steps.step4.procedure.items.${num}.description`)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          {t('steps.step4.commonProblems.title')}
                        </h4>
                        <div className="space-y-3 text-sm text-amber-900">
                          {[1, 2, 3].map((num) => (
                            <div key={num}>
                              <p className="font-medium">{t(`steps.step4.commonProblems.problem${num}.title`)}</p>
                              <p className="text-amber-800">
                                {t(`steps.step4.commonProblems.problem${num}.solution`)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step4.terminalRemoval.title')}</h4>
                        <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                          <p className="text-sm text-gray-700">
                            {t('steps.step4.terminalRemoval.description')}
                          </p>
                          <ol className="text-sm text-gray-700 space-y-2">
                            {[1, 2, 3, 4].map((num) => (
                              <li key={num} className="flex items-start gap-2">
                                <span className="font-medium">{num}.</span>
                                <span>{t(`steps.step4.terminalRemoval.steps.${num}`)}</span>
                              </li>
                            ))}
                          </ol>
                          <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                            <p className="text-sm text-red-900 flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{t('steps.step4.terminalRemoval.warning')}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 5: Connector Assembly */}
                  <AccordionItem value="step5" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">{t('steps.step5.badge')}</Badge>
                        <span className="font-semibold text-lg">{t('steps.step5.title')}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step5.keyingVerification.title')}</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900 mb-3">
                            {t('steps.step5.keyingVerification.description')}
                          </p>
                          <ul className="space-y-2 text-sm text-blue-800">
                            {[1, 2, 3].map((num) => (
                              <li key={num} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{t(`steps.step5.keyingVerification.items.${num}`)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('steps.step5.housingAlignment.title')}</h4>
                        <ol className="space-y-3">
                          {[1, 2, 3, 4].map((num) => (
                            <li key={num} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                {num}
                              </div>
                              <div>
                                <p className="font-medium">{t(`steps.step5.housingAlignment.items.${num}.title`)}</p>
                                <p className="text-sm text-gray-600">
                                  {t(`steps.step5.housingAlignment.items.${num}.description`)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step5.strainRelief.title')}</h4>
                        <div className="grid gap-3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium mb-2">{t('steps.step5.strainRelief.why.title')}</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {[1, 2, 3, 4].map((num) => (
                                <li key={num}>{t(`steps.step5.strainRelief.why.items.${num}`)}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium mb-2">{t('steps.step5.strainRelief.methods.title')}</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {[1, 2, 3, 4].map((num) => (
                                <li key={num}>{t(`steps.step5.strainRelief.methods.items.${num}`)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t('steps.step5.finalChecklist.title')}</h4>
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                          <ul className="space-y-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                              <li key={num} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{t(`steps.step5.finalChecklist.items.${num}`)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Advanced Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <BookOpen className="h-7 w-7 text-purple-600" />
                  {t('advancedTopics.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {/* Sealed Connectors */}
                  <AccordionItem value="sealed" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold">{t('advancedTopics.sealedConnectors.title')}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <p className="text-gray-700">
                        {t('advancedTopics.sealedConnectors.description')}
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <li key={num} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {num}
                            </div>
                            <span>{t(`advancedTopics.sealedConnectors.steps.${num}`)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <p className="text-sm text-blue-900">
                          {t('advancedTopics.sealedConnectors.note')}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* High Vibration */}
                  <AccordionItem value="vibration" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        {t('advancedTopics.highVibration.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <p className="text-gray-700">
                        {t('advancedTopics.highVibration.description')}
                      </p>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">{t('advancedTopics.highVibration.connectorSelection.title')}</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {[1, 2, 3].map((num) => (
                              <li key={num}>{t(`advancedTopics.highVibration.connectorSelection.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">{t('advancedTopics.highVibration.bestPractices.title')}</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <li key={num}>{t(`advancedTopics.highVibration.bestPractices.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">{t('advancedTopics.highVibration.maintenance.title')}</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {[1, 2, 3].map((num) => (
                              <li key={num}>{t(`advancedTopics.highVibration.maintenance.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Temperature */}
                  <AccordionItem value="temperature" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold flex items-center gap-2">
                        <ThermometerSun className="h-5 w-5" />
                        {t('advancedTopics.temperature.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-900 mb-3">
                          {t('advancedTopics.temperature.standardRating')}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-semibold mb-2">{t('advancedTopics.temperature.highTemp.title')}</h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <li key={num}>{t(`advancedTopics.temperature.highTemp.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">{t('advancedTopics.temperature.lowTemp.title')}</h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            {[1, 2, 3, 4].map((num) => (
                              <li key={num}>{t(`advancedTopics.temperature.lowTemp.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">{t('advancedTopics.temperature.thermalCycling.title')}</h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            {[1, 2, 3, 4].map((num) => (
                              <li key={num}>{t(`advancedTopics.temperature.thermalCycling.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          {t('advancedTopics.temperature.note')}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Maintenance */}
                  <AccordionItem value="maintenance" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold">{t('advancedTopics.maintenanceSchedules.title')}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <p className="text-gray-700">
                        {t('advancedTopics.maintenanceSchedules.description')}
                      </p>

                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="font-semibold text-green-900 mb-2">
                            {t('advancedTopics.maintenanceSchedules.initial.title')}
                          </h5>
                          <ul className="text-sm text-green-800 space-y-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <li key={num}>{t(`advancedTopics.maintenanceSchedules.initial.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-900 mb-2">
                            {t('advancedTopics.maintenanceSchedules.periodic.title')}
                          </h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <li key={num}>{t(`advancedTopics.maintenanceSchedules.periodic.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-900 mb-2">
                            {t('advancedTopics.maintenanceSchedules.harsh.title')}
                          </h5>
                          <ul className="text-sm text-purple-800 space-y-1">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <li key={num}>{t(`advancedTopics.maintenanceSchedules.harsh.items.${num}`)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h5 className="font-semibold text-amber-900 mb-2">
                          {t('advancedTopics.maintenanceSchedules.warningSigns.title')}
                        </h5>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <li key={num}>{t(`advancedTopics.maintenanceSchedules.warningSigns.items.${num}`)}</li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <HelpCircle className="h-7 w-7 text-red-600" />
                  {t('troubleshooting.title')}
                </CardTitle>
                <CardDescription>
                  {t('troubleshooting.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Problems 1-6 */}
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-red-900 mb-2">
                        {t(`troubleshooting.problem${num}.title`)}
                      </h4>
                      <div className="ml-4 space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t(`troubleshooting.problem${num}.causes.title`)}</p>
                          <ul className="text-sm text-gray-600 ml-4">
                            {[1, 2, 3, 4, 5, 6].map((item) => {
                              const text = t(`troubleshooting.problem${num}.causes.items.${item}`)
                              // Filter out missing translations (next-intl returns key name for missing keys)
                              if (text.startsWith('InstallationGuide.')) return null
                              return <li key={item}>{text}</li>
                            }).filter(Boolean)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700">{t(`troubleshooting.problem${num}.solutions.title`)}</p>
                          <ul className="text-sm text-gray-600 ml-4">
                            {[1, 2, 3, 4, 5, 6].map((item) => {
                              const text = t(`troubleshooting.problem${num}.solutions.items.${item}`)
                              // Filter out missing translations (next-intl returns key name for missing keys)
                              if (text.startsWith('InstallationGuide.')) return null
                              return <li key={item}>{text}</li>
                            }).filter(Boolean)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    {t('troubleshooting.stillHavingProblems.title')}
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    {t('troubleshooting.stillHavingProblems.description')}
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 mb-3">
                    {[1, 2, 3, 4].map((num) => (
                      <li key={num}>{t(`troubleshooting.stillHavingProblems.items.${num}`)}</li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-2" asChild>
                    <a href="#contact">
                      {t('troubleshooting.stillHavingProblems.contactSupport')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Checklist */}
            <Card className="sticky top-4 print:hidden">
              <CardHeader>
                <CardTitle className="text-lg">{t('sidebar.installationChecklist.title')}</CardTitle>
                <CardDescription>{t('sidebar.installationChecklist.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer flex-1 ${
                        item.checked ? 'line-through text-gray-500' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="print:hidden">
              <CardHeader>
                <CardTitle className="text-lg">{t('sidebar.quickLinks.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/${locale}/resources`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>{t('sidebar.quickLinks.allResources')}</span>
                </Link>
                <Link
                  href={`/${locale}/resources/connector-guide`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <Cable className="h-4 w-4 text-gray-500" />
                  <span>{t('sidebar.quickLinks.connectorGuide')}</span>
                </Link>
                <a
                  href="#contact"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                  <span>{t('sidebar.quickLinks.technicalSupport')}</span>
                </a>
              </CardContent>
            </Card>

            {/* Quality Standards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('sidebar.qualityStandards.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">{t('sidebar.qualityStandards.compliantWith')}</p>
                  <ul className="text-gray-600 space-y-1">
                    {[1, 2, 3, 4].map((num) => (
                      <li key={num}>{t(`sidebar.qualityStandards.items.${num}`)}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Version Info */}
            <Card>
              <CardContent className="py-4 text-xs text-gray-500">
                <p className="mb-1">
                  <strong>{t('sidebar.versionInfo.documentVersion')}</strong> {t('sidebar.versionInfo.version')}
                </p>
                <p className="mb-1">
                  <strong>{t('sidebar.versionInfo.lastUpdated')}</strong> {t('sidebar.versionInfo.lastUpdatedDate')}
                </p>
                <p>
                  <strong>{t('sidebar.versionInfo.nextReview')}</strong> {t('sidebar.versionInfo.nextReviewDate')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div id="contact" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{t('contactSupport.title')}</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('contactSupport.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary">
                <HelpCircle className="mr-2 h-5 w-5" />
                {t('contactSupport.buttons.contactSupport')}
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                <Download className="mr-2 h-5 w-5" />
                {t('contactSupport.buttons.downloadDocumentation')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
