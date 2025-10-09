'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase/client'
import { Terminal } from '@/types/database'
import {
  Cable,
  Zap,
  CircuitBoard,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  WrenchIcon,
  ShieldCheck,
  Gauge,
  Ruler,
  ChevronRight,
  BookOpen,
  Cpu,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Terminal suffix explanations - function that takes translation function
const getTerminalSuffixes = (t: ReturnType<typeof useTranslations>) => [
  {
    suffix: 'FR',
    name: t('terminalTypes.socket.FR.name'),
    category: 'socket',
    description: t('terminalTypes.socket.FR.description'),
    applications: [
      t('terminalTypes.socket.FR.applications.1'),
      t('terminalTypes.socket.FR.applications.2'),
      t('terminalTypes.socket.FR.applications.3')
    ],
    wireGauge: t('terminalTypes.socket.FR.wireGauge'),
    currentRating: t('terminalTypes.socket.FR.currentRating'),
    features: [
      t('terminalTypes.socket.FR.features.1'),
      t('terminalTypes.socket.FR.features.2'),
      t('terminalTypes.socket.FR.features.3')
    ]
  },
  {
    suffix: 'VR',
    name: t('terminalTypes.socket.VR.name'),
    category: 'socket',
    description: t('terminalTypes.socket.VR.description'),
    applications: [
      t('terminalTypes.socket.VR.applications.1'),
      t('terminalTypes.socket.VR.applications.2'),
      t('terminalTypes.socket.VR.applications.3')
    ],
    wireGauge: t('terminalTypes.socket.VR.wireGauge'),
    currentRating: t('terminalTypes.socket.VR.currentRating'),
    features: [
      t('terminalTypes.socket.VR.features.1'),
      t('terminalTypes.socket.VR.features.2'),
      t('terminalTypes.socket.VR.features.3')
    ]
  },
  {
    suffix: 'VS',
    name: t('terminalTypes.socket.VS.name'),
    category: 'socket',
    description: t('terminalTypes.socket.VS.description'),
    applications: [
      t('terminalTypes.socket.VS.applications.1'),
      t('terminalTypes.socket.VS.applications.2'),
      t('terminalTypes.socket.VS.applications.3')
    ],
    wireGauge: t('terminalTypes.socket.VS.wireGauge'),
    currentRating: t('terminalTypes.socket.VS.currentRating'),
    features: [
      t('terminalTypes.socket.VS.features.1'),
      t('terminalTypes.socket.VS.features.2'),
      t('terminalTypes.socket.VS.features.3')
    ]
  },
  {
    suffix: 'VT',
    name: t('terminalTypes.tab.VT.name'),
    category: 'tab',
    description: t('terminalTypes.tab.VT.description'),
    applications: [
      t('terminalTypes.tab.VT.applications.1'),
      t('terminalTypes.tab.VT.applications.2'),
      t('terminalTypes.tab.VT.applications.3')
    ],
    wireGauge: t('terminalTypes.tab.VT.wireGauge'),
    currentRating: t('terminalTypes.tab.VT.currentRating'),
    features: [
      t('terminalTypes.tab.VT.features.1'),
      t('terminalTypes.tab.VT.features.2'),
      t('terminalTypes.tab.VT.features.3')
    ]
  },
  {
    suffix: 'FT',
    name: t('terminalTypes.tab.FT.name'),
    category: 'tab',
    description: t('terminalTypes.tab.FT.description'),
    applications: [
      t('terminalTypes.tab.FT.applications.1'),
      t('terminalTypes.tab.FT.applications.2'),
      t('terminalTypes.tab.FT.applications.3')
    ],
    wireGauge: t('terminalTypes.tab.FT.wireGauge'),
    currentRating: t('terminalTypes.tab.FT.currentRating'),
    features: [
      t('terminalTypes.tab.FT.features.1'),
      t('terminalTypes.tab.FT.features.2'),
      t('terminalTypes.tab.FT.features.3')
    ]
  },
  {
    suffix: 'PC',
    name: t('terminalTypes.pcb.PC.name'),
    category: 'pcb',
    description: t('terminalTypes.pcb.PC.description'),
    applications: [
      t('terminalTypes.pcb.PC.applications.1'),
      t('terminalTypes.pcb.PC.applications.2'),
      t('terminalTypes.pcb.PC.applications.3')
    ],
    wireGauge: t('terminalTypes.pcb.PC.wireGauge'),
    currentRating: t('terminalTypes.pcb.PC.currentRating'),
    features: [
      t('terminalTypes.pcb.PC.features.1'),
      t('terminalTypes.pcb.PC.features.2'),
      t('terminalTypes.pcb.PC.features.3')
    ]
  }
]

// Technical specifications - function that takes translation function
const getTechnicalSpecs = (t: ReturnType<typeof useTranslations>) => [
  {
    icon: Gauge,
    title: t('technicalSpecs.currentRating.title'),
    value: t('technicalSpecs.currentRating.value'),
    description: t('technicalSpecs.currentRating.description')
  },
  {
    icon: Zap,
    title: t('technicalSpecs.voltageRating.title'),
    value: t('technicalSpecs.voltageRating.value'),
    description: t('technicalSpecs.voltageRating.description')
  },
  {
    icon: Ruler,
    title: t('technicalSpecs.wireRange.title'),
    value: t('technicalSpecs.wireRange.value'),
    description: t('technicalSpecs.wireRange.description')
  },
  {
    icon: ShieldCheck,
    title: t('technicalSpecs.contactMaterial.title'),
    value: t('technicalSpecs.contactMaterial.value'),
    description: t('technicalSpecs.contactMaterial.description')
  }
]

// Installation steps - function that takes translation function
const getInstallationSteps = (t: ReturnType<typeof useTranslations>) => [
  {
    step: 1,
    title: t('installation.steps.1.title'),
    description: t('installation.steps.1.description'),
    warning: t('installation.steps.1.warning')
  },
  {
    step: 2,
    title: t('installation.steps.2.title'),
    description: t('installation.steps.2.description'),
    warning: t('installation.steps.2.warning')
  },
  {
    step: 3,
    title: t('installation.steps.3.title'),
    description: t('installation.steps.3.description'),
    warning: t('installation.steps.3.warning')
  },
  {
    step: 4,
    title: t('installation.steps.4.title'),
    description: t('installation.steps.4.description'),
    warning: t('installation.steps.4.warning')
  },
  {
    step: 5,
    title: t('installation.steps.5.title'),
    description: t('installation.steps.5.description'),
    warning: t('installation.steps.5.warning')
  }
]

// Common mistakes - function that takes translation function
const getCommonMistakes = (t: ReturnType<typeof useTranslations>) => [
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

export default function TerminalsPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('TerminalsGuide')
  const [terminals, setTerminals] = useState<Terminal[]>([])

  // Initialize translated data
  const TERMINAL_SUFFIXES = getTerminalSuffixes(t)
  const TECHNICAL_SPECS = getTechnicalSpecs(t)
  const INSTALLATION_STEPS = getInstallationSteps(t)
  const COMMON_MISTAKES = getCommonMistakes(t)

  useEffect(() => {
    async function fetchTerminals() {
      const { data, error } = await supabase
        .from('terminals')
        .select('*')
        .order('terminal_type')

      if (error) {
        console.error('Error fetching terminals:', error)
        return
      }

      setTerminals(data as Terminal[])
    }

    fetchTerminals()
  }, [])

  // Group terminals by category
  const terminalsByCategory = {
    socket: terminals.filter(t => ['FR', 'VR', 'VS'].some(type => t.terminal_type.includes(type))),
    tab: terminals.filter(t => ['VT', 'FT'].some(type => t.terminal_type.includes(type))),
    pcb: terminals.filter(t => t.terminal_type.includes('PC'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <PageHero
        title={
          <span className="font-inter font-bold">
            {t('hero.title')}
          </span>
        }
        subtitle={t('hero.description')}
        icon={
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-xl">
            <WrenchIcon className="w-10 h-10 text-white" />
          </div>
        }
        isDark={true}
        actions={
          <>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              {t('hero.exploreButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              {t('hero.installationButton')}
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
          </>
        }
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors font-inter">
              {t('breadcrumb.home')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/resources`} className="hover:text-blue-600 transition-colors font-inter">
              {t('breadcrumb.resources')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-inter font-semibold">{t('breadcrumb.current')}</span>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <SectionContainer variant="gradient" spacing="large">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-inter font-bold text-slate-900 mb-6">
            {t('overview.sectionTitle')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('overview.sectionDescription')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16" data-aos="fade-up" data-aos-delay="100">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4">
                <Cable className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-inter font-bold">{t('overview.whatAreTerminals.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {t('overview.whatAreTerminals.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4">
                <Info className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-inter font-bold">{t('overview.whyDifferentTypes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {t('overview.whyDifferentTypes.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-inter font-bold">{t('overview.namingConvention.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {t('overview.namingConvention.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      {/* Terminal Types - Tabbed Interface */}
      <SectionContainer variant="default" spacing="large">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-inter font-bold text-slate-900 mb-6">
            {t('terminalTypes.sectionTitle')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('terminalTypes.sectionDescription')}
          </p>
        </div>

        <Tabs defaultValue="socket" className="w-full" data-aos="fade-up" data-aos-delay="100">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-auto p-2 bg-slate-100">
            <TabsTrigger
              value="socket"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white py-3 font-inter font-semibold transition-all duration-300"
            >
              <Cable className="h-5 w-5 mr-2" />
              {t('terminalTypes.socketTab')}
            </TabsTrigger>
            <TabsTrigger
              value="tab"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white py-3 font-inter font-semibold transition-all duration-300"
            >
              <Zap className="h-5 w-5 mr-2" />
              {t('terminalTypes.tabTab')}
            </TabsTrigger>
            <TabsTrigger
              value="pcb"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white py-3 font-inter font-semibold transition-all duration-300"
            >
              <CircuitBoard className="h-5 w-5 mr-2" />
              {t('terminalTypes.pcbTab')}
            </TabsTrigger>
          </TabsList>

          {/* Socket Terminals Tab */}
          <TabsContent value="socket" className="space-y-8">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                      {t('terminalTypes.socket.categoryTitle')}
                    </CardTitle>
                    <CardDescription className="text-lg mt-3 text-slate-600">
                      {t('terminalTypes.socket.categoryDescription')}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg px-6 py-2 font-inter font-semibold">
                    {t('terminalTypes.socket.badge')}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-8">
              {TERMINAL_SUFFIXES.filter(t => t.category === 'socket').map((terminal) => (
                <Card key={terminal.suffix} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-slate-200">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className="text-lg px-4 py-1 border-2 border-blue-600 text-blue-700 font-inter font-bold">
                            {terminal.suffix}
                          </Badge>
                          <CardTitle className="text-2xl font-inter font-bold text-slate-900">{terminal.name}</CardTitle>
                        </div>
                        <CardDescription className="text-base text-slate-600">
                          {terminal.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                      {/* Left Column - Specs & Features */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.technicalSpecifications')}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                              <span className="text-sm font-inter font-medium text-slate-600">{t('terminalTypes.labels.wireGauge')}</span>
                              <span className="text-sm font-inter font-bold text-slate-900">{terminal.wireGauge}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                              <span className="text-sm font-inter font-medium text-slate-600">{t('terminalTypes.labels.currentRating')}</span>
                              <span className="text-sm font-inter font-bold text-slate-900">{terminal.currentRating}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.keyFeatures')}
                          </h4>
                          <ul className="space-y-2">
                            {terminal.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-inter text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column - Applications */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.typicalApplications')}
                          </h4>
                          <ul className="space-y-3">
                            {terminal.applications.map((app, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-blue-50 rounded-lg border border-slate-200">
                                <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-inter text-slate-700">{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Terminal Images */}
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.availableTerminals')}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {terminalsByCategory.socket
                              .filter(t => t.terminal_type.includes(terminal.suffix))
                              .slice(0, 4)
                              .map((t) => (
                                <div key={t.id} className="group border-2 border-slate-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 hover:border-blue-400 bg-white">
                                  {t.image_url ? (
                                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg mb-2 relative overflow-hidden">
                                      <Image
                                        src={t.image_url}
                                        alt={t.spec_number}
                                        fill
                                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-blue-100 rounded-lg mb-2 flex items-center justify-center">
                                      <Cable className="h-10 w-10 text-slate-400" />
                                    </div>
                                  )}
                                  <p className="text-xs font-inter font-bold text-center text-slate-700">{t.spec_number}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Terminals Tab */}
          <TabsContent value="tab" className="space-y-8">
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                      {t('terminalTypes.tab.categoryTitle')}
                    </CardTitle>
                    <CardDescription className="text-lg mt-3 text-slate-600">
                      {t('terminalTypes.tab.categoryDescription')}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg px-6 py-2 font-inter font-semibold">
                    {t('terminalTypes.tab.badge')}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-8">
              {TERMINAL_SUFFIXES.filter(t => t.category === 'tab').map((terminal) => (
                <Card key={terminal.suffix} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-slate-200">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50 border-b-2 border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className="text-lg px-4 py-1 border-2 border-orange-600 text-orange-700 font-inter font-bold">
                            {terminal.suffix}
                          </Badge>
                          <CardTitle className="text-2xl font-inter font-bold text-slate-900">{terminal.name}</CardTitle>
                        </div>
                        <CardDescription className="text-base text-slate-600">
                          {terminal.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                      {/* Left Column - Specs & Features */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.technicalSpecifications')}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200">
                              <span className="text-sm font-inter font-medium text-slate-600">{t('terminalTypes.labels.wireGauge')}</span>
                              <span className="text-sm font-inter font-bold text-slate-900">{terminal.wireGauge}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200">
                              <span className="text-sm font-inter font-medium text-slate-600">{t('terminalTypes.labels.currentRating')}</span>
                              <span className="text-sm font-inter font-bold text-slate-900">{terminal.currentRating}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.keyFeatures')}
                          </h4>
                          <ul className="space-y-2">
                            {terminal.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-inter text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column - Applications */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.typicalApplications')}
                          </h4>
                          <ul className="space-y-3">
                            {terminal.applications.map((app, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-orange-50 rounded-lg border border-slate-200">
                                <ArrowRight className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-inter text-slate-700">{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Terminal Images */}
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.availableTerminals')}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {terminalsByCategory.tab
                              .filter(t => t.terminal_type.includes(terminal.suffix))
                              .slice(0, 4)
                              .map((t) => (
                                <div key={t.id} className="group border-2 border-slate-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 hover:border-orange-400 bg-white">
                                  {t.image_url ? (
                                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-orange-50 rounded-lg mb-2 relative overflow-hidden">
                                      <Image
                                        src={t.image_url}
                                        alt={t.spec_number}
                                        fill
                                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-orange-100 rounded-lg mb-2 flex items-center justify-center">
                                      <Zap className="h-10 w-10 text-slate-400" />
                                    </div>
                                  )}
                                  <p className="text-xs font-inter font-bold text-center text-slate-700">{t.spec_number}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PCB Terminals Tab */}
          <TabsContent value="pcb" className="space-y-8">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-inter font-bold text-slate-900">
                      {t('terminalTypes.pcb.categoryTitle')}
                    </CardTitle>
                    <CardDescription className="text-lg mt-3 text-slate-600">
                      {t('terminalTypes.pcb.categoryDescription')}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg px-6 py-2 font-inter font-semibold">
                    {t('terminalTypes.pcb.badge')}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-8">
              {TERMINAL_SUFFIXES.filter(t => t.category === 'pcb').map((terminal) => (
                <Card key={terminal.suffix} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-slate-200">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b-2 border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className="text-lg px-4 py-1 border-2 border-green-600 text-green-700 font-inter font-bold">
                            {terminal.suffix}
                          </Badge>
                          <CardTitle className="text-2xl font-inter font-bold text-slate-900">{terminal.name}</CardTitle>
                        </div>
                        <CardDescription className="text-base text-slate-600">
                          {terminal.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                      {/* Left Column - Specs & Features */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.technicalSpecifications')}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-gradient-to-r from-slate-50 to-green-50 rounded-lg border border-slate-200">
                              <span className="text-sm font-inter font-medium text-slate-600">{t('terminalTypes.labels.connectionType')}</span>
                              <span className="text-sm font-inter font-bold text-slate-900">{terminal.wireGauge}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gradient-to-r from-slate-50 to-green-50 rounded-lg border border-slate-200">
                              <span className="text-sm font-inter font-medium text-slate-600">{t('terminalTypes.labels.currentRating')}</span>
                              <span className="text-sm font-inter font-bold text-slate-900">{terminal.currentRating}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.keyFeatures')}
                          </h4>
                          <ul className="space-y-2">
                            {terminal.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-inter text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column - Applications */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.typicalApplications')}
                          </h4>
                          <ul className="space-y-3">
                            {terminal.applications.map((app, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-green-50 rounded-lg border border-slate-200">
                                <ArrowRight className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-inter text-slate-700">{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Terminal Images */}
                        <div>
                          <h4 className="font-inter font-bold text-base text-slate-800 mb-4">
                            {t('terminalTypes.labels.availableTerminals')}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {terminalsByCategory.pcb
                              .slice(0, 4)
                              .map((t) => (
                                <div key={t.id} className="group border-2 border-slate-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 hover:border-green-400 bg-white">
                                  {t.image_url ? (
                                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-green-50 rounded-lg mb-2 relative overflow-hidden">
                                      <Image
                                        src={t.image_url}
                                        alt={t.spec_number}
                                        fill
                                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-green-100 rounded-lg mb-2 flex items-center justify-center">
                                      <CircuitBoard className="h-10 w-10 text-slate-400" />
                                    </div>
                                  )}
                                  <p className="text-xs font-inter font-bold text-center text-slate-700">{t.spec_number}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SectionContainer>

      {/* Technical Specifications Section */}
      <SectionContainer variant="gradient" spacing="large">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-inter font-bold text-slate-900 mb-6">
            {t('technicalSpecs.sectionTitle')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('technicalSpecs.sectionDescription')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" data-aos="fade-up" data-aos-delay="100">
          {TECHNICAL_SPECS.map((spec, idx) => (
            <Card key={idx} className="group text-center hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 hover:border-blue-400 bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <spec.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-inter font-bold text-lg mb-3 text-slate-900">{spec.title}</h3>
                <p className="text-3xl font-inter font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
                  {spec.value}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{spec.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Technical Details */}
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
      </SectionContainer>

      {/* Installation Guide Section */}
      <SectionContainer variant="default" spacing="large">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-inter font-bold text-slate-900 mb-6">
            {t('installation.sectionTitle')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('installation.sectionDescription')}
          </p>
        </div>

        {/* Required Tools */}
        <Card className="mb-12 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50" data-aos="fade-up">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-inter font-bold text-slate-900">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <WrenchIcon className="h-6 w-6 text-white" />
              </div>
              {t('installation.requiredTools.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
                  {t('installation.requiredTools.crimpingTool.title')}
                </h4>
                <p className="text-sm text-slate-600">
                  {t('installation.requiredTools.crimpingTool.description')}
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
                  {t('installation.requiredTools.wireStripper.title')}
                </h4>
                <p className="text-sm text-slate-600">
                  {t('installation.requiredTools.wireStripper.description')}
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                <h4 className="font-inter font-bold text-lg mb-3 text-slate-900">
                  {t('installation.requiredTools.insertionTool.title')}
                </h4>
                <p className="text-sm text-slate-600">
                  {t('installation.requiredTools.insertionTool.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Steps */}
        <div className="grid gap-6 mb-12" data-aos="fade-up" data-aos-delay="100">
          {INSTALLATION_STEPS.map((step, index) => (
            <Card key={step.step} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-slate-200">
              <CardContent className="p-8">
                <div className="flex gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-inter font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-inter font-bold mb-3 text-slate-900">{step.title}</h3>
                    <p className="text-slate-700 mb-4 leading-relaxed">{step.description}</p>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl">
                      <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-inter font-bold text-amber-900 mb-1">{t('installation.importantLabel')}</p>
                        <p className="text-sm text-amber-800">{step.warning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Terminal Removal */}
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
      </SectionContainer>

      {/* Common Mistakes Section */}
      <SectionContainer variant="gradient" spacing="large">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-inter font-bold text-slate-900 mb-6">
            {t('commonMistakes.sectionTitle')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('commonMistakes.sectionDescription')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8" data-aos="fade-up" data-aos-delay="100">
          {COMMON_MISTAKES.map((item, index) => (
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
      </SectionContainer>

      {/* Download Resources Section */}
      <SectionContainer variant="dark" spacing="medium">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-inter font-bold text-white mb-6">
            {t('downloadResources.title')}
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {t('downloadResources.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="mr-2 h-5 w-5" />
              {t('downloadResources.specsPdf')}
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              <Download className="mr-2 h-5 w-5" />
              {t('downloadResources.installationPdf')}
            </Button>
          </div>
        </div>
      </SectionContainer>

      {/* Related Resources */}
      <SectionContainer variant="gradient" spacing="large">
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
      </SectionContainer>
    </div>
  )
}