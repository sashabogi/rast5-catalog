'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  ChevronRight
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" asChild>
                <a href="#terminal-types">
                  {t('hero.exploreButton')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <a href="#installation">
                  {t('hero.installationButton')}
                  <WrenchIcon className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">{t('breadcrumb.home')}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/resources`} className="hover:text-blue-600">{t('breadcrumb.resources')}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{t('breadcrumb.current')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('overview.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('overview.sectionDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <Cable className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>{t('overview.whatAreTerminals.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {t('overview.whatAreTerminals.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <Info className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>{t('overview.whyDifferentTypes.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {t('overview.whyDifferentTypes.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>{t('overview.namingConvention.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {t('overview.namingConvention.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Terminal Types - Tabbed Interface */}
        <section id="terminal-types" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('terminalTypes.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('terminalTypes.sectionDescription')}
            </p>
          </div>

          <Tabs defaultValue="socket" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="socket" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Cable className="h-4 w-4 mr-2" />
                {t('terminalTypes.socketTab')}
              </TabsTrigger>
              <TabsTrigger value="tab" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Zap className="h-4 w-4 mr-2" />
                {t('terminalTypes.tabTab')}
              </TabsTrigger>
              <TabsTrigger value="pcb" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <CircuitBoard className="h-4 w-4 mr-2" />
                {t('terminalTypes.pcbTab')}
              </TabsTrigger>
            </TabsList>

            {/* Socket Terminals Tab */}
            <TabsContent value="socket" className="space-y-6">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{t('terminalTypes.socket.categoryTitle')}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {t('terminalTypes.socket.categoryDescription')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-500 text-white text-lg px-4 py-2">{t('terminalTypes.socket.badge')}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-6">
                {TERMINAL_SUFFIXES.filter(t => t.category === 'socket').map((terminal) => (
                  <Card key={terminal.suffix} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-lg px-3 py-1 border-blue-500 text-blue-700">
                              {terminal.suffix}
                            </Badge>
                            <CardTitle className="text-xl">{terminal.name}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {terminal.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Specs & Features */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.technicalSpecifications')}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">{t('terminalTypes.labels.wireGauge')}</span>
                                <span className="text-sm font-medium">{terminal.wireGauge}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">{t('terminalTypes.labels.currentRating')}</span>
                                <span className="text-sm font-medium">{terminal.currentRating}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.keyFeatures')}</h4>
                            <ul className="space-y-1">
                              {terminal.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right Column - Applications */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.typicalApplications')}</h4>
                            <ul className="space-y-2">
                              {terminal.applications.map((app, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{app}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Terminal Images */}
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.availableTerminals')}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {terminalsByCategory.socket
                                .filter(t => t.terminal_type.includes(terminal.suffix))
                                .slice(0, 4)
                                .map((t) => (
                                  <div key={t.id} className="border rounded-lg p-2 hover:shadow-md transition-shadow">
                                    {t.image_url ? (
                                      <div className="aspect-square bg-gray-100 rounded mb-1 relative overflow-hidden">
                                        <Image
                                          src={t.image_url}
                                          alt={t.spec_number}
                                          fill
                                          className="object-contain p-2"
                                        />
                                      </div>
                                    ) : (
                                      <div className="aspect-square bg-gray-100 rounded mb-1 flex items-center justify-center">
                                        <Cable className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                    <p className="text-xs font-medium text-center">{t.spec_number}</p>
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
            <TabsContent value="tab" className="space-y-6">
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{t('terminalTypes.tab.categoryTitle')}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {t('terminalTypes.tab.categoryDescription')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-500 text-white text-lg px-4 py-2">{t('terminalTypes.tab.badge')}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-6">
                {TERMINAL_SUFFIXES.filter(t => t.category === 'tab').map((terminal) => (
                  <Card key={terminal.suffix} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-lg px-3 py-1 border-orange-500 text-orange-700">
                              {terminal.suffix}
                            </Badge>
                            <CardTitle className="text-xl">{terminal.name}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {terminal.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Specs & Features */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.technicalSpecifications')}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">{t('terminalTypes.labels.wireGauge')}</span>
                                <span className="text-sm font-medium">{terminal.wireGauge}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">{t('terminalTypes.labels.currentRating')}</span>
                                <span className="text-sm font-medium">{terminal.currentRating}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.keyFeatures')}</h4>
                            <ul className="space-y-1">
                              {terminal.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right Column - Applications */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.typicalApplications')}</h4>
                            <ul className="space-y-2">
                              {terminal.applications.map((app, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span>{app}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Terminal Images */}
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.availableTerminals')}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {terminalsByCategory.tab
                                .filter(t => t.terminal_type.includes(terminal.suffix))
                                .slice(0, 4)
                                .map((t) => (
                                  <div key={t.id} className="border rounded-lg p-2 hover:shadow-md transition-shadow">
                                    {t.image_url ? (
                                      <div className="aspect-square bg-gray-100 rounded mb-1 relative overflow-hidden">
                                        <Image
                                          src={t.image_url}
                                          alt={t.spec_number}
                                          fill
                                          className="object-contain p-2"
                                        />
                                      </div>
                                    ) : (
                                      <div className="aspect-square bg-gray-100 rounded mb-1 flex items-center justify-center">
                                        <Zap className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                    <p className="text-xs font-medium text-center">{t.spec_number}</p>
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
            <TabsContent value="pcb" className="space-y-6">
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{t('terminalTypes.pcb.categoryTitle')}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {t('terminalTypes.pcb.categoryDescription')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500 text-white text-lg px-4 py-2">{t('terminalTypes.pcb.badge')}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-6">
                {TERMINAL_SUFFIXES.filter(t => t.category === 'pcb').map((terminal) => (
                  <Card key={terminal.suffix} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-lg px-3 py-1 border-green-500 text-green-700">
                              {terminal.suffix}
                            </Badge>
                            <CardTitle className="text-xl">{terminal.name}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {terminal.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Specs & Features */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.technicalSpecifications')}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">{t('terminalTypes.labels.connectionType')}</span>
                                <span className="text-sm font-medium">{terminal.wireGauge}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">{t('terminalTypes.labels.currentRating')}</span>
                                <span className="text-sm font-medium">{terminal.currentRating}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.keyFeatures')}</h4>
                            <ul className="space-y-1">
                              {terminal.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right Column - Applications */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.typicalApplications')}</h4>
                            <ul className="space-y-2">
                              {terminal.applications.map((app, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{app}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Terminal Images */}
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('terminalTypes.labels.availableTerminals')}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {terminalsByCategory.pcb
                                .slice(0, 4)
                                .map((t) => (
                                  <div key={t.id} className="border rounded-lg p-2 hover:shadow-md transition-shadow">
                                    {t.image_url ? (
                                      <div className="aspect-square bg-gray-100 rounded mb-1 relative overflow-hidden">
                                        <Image
                                          src={t.image_url}
                                          alt={t.spec_number}
                                          fill
                                          className="object-contain p-2"
                                        />
                                      </div>
                                    ) : (
                                      <div className="aspect-square bg-gray-100 rounded mb-1 flex items-center justify-center">
                                        <CircuitBoard className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                    <p className="text-xs font-medium text-center">{t.spec_number}</p>
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
        </section>

        {/* Technical Specifications Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('technicalSpecs.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('technicalSpecs.sectionDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECHNICAL_SPECS.map((spec, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <spec.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{spec.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{spec.value}</p>
                  <p className="text-sm text-gray-600">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Technical Details */}
          <Card className="mt-8 border-blue-200">
            <CardHeader>
              <CardTitle>{t('technicalSpecs.materialDetails.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">{t('technicalSpecs.materialDetails.contactMaterial.heading')}</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('technicalSpecs.materialDetails.contactMaterial.baseMaterial')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('technicalSpecs.materialDetails.contactMaterial.plating')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('technicalSpecs.materialDetails.contactMaterial.matingArea')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{t('technicalSpecs.materialDetails.performanceCharacteristics.heading')}</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('technicalSpecs.materialDetails.performanceCharacteristics.contactResistance')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('technicalSpecs.materialDetails.performanceCharacteristics.insertionForce')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('technicalSpecs.materialDetails.performanceCharacteristics.operatingTemperature')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Installation Guide Section */}
        <section id="installation" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('installation.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('installation.sectionDescription')}
            </p>
          </div>

          {/* Required Tools */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WrenchIcon className="h-6 w-6 text-purple-600" />
                {t('installation.requiredTools.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">{t('installation.requiredTools.crimpingTool.title')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('installation.requiredTools.crimpingTool.description')}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">{t('installation.requiredTools.wireStripper.title')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('installation.requiredTools.wireStripper.description')}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">{t('installation.requiredTools.insertionTool.title')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('installation.requiredTools.insertionTool.description')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Installation Steps */}
          <div className="grid gap-4 mb-8">
            {INSTALLATION_STEPS.map((step) => (
              <Card key={step.step} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-700 mb-3">{step.description}</p>
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">{t('installation.importantLabel')}</p>
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
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">{t('installation.terminalRemoval.title')}</CardTitle>
              <CardDescription className="text-red-700">
                {t('installation.terminalRemoval.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">1.</span>
                  <span>{t('installation.terminalRemoval.steps.1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">2.</span>
                  <span>{t('installation.terminalRemoval.steps.2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">3.</span>
                  <span>{t('installation.terminalRemoval.steps.3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">4.</span>
                  <span>{t('installation.terminalRemoval.steps.4')}</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('commonMistakes.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('commonMistakes.sectionDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {COMMON_MISTAKES.map((item) => (
              <Card key={item.mistake} className="border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-lg text-amber-900">{item.mistake}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-red-700 mb-1">{t('commonMistakes.consequenceLabel')}</h4>
                    <p className="text-sm text-gray-700">{item.consequence}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-1">{t('commonMistakes.solutionLabel')}</h4>
                    <p className="text-sm text-gray-700">{item.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download Resources Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('downloadResources.title')}</h2>
                  <p className="text-blue-100 mb-4">
                    {t('downloadResources.description')}
                  </p>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="lg">
                      <Download className="mr-2 h-5 w-5" />
                      {t('downloadResources.specsPdf')}
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                      <Download className="mr-2 h-5 w-5" />
                      {t('downloadResources.installationPdf')}
                    </Button>
                  </div>
                </div>
                <Download className="h-24 w-24 text-white/20" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Resources */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('relatedResources.sectionTitle')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href={`/${locale}/catalog`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <Cable className="h-10 w-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>{t('relatedResources.browseCatalog.title')}</CardTitle>
                  <CardDescription>
                    {t('relatedResources.browseCatalog.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {t('relatedResources.browseCatalog.button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/${locale}/resources/connector-guide`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <Info className="h-10 w-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>{t('relatedResources.selectionGuide.title')}</CardTitle>
                  <CardDescription>
                    {t('relatedResources.selectionGuide.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {t('relatedResources.selectionGuide.button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/${locale}/resources`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <Download className="h-10 w-10 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>{t('relatedResources.allResources.title')}</CardTitle>
                  <CardDescription>
                    {t('relatedResources.allResources.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {t('relatedResources.allResources.button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
