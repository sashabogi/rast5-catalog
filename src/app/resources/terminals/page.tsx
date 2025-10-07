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

// Terminal suffix explanations
const TERMINAL_SUFFIXES = [
  {
    suffix: 'FR',
    name: 'Female Receptacle',
    category: 'socket',
    description: 'Standard female socket terminal with flat mounting orientation',
    applications: ['Wire-to-wire connections', 'General purpose receptacles', 'Horizontal mounting'],
    wireGauge: '16-22 AWG',
    currentRating: '7A',
    features: ['Flat receptacle design', 'Standard locking mechanism', 'Crimp-style connection']
  },
  {
    suffix: 'VR',
    name: 'Vertical Receptacle',
    category: 'socket',
    description: 'Female socket terminal with vertical orientation for perpendicular connections',
    applications: ['Vertical board mounting', 'Space-saving designs', 'Right-angle connections'],
    wireGauge: '16-22 AWG',
    currentRating: '7A',
    features: ['Vertical orientation', 'Compact footprint', 'Secure retention']
  },
  {
    suffix: 'VS',
    name: 'Vertical Socket',
    category: 'socket',
    description: 'Specialized vertical socket terminal with enhanced contact area',
    applications: ['High-reliability applications', 'Vertical PCB mounting', 'Industrial connections'],
    wireGauge: '16-22 AWG',
    currentRating: '7A',
    features: ['Enhanced contact design', 'Superior retention', 'Vibration resistant']
  },
  {
    suffix: 'VT',
    name: 'Vertical Tab',
    category: 'tab',
    description: 'Male tab terminal with vertical blade orientation',
    applications: ['Vertical mating', 'PCB headers', 'Right-angle connections'],
    wireGauge: '16-22 AWG',
    currentRating: '7A',
    features: ['Vertical blade design', 'Gold-plated contacts', 'Reliable insertion']
  },
  {
    suffix: 'FT',
    name: 'Flat Tab',
    category: 'tab',
    description: 'Male tab terminal with flat blade orientation',
    applications: ['Standard wire-to-wire', 'Horizontal mating', 'General purpose'],
    wireGauge: '16-22 AWG',
    currentRating: '7A',
    features: ['Flat blade design', 'Standard dimensions', 'Easy crimping']
  },
  {
    suffix: 'PC',
    name: 'Printed Circuit',
    category: 'pcb',
    description: 'Through-hole terminal for direct PCB mounting',
    applications: ['PCB headers', 'Board-to-board connections', 'Soldered connections'],
    wireGauge: 'N/A (PCB mount)',
    currentRating: '7A',
    features: ['Through-hole mounting', 'Wave solderable', 'Multiple pin options']
  }
]

// Technical specifications
const TECHNICAL_SPECS = [
  {
    icon: Gauge,
    title: 'Current Rating',
    value: '7A per contact',
    description: 'Maximum continuous current at 25°C ambient temperature'
  },
  {
    icon: Zap,
    title: 'Voltage Rating',
    value: '250V AC/DC',
    description: 'Maximum working voltage per IEC standards'
  },
  {
    icon: Ruler,
    title: 'Wire Range',
    value: '16-22 AWG',
    description: 'Compatible wire gauge for crimp terminals'
  },
  {
    icon: ShieldCheck,
    title: 'Contact Material',
    value: 'Brass (Tin-plated)',
    description: 'Corrosion-resistant finish for long-term reliability'
  }
]

// Installation steps
const INSTALLATION_STEPS = [
  {
    step: 1,
    title: 'Strip Wire',
    description: 'Strip insulation to expose 5-6mm of conductor',
    warning: 'Do not over-strip or damage strands'
  },
  {
    step: 2,
    title: 'Insert into Terminal',
    description: 'Place wire into terminal crimp area',
    warning: 'Ensure wire is fully inserted before crimping'
  },
  {
    step: 3,
    title: 'Crimp Terminal',
    description: 'Use proper crimping tool to secure terminal',
    warning: 'Check crimp quality - no strand pullout'
  },
  {
    step: 4,
    title: 'Insert into Housing',
    description: 'Push terminal into connector housing until it clicks',
    warning: 'Terminal must be fully seated and locked'
  },
  {
    step: 5,
    title: 'Verify Lock',
    description: 'Gently tug wire to confirm terminal is secured',
    warning: 'Terminal should not pull out of housing'
  }
]

// Common mistakes
const COMMON_MISTAKES = [
  {
    mistake: 'Over-stripping wire insulation',
    consequence: 'Exposed conductor creates short circuit risk',
    solution: 'Strip only 5-6mm as specified'
  },
  {
    mistake: 'Under-crimping or over-crimping',
    consequence: 'Poor electrical connection or damaged wire',
    solution: 'Use calibrated crimp tool with proper die'
  },
  {
    mistake: 'Forcing wrong terminal type',
    consequence: 'Damaged housing or poor contact',
    solution: 'Verify terminal suffix matches connector requirements'
  },
  {
    mistake: 'Not verifying terminal lock',
    consequence: 'Terminal backs out during use',
    solution: 'Always pull-test after insertion'
  }
]

async function getTerminals() {
  const { data: terminals, error } = await supabase
    .from('terminals')
    .select('*')
    .order('terminal_type')

  if (error) {
    console.error('Error fetching terminals:', error)
    return []
  }

  return terminals as Terminal[]
}

export default async function TerminalsPage() {
  const terminals = await getTerminals()

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
              Technical Reference
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Terminal Components Guide
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Complete technical reference for RAST 5 terminal components. Learn about socket, tab, and PCB terminals,
              their specifications, and proper installation techniques.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" asChild>
                <a href="#terminal-types">
                  Explore Terminal Types
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <a href="#installation">
                  Installation Guide
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
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/resources" className="hover:text-blue-600">Resources</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Terminal Components Guide</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding RAST 5 Terminals
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Terminals are the conductive metal components that create the electrical connection inside RAST 5 connectors.
              Each connector type requires specific terminal variants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <Cable className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>What are Terminals?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Terminals are precision-formed metal contacts that crimp onto wires or mount to PCBs. They provide
                  the physical and electrical connection between wire and connector housing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <Info className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Why Different Types?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Different orientations (vertical/horizontal), mounting types (wire/PCB), and mating styles (socket/tab)
                  require specific terminal designs to ensure proper fit and reliable connections.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Naming Convention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Terminals are identified by suffix codes (FR, VR, VS, VT, FT, PC) which indicate the terminal type.
                  Always match the terminal suffix to your connector requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Terminal Types - Tabbed Interface */}
        <section id="terminal-types" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Terminal Types & Specifications
            </h2>
            <p className="text-lg text-gray-600">
              Explore the three main categories of RAST 5 terminals
            </p>
          </div>

          <Tabs defaultValue="socket" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="socket" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Cable className="h-4 w-4 mr-2" />
                Socket Terminals
              </TabsTrigger>
              <TabsTrigger value="tab" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Zap className="h-4 w-4 mr-2" />
                Tab Terminals
              </TabsTrigger>
              <TabsTrigger value="pcb" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <CircuitBoard className="h-4 w-4 mr-2" />
                PCB Terminals
              </TabsTrigger>
            </TabsList>

            {/* Socket Terminals Tab */}
            <TabsContent value="socket" className="space-y-6">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Socket Terminals (Female)</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Receptacle-style terminals that accept tab terminals for secure electrical connections
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-500 text-white text-lg px-4 py-2">Female</Badge>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Technical Specifications</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Wire Gauge:</span>
                                <span className="text-sm font-medium">{terminal.wireGauge}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Current Rating:</span>
                                <span className="text-sm font-medium">{terminal.currentRating}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features</h4>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Typical Applications</h4>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Available Terminals</h4>
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
                      <CardTitle className="text-2xl">Tab Terminals (Male)</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Blade-style terminals that insert into socket terminals for mating connections
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-500 text-white text-lg px-4 py-2">Male</Badge>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Technical Specifications</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Wire Gauge:</span>
                                <span className="text-sm font-medium">{terminal.wireGauge}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Current Rating:</span>
                                <span className="text-sm font-medium">{terminal.currentRating}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features</h4>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Typical Applications</h4>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Available Terminals</h4>
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
                      <CardTitle className="text-2xl">PCB Terminals</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Through-hole terminals designed for direct PCB mounting and soldering
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500 text-white text-lg px-4 py-2">PCB</Badge>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Technical Specifications</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Connection Type:</span>
                                <span className="text-sm font-medium">{terminal.wireGauge}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Current Rating:</span>
                                <span className="text-sm font-medium">{terminal.currentRating}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features</h4>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Typical Applications</h4>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Available Terminals</h4>
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
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600">
              Universal specifications applicable to all RAST 5 terminal types
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
              <CardTitle>Material & Plating Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Contact Material</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Base Material: Brass alloy (CuZn37)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Plating: Tin (Sn) 3-5 μm thickness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mating Area: Gold flash available on request</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Performance Characteristics</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Contact Resistance: &lt; 5mΩ initial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Insertion Force: 1-3N typical</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Operating Temperature: -40°C to +105°C</span>
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
              Installation Guide
            </h2>
            <p className="text-lg text-gray-600">
              Step-by-step instructions for proper terminal crimping and insertion
            </p>
          </div>

          {/* Required Tools */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WrenchIcon className="h-6 w-6 text-purple-600" />
                Required Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">Crimping Tool</h4>
                  <p className="text-sm text-gray-600">
                    Calibrated ratcheting crimper with proper die set for RAST 5 terminals
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">Wire Stripper</h4>
                  <p className="text-sm text-gray-600">
                    Adjustable wire stripper for 16-22 AWG wire gauge
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">Insertion/Removal Tool</h4>
                  <p className="text-sm text-gray-600">
                    Special tool for terminal insertion and safe removal if needed
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
                          <p className="text-sm font-medium text-amber-900">Important:</p>
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
              <CardTitle className="text-red-900">Terminal Removal Procedure</CardTitle>
              <CardDescription className="text-red-700">
                If you need to remove a terminal from the housing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">1.</span>
                  <span>Use proper terminal removal tool - never force with pliers or screwdriver</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">2.</span>
                  <span>Insert removal tool alongside terminal to release locking tab</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">3.</span>
                  <span>Gently pull wire while holding removal tool in place</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-600 flex-shrink-0">4.</span>
                  <span>Inspect terminal for damage before reuse - damaged terminals must be replaced</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Mistakes to Avoid
            </h2>
            <p className="text-lg text-gray-600">
              Learn from these common errors to ensure reliable connections
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
                    <h4 className="font-semibold text-sm text-red-700 mb-1">Consequence:</h4>
                    <p className="text-sm text-gray-700">{item.consequence}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-1">Solution:</h4>
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
                  <h2 className="text-2xl font-bold mb-2">Technical Documentation</h2>
                  <p className="text-blue-100 mb-4">
                    Download detailed specification sheets and installation guides
                  </p>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="lg">
                      <Download className="mr-2 h-5 w-5" />
                      Terminal Specifications PDF
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                      <Download className="mr-2 h-5 w-5" />
                      Installation Guide PDF
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
              Related Resources
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/catalog">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <Cable className="h-10 w-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>Browse Connectors</CardTitle>
                  <CardDescription>
                    View our complete catalog of RAST 5 connectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Catalog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources/connector-guide">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <Info className="h-10 w-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>Selection Guide</CardTitle>
                  <CardDescription>
                    Interactive wizard to find the right connector
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Launch Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <Download className="h-10 w-10 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>All Resources</CardTitle>
                  <CardDescription>
                    Access all documentation and guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Resources
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
