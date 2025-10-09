'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import { Terminal } from '@/types/database'
import {
  Cable,
  Zap,
  CircuitBoard,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'

interface TerminalTypeInfo {
  suffix: string
  name: string
  category: 'socket' | 'tab' | 'pcb'
  description: string
  applications: string[]
  wireGauge: string
  currentRating: string
  features: string[]
}

interface TerminalTypesSectionProps {
  translationNamespace?: string
}

export function TerminalTypesSection({ translationNamespace = 'TerminalsGuide' }: TerminalTypesSectionProps) {
  const t = useTranslations(translationNamespace)
  const [terminals, setTerminals] = useState<Terminal[]>([])

  // Build terminal type information from translations
  const getTerminalSuffixes = (): TerminalTypeInfo[] => [
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

  const TERMINAL_SUFFIXES = getTerminalSuffixes()

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
    socket: terminals.filter(terminal => ['FR', 'VR', 'VS'].some(type => terminal.terminal_type.includes(type))),
    tab: terminals.filter(terminal => ['VT', 'FT'].some(type => terminal.terminal_type.includes(type))),
    pcb: terminals.filter(terminal => terminal.terminal_type.includes('PC'))
  }

  const renderTerminalCard = (terminal: TerminalTypeInfo, colorScheme: 'blue' | 'orange' | 'green') => {
    const colors = {
      blue: {
        border: 'border-blue-600',
        text: 'text-blue-700',
        bg: 'from-slate-50 to-blue-50',
        badgeBg: 'from-blue-50 to-blue-50',
        appBg: 'from-white to-blue-50',
        appIcon: 'text-blue-600',
        hover: 'hover:border-blue-400'
      },
      orange: {
        border: 'border-orange-600',
        text: 'text-orange-700',
        bg: 'from-slate-50 to-orange-50',
        badgeBg: 'from-orange-50 to-orange-50',
        appBg: 'from-white to-orange-50',
        appIcon: 'text-orange-600',
        hover: 'hover:border-orange-400'
      },
      green: {
        border: 'border-green-600',
        text: 'text-green-700',
        bg: 'from-slate-50 to-green-50',
        badgeBg: 'from-green-50 to-green-50',
        appBg: 'from-white to-green-50',
        appIcon: 'text-green-600',
        hover: 'hover:border-green-400'
      }
    }

    const color = colors[colorScheme]
    const terminalList = terminalsByCategory[terminal.category]
      .filter(t => t.terminal_type.includes(terminal.suffix))
      .slice(0, 4)

    return (
      <Card key={terminal.suffix} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-slate-200">
        <CardHeader className={`bg-gradient-to-r ${color.bg} border-b-2 border-slate-200`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="outline" className={`text-lg px-4 py-1 border-2 ${color.border} ${color.text} font-inter font-bold`}>
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
                  <div className={`flex justify-between p-3 bg-gradient-to-r ${color.badgeBg} rounded-lg border border-slate-200`}>
                    <span className="text-sm font-inter font-medium text-slate-600">
                      {terminal.category === 'pcb' ? t('terminalTypes.labels.connectionType') : t('terminalTypes.labels.wireGauge')}
                    </span>
                    <span className="text-sm font-inter font-bold text-slate-900">{terminal.wireGauge}</span>
                  </div>
                  <div className={`flex justify-between p-3 bg-gradient-to-r ${color.badgeBg} rounded-lg border border-slate-200`}>
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
                    <li key={idx} className={`flex items-start gap-3 p-3 bg-gradient-to-r ${color.appBg} rounded-lg border border-slate-200`}>
                      <ArrowRight className={`h-5 w-5 ${color.appIcon} mt-0.5 flex-shrink-0`} />
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
                  {terminalList.map((terminal) => (
                    <div key={terminal.id} className={`group border-2 border-slate-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 ${color.hover} bg-white`}>
                      {terminal.image_url ? (
                        <div className={`aspect-square bg-gradient-to-br ${color.badgeBg} rounded-lg mb-2 relative overflow-hidden`}>
                          <Image
                            src={terminal.image_url}
                            alt={terminal.spec_number}
                            fill
                            className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className={`aspect-square bg-gradient-to-br from-slate-100 ${color.badgeBg} rounded-lg mb-2 flex items-center justify-center`}>
                          {colorScheme === 'blue' && <Cable className="h-10 w-10 text-slate-400" />}
                          {colorScheme === 'orange' && <Zap className="h-10 w-10 text-slate-400" />}
                          {colorScheme === 'green' && <CircuitBoard className="h-10 w-10 text-slate-400" />}
                        </div>
                      )}
                      <p className="text-xs font-inter font-bold text-center text-slate-700">{terminal.spec_number}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
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
            {TERMINAL_SUFFIXES.filter(t => t.category === 'socket').map((terminal) => renderTerminalCard(terminal, 'blue'))}
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
            {TERMINAL_SUFFIXES.filter(t => t.category === 'tab').map((terminal) => renderTerminalCard(terminal, 'orange'))}
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
            {TERMINAL_SUFFIXES.filter(t => t.category === 'pcb').map((terminal) => renderTerminalCard(terminal, 'green'))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
