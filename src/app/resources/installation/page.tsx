'use client'

import { useState } from 'react'
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
  // Checklist state for interactive tracking
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'tools', label: 'Gathered all required tools and materials', checked: false },
    { id: 'safety', label: 'Read and understood all safety precautions', checked: false },
    { id: 'terminal-selection', label: 'Selected correct terminals', checked: false },
    { id: 'wire-prep', label: 'Prepared wires to correct specifications', checked: false },
    { id: 'crimping', label: 'Crimped terminals and inspected quality', checked: false },
    { id: 'insertion', label: 'Inserted terminals into connector housing', checked: false },
    { id: 'assembly', label: 'Completed connector assembly', checked: false },
    { id: 'inspection', label: 'Performed final inspection', checked: false },
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
            <Link href="/resources" className="hover:text-white transition-colors">
              Resources
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Installation Guide</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">RAST 5 Connector Installation Guide</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Comprehensive step-by-step instructions for professional assembly, crimping, and
            installation of RAST 5 connectors
          </p>
          <div className="flex items-center gap-4 mt-6 print:hidden">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Version 2.1
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Last Updated: March 2025
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
                Print Guide
              </Button>
              <Button variant="outline" asChild>
                <a href="#" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Progress:</span>
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
                      SAFETY WARNING - READ BEFORE PROCEEDING
                    </h3>
                    <ul className="space-y-2 text-red-900">
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Always disconnect power before working on electrical connections
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Use properly rated tools and equipment for your application</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Wear appropriate personal protective equipment (safety glasses,
                          insulated gloves)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Follow all local electrical codes and regulations
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          If unsure, consult a qualified electrician or engineer
                        </span>
                      </li>
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
                  Getting Started
                </CardTitle>
                <CardDescription>
                  What you&apos;ll need and how to prepare your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Required Tools & Materials</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">RAST 5 Crimp Tool</p>
                        <p className="text-sm text-gray-600">
                          Proper tool for terminal size
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Wire Strippers</p>
                        <p className="text-sm text-gray-600">
                          Adjustable, precision type
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Wire Cutters</p>
                        <p className="text-sm text-gray-600">
                          Clean, sharp cutting blades
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Terminal Release Tool</p>
                        <p className="text-sm text-gray-600">
                          For removing/repositioning terminals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Magnifying Glass/Loupe</p>
                        <p className="text-sm text-gray-600">
                          For crimp quality inspection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Multimeter (Optional)</p>
                        <p className="text-sm text-gray-600">
                          For continuity testing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Workspace Setup</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <span>
                        Clean, well-lit workspace with adequate room for tools and materials
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <span>
                        ESD-safe mat if working with sensitive electronic components
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <span>
                        Organize connectors, terminals, and wires by type and size
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <span>
                        Keep this installation guide readily accessible for reference
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step-by-Step Installation Process */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Step-by-Step Installation Process</CardTitle>
                <CardDescription>
                  Follow these steps carefully for reliable, professional assembly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {/* Step 1: Terminal Selection */}
                  <AccordionItem value="step1" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">Step 1</Badge>
                        <span className="font-semibold text-lg">Terminal Selection</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          Understanding Terminal Types
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">
                          RAST 5 connectors use different terminal types based on the connector
                          suffix:
                        </p>
                        <div className="grid gap-2">
                          <div className="bg-white p-3 rounded">
                            <p className="font-medium">
                              FR (Flange, Right Angle) - Female terminals with flange mounting
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-medium">
                              FT (Flange, Through-hole) - Female terminals for PCB mounting
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-medium">
                              VR (Vertical, Right Angle) - Vertical orientation terminals
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-medium">
                              VT (Vertical, Through-hole) - Male vertical terminals
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-medium">
                              VS (Vertical, Surface Mount) - SMT terminals for PCB
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-medium">
                              PC (Print Circuit) - PCB header terminals
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Wire Gauge Compatibility</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="border p-2 text-left">Wire Gauge (AWG)</th>
                                <th className="border p-2 text-left">Wire Gauge (mm²)</th>
                                <th className="border p-2 text-left">Compatible Terminals</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border p-2">24-22 AWG</td>
                                <td className="border p-2">0.25-0.34 mm²</td>
                                <td className="border p-2">Standard RAST 5 terminals</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border p-2">20-18 AWG</td>
                                <td className="border p-2">0.5-0.75 mm²</td>
                                <td className="border p-2">Standard RAST 5 terminals</td>
                              </tr>
                              <tr>
                                <td className="border p-2">16 AWG</td>
                                <td className="border p-2">1.0-1.5 mm²</td>
                                <td className="border p-2">Check terminal specifications</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-1">Important</h4>
                            <p className="text-sm text-amber-800">
                              Always verify terminal compatibility with your specific connector
                              model. Using incorrect terminals can result in poor connections
                              and potential failure.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Selection Checklist</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Verify connector model and terminal suffix</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Confirm wire gauge matches terminal specifications</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Check current rating requirements for your application</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Ensure sufficient quantity of terminals for all positions</span>
                          </li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 2: Wire Preparation */}
                  <AccordionItem value="step2" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">Step 2</Badge>
                        <span className="font-semibold text-lg">Wire Preparation</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3">Strip Length Requirements</h4>
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-lg border">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-2xl font-bold text-orange-600">5-6 mm</p>
                              <p className="text-sm text-gray-600">
                                Recommended strip length
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-orange-600">
                                0.20-0.24 in
                              </p>
                              <p className="text-sm text-gray-600">Imperial equivalent</p>
                            </div>
                          </div>
                          <div className="relative h-16 bg-white rounded border-2 border-gray-300">
                            <div className="absolute left-0 top-0 h-full w-1/3 bg-orange-200 flex items-center justify-center">
                              <span className="text-xs font-medium">Insulation</span>
                            </div>
                            <div className="absolute left-1/3 top-0 h-full w-2/3 bg-orange-400 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                Stripped Conductor
                              </span>
                            </div>
                            <div className="absolute left-1/3 top-0 h-full border-l-2 border-dashed border-red-500" />
                            <div className="absolute left-1/3 -top-6 text-xs font-medium text-red-600">
                              Strip Here
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Wire Preparation Steps</h4>
                        <ol className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Cut wire to required length</p>
                              <p className="text-sm text-gray-600">
                                Add extra length for routing and strain relief (typically 50-100mm
                                extra)
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Inspect insulation</p>
                              <p className="text-sm text-gray-600">
                                Check for nicks, cuts, or damage. Discard damaged wire.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Strip insulation</p>
                              <p className="text-sm text-gray-600">
                                Use proper wire strippers set to correct gauge. Strip 5-6mm from
                                end.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              4
                            </div>
                            <div>
                              <p className="font-medium">Inspect conductor</p>
                              <p className="text-sm text-gray-600">
                                Ensure no strands are cut or damaged. All strands should be
                                intact and clean.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              5
                            </div>
                            <div>
                              <p className="font-medium">Twist conductor (if stranded)</p>
                              <p className="text-sm text-gray-600">
                                Gently twist stranded wire clockwise to keep strands together
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-green-900 mb-2">Good Strip</h4>
                              <ul className="text-sm text-green-800 space-y-1">
                                <li>Clean, straight cut</li>
                                <li>No damaged strands</li>
                                <li>Proper length (5-6mm)</li>
                                <li>No insulation nicks</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-red-900 mb-2">Bad Strip</h4>
                              <ul className="text-sm text-red-800 space-y-1">
                                <li>Ragged or uneven cut</li>
                                <li>Cut/missing strands</li>
                                <li>Wrong length</li>
                                <li>Damaged insulation</li>
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
                        <Badge className="bg-orange-600">Step 3</Badge>
                        <span className="font-semibold text-lg">Terminal Crimping</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          Critical Quality Step
                        </h4>
                        <p className="text-sm text-orange-800">
                          Proper crimping is essential for reliable electrical connections. A
                          good crimp provides both electrical conductivity and mechanical
                          strength. Take your time and inspect every crimp.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Crimp Tool Selection</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">Recommended: RAST 5-Specific Tool</p>
                            <p className="text-sm text-gray-600">
                              Purpose-built tools ensure proper crimp geometry and force
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">
                              Acceptable: Precision Crimping Pliers
                            </p>
                            <p className="text-sm text-gray-600">
                              Must have correct die set for terminal size
                            </p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="font-medium mb-1 text-red-900">
                              Not Recommended: Standard Pliers
                            </p>
                            <p className="text-sm text-red-800">
                              Will not provide proper crimp quality or reliability
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Crimping Procedure</h4>
                        <ol className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Position terminal in crimp tool</p>
                              <p className="text-sm text-gray-600">
                                Ensure terminal is fully seated in the correct die position
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Insert prepared wire</p>
                              <p className="text-sm text-gray-600">
                                Wire should extend fully into terminal barrel. Insulation should
                                NOT enter crimp area.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Apply crimp force</p>
                              <p className="text-sm text-gray-600">
                                Squeeze handles completely until tool releases (ratcheting tools)
                                or until handles touch (non-ratcheting)
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              4
                            </div>
                            <div>
                              <p className="font-medium">Remove crimped terminal</p>
                              <p className="text-sm text-gray-600">
                                Carefully release tool and remove terminal without bending
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              5
                            </div>
                            <div>
                              <p className="font-medium">Inspect crimp quality</p>
                              <p className="text-sm text-gray-600">
                                See inspection criteria below - reject any questionable crimps
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Crimp Quality Inspection</h4>
                        <Tabs defaultValue="good" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="good" className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Good Crimp
                            </TabsTrigger>
                            <TabsTrigger value="bad" className="flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Bad Crimp
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="good" className="space-y-3 mt-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h5 className="font-semibold text-green-900 mb-3">
                                Characteristics of a Good Crimp:
                              </h5>
                              <ul className="space-y-2 text-sm text-green-800">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Terminal barrel is uniformly compressed around wire
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Wire strands are visible at end of terminal barrel</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    No gaps between wire and terminal barrel walls
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Insulation crimp grips wire jacket without cutting it
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Wire cannot be pulled out with moderate force</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Terminal contact area is undamaged and properly shaped
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="text-sm text-blue-900 flex items-start gap-2">
                                <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>
                                  Use a magnifying glass or loupe to inspect crimp area. The
                                  barrel should show slight indentation from the crimp dies but no
                                  cracks or sharp edges.
                                </span>
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="bad" className="space-y-3 mt-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h5 className="font-semibold text-red-900 mb-3">
                                Signs of a Bad Crimp (Reject These):
                              </h5>
                              <ul className="space-y-2 text-sm text-red-800">
                                <li className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Under-crimped: Terminal barrel not fully compressed, wire
                                    pulls out easily
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Over-crimped: Terminal barrel cracked, cut wire strands, or
                                    damaged contact
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Misaligned: Wire not fully inserted, strands visible outside
                                    barrel
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Insulation in crimp area: Wire jacket crimped into conductor
                                    area
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Bent or damaged terminal contact area
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Visible cracks or splits in terminal barrel</span>
                                </li>
                              </ul>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <p className="text-sm text-amber-900 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>
                                  When in doubt, cut off the terminal and re-crimp with a new
                                  terminal. Bad crimps can cause intermittent connections,
                                  increased resistance, heat generation, and eventual failure.
                                </span>
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div className="bg-gray-50 border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Pull Test (Optional but Recommended)</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          After crimping, perform a gentle pull test to verify mechanical
                          integrity:
                        </p>
                        <ol className="text-sm text-gray-700 space-y-1">
                          <li>1. Grip terminal body (not contact area)</li>
                          <li>2. Grip wire insulation 25-50mm from terminal</li>
                          <li>3. Pull with moderate force (approximately 5-10 lbs / 2-5 kg)</li>
                          <li>
                            4. Wire should not pull out or show any movement in terminal barrel
                          </li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 4: Terminal Insertion */}
                  <AccordionItem value="step4" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">Step 4</Badge>
                        <span className="font-semibold text-lg">Terminal Insertion</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3">Orientation Verification</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900 mb-3">
                            Before inserting terminals, verify correct orientation:
                          </p>
                          <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                Terminal contact must face the correct direction for mating
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Retention lance (if present) must engage housing lock</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Check connector housing for insertion direction guides</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Insertion Procedure</h4>
                        <ol className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Position housing correctly</p>
                              <p className="text-sm text-gray-600">
                                Orient connector housing with keyway up and insertion side facing
                                you
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Align terminal with cavity</p>
                              <p className="text-sm text-gray-600">
                                Match terminal position with correct cavity number. Reference
                                wiring diagram if available.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Insert terminal with firm pressure</p>
                              <p className="text-sm text-gray-600">
                                Push terminal straight in until you hear/feel a distinct &quot;click&quot;
                                indicating lock engagement
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              4
                            </div>
                            <div>
                              <p className="font-medium">Verify retention</p>
                              <p className="text-sm text-gray-600">
                                Gently pull wire backward. Terminal should be solidly retained
                                and not move.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              5
                            </div>
                            <div>
                              <p className="font-medium">Repeat for all positions</p>
                              <p className="text-sm text-gray-600">
                                Continue inserting terminals in correct sequence per wiring
                                diagram
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Common Insertion Problems
                        </h4>
                        <div className="space-y-3 text-sm text-amber-900">
                          <div>
                            <p className="font-medium">Problem: Terminal won&apos;t insert fully</p>
                            <p className="text-amber-800">
                              Solution: Check terminal orientation, ensure retention lance is not
                              bent, verify correct terminal type for housing
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">
                              Problem: Terminal inserts but doesn&apos;t lock
                            </p>
                            <p className="text-amber-800">
                              Solution: Retention lance may be damaged. Use new terminal. Check
                              for obstructions in housing cavity.
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Problem: Terminal pulls out easily</p>
                            <p className="text-amber-800">
                              Solution: Terminal not fully inserted. Remove and re-insert until
                              positive click/lock is achieved.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Terminal Removal (If Needed)</h4>
                        <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                          <p className="text-sm text-gray-700">
                            If you need to remove or reposition a terminal:
                          </p>
                          <ol className="text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="font-medium">1.</span>
                              <span>
                                Use proper terminal release tool designed for RAST 5 connectors
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-medium">2.</span>
                              <span>
                                Insert release tool alongside terminal to depress retention lance
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-medium">3.</span>
                              <span>
                                While holding release tool in position, gently pull wire to
                                extract terminal
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-medium">4.</span>
                              <span>
                                Inspect terminal for damage before re-insertion. Replace if lance
                                is bent or damaged.
                              </span>
                            </li>
                          </ol>
                          <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                            <p className="text-sm text-red-900 flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                Never attempt to remove terminals with screwdrivers or other
                                improvised tools. This can damage both the terminal and housing.
                              </span>
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
                        <Badge className="bg-orange-600">Step 5</Badge>
                        <span className="font-semibold text-lg">Connector Assembly</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3">Keying Verification</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900 mb-3">
                            RAST 5 connectors use mechanical keying to prevent incorrect mating:
                          </p>
                          <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                Verify keying code matches between mating connectors
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Check polarization features align correctly</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                Ensure pole count and pin numbering matches application wiring
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Housing Alignment</h4>
                        <ol className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Check all terminals are fully inserted</p>
                              <p className="text-sm text-gray-600">
                                Verify each terminal is locked and no cavities are empty (unless
                                intentionally unpopulated)
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Route wires appropriately</p>
                              <p className="text-sm text-gray-600">
                                Arrange wires to exit connector housing cleanly without sharp
                                bends or crossovers
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Apply strain relief (if applicable)</p>
                              <p className="text-sm text-gray-600">
                                Install cable clamps, zip ties, or strain relief boots to protect
                                wire-to-terminal interface
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                              4
                            </div>
                            <div>
                              <p className="font-medium">Install secondary locks (if present)</p>
                              <p className="text-sm text-gray-600">
                                Some connectors have additional locking features. Ensure these are
                                properly engaged.
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Strain Relief Considerations</h4>
                        <div className="grid gap-3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium mb-2">Why Strain Relief Matters:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>
                                • Prevents mechanical stress from transferring to crimp connection
                              </li>
                              <li>• Protects against vibration-induced fatigue</li>
                              <li>• Maintains wire alignment and prevents pulling</li>
                              <li>• Extends service life in harsh environments</li>
                            </ul>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium mb-2">Strain Relief Methods:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>
                                • Cable ties securing wire bundle near connector (most common)
                              </li>
                              <li>• Connector-specific strain relief boots or clips</li>
                              <li>• Cable clamps mounted to equipment chassis</li>
                              <li>• Flexible conduit for additional protection</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Final Assembly Checklist</h4>
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>All terminals properly crimped and inspected</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>All terminals fully inserted and locked in housing</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Wire routing is clean and organized</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Strain relief applied appropriately</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Keying and polarization verified</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>No foreign material or debris in connector</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Housing is undamaged and clean</span>
                            </li>
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
                  Advanced Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {/* Sealed Connectors */}
                  <AccordionItem value="sealed" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold">Sealed Connector Assembly</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <p className="text-gray-700">
                        Sealed connectors provide protection against moisture, dust, and
                        contaminants:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            1
                          </div>
                          <span>
                            Use only specified sealed terminals and wire seals for your connector
                            model
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            2
                          </div>
                          <span>
                            Install wire seal onto cable before crimping terminal (cannot be added
                            after)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            3
                          </div>
                          <span>
                            Ensure wire seal is properly sized for cable outer diameter
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            4
                          </div>
                          <span>
                            After terminal insertion, position seal against rear of connector
                            housing
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            5
                          </div>
                          <span>
                            Install connector seal/gasket if required (some models use separate
                            housing seals)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            6
                          </div>
                          <span>
                            Verify seal integrity - no gaps, proper compression when mated
                          </span>
                        </li>
                      </ul>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <p className="text-sm text-blue-900">
                          IP (Ingress Protection) ratings are only valid when connectors are
                          properly mated and all seals are correctly installed. Unmated sealed
                          connectors should be protected with dust caps.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* High Vibration */}
                  <AccordionItem value="vibration" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        High-Vibration Applications
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <p className="text-gray-700">
                        Applications with significant vibration (automotive, industrial
                        machinery, transportation) require additional considerations:
                      </p>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">Connector Selection:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Use connectors with positive locking mechanisms</li>
                            <li>
                              • Consider connectors with secondary locks or locking clips
                            </li>
                            <li>• Specify connectors rated for vibration resistance</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">Assembly Best Practices:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Ensure all terminals are fully locked with positive click</li>
                            <li>
                              • Apply additional strain relief close to connector (within 50mm)
                            </li>
                            <li>• Use flexible wire to absorb vibration before connector</li>
                            <li>
                              • Mount connectors to rigid points, not to vibrating components
                            </li>
                            <li>• Consider using vibration-dampening mounts or grommets</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">Maintenance:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>
                              • Inspect connections regularly for signs of fretting or wear
                            </li>
                            <li>• Check for backed-out terminals or loose connections</li>
                            <li>• Monitor contact resistance over time</li>
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
                        Temperature Considerations
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-900 mb-3">
                          Standard RAST 5 connectors are typically rated for -40°C to +105°C
                          (-40°F to +221°F). Operating outside this range requires special
                          considerations:
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-semibold mb-2">High Temperature (Above 105°C):</h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>
                              • Verify connector housing material is rated for application
                              temperature
                            </li>
                            <li>
                              • Use high-temperature wire insulation (Teflon, PTFE, silicone)
                            </li>
                            <li>• Derate current capacity per manufacturer specifications</li>
                            <li>
                              • Consider thermal expansion effects on terminal retention
                            </li>
                            <li>• Increase inspection frequency for degradation</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Low Temperature (Below -40°C):</h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>• Verify housing material remains flexible at low temperature</li>
                            <li>
                              • Use cold-rated wire insulation that won&apos;t crack or become brittle
                            </li>
                            <li>• Test mating/unmating forces at operating temperature</li>
                            <li>• Account for thermal contraction in tight spaces</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Thermal Cycling:</h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>• Repeated temperature cycles can cause fretting corrosion</li>
                            <li>
                              • Different expansion rates between materials may affect retention
                            </li>
                            <li>
                              • Consider gold-plated terminals for improved reliability
                            </li>
                            <li>
                              • Allow stress relief in wire routing to accommodate expansion
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          Always consult manufacturer datasheets for specific temperature ratings
                          and derating requirements. Contact your RAST 5 supplier for
                          high-temperature or low-temperature connector options if needed.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Maintenance */}
                  <AccordionItem value="maintenance" className="border rounded-lg px-4 mb-3">
                    <AccordionTrigger>
                      <span className="font-semibold">Maintenance & Inspection Schedules</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                      <p className="text-gray-700">
                        Regular inspection and maintenance extends connector service life and
                        prevents unexpected failures:
                      </p>

                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="font-semibold text-green-900 mb-2">
                            Initial Installation (0 Hours):
                          </h5>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Visual inspection of all crimps and connections</li>
                            <li>• Continuity testing of all circuits</li>
                            <li>• Contact resistance measurement (if critical application)</li>
                            <li>• Verify proper mating and locking</li>
                            <li>• Document as-built configuration</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-900 mb-2">
                            Periodic Inspection (Every 6-12 Months):
                          </h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Visual inspection for physical damage or contamination</li>
                            <li>• Check for backed-out or loose terminals</li>
                            <li>• Verify locking features still engaged</li>
                            <li>• Inspect strain relief for wear or damage</li>
                            <li>• Check for signs of overheating (discoloration, melting)</li>
                            <li>• Clean contacts if necessary (per manufacturer guidelines)</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-900 mb-2">
                            Harsh Environment (Every 3-6 Months):
                          </h5>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• All items from periodic inspection</li>
                            <li>• Contact resistance trending</li>
                            <li>• Seal integrity verification (sealed connectors)</li>
                            <li>• Corrosion inspection</li>
                            <li>• Fretting wear assessment</li>
                            <li>• Consider preventive replacement based on lifecycle</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h5 className="font-semibold text-amber-900 mb-2">
                          Warning Signs Requiring Immediate Action:
                        </h5>
                        <ul className="text-sm text-amber-800 space-y-1">
                          <li>• Intermittent connections or circuit dropouts</li>
                          <li>• Elevated contact resistance</li>
                          <li>• Visible corrosion on contacts or terminals</li>
                          <li>• Cracked, melted, or damaged housing</li>
                          <li>• Loose or backed-out terminals</li>
                          <li>• Burning smell or discoloration from heat</li>
                          <li>• Broken latches or locking features</li>
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
                  Troubleshooting Guide
                </CardTitle>
                <CardDescription>
                  Solutions to common assembly problems and how to fix mistakes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Problem 1 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Problem: Wire pulls out of crimped terminal
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Causes:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Under-crimped terminal</li>
                          <li>• Wrong terminal size for wire gauge</li>
                          <li>• Damaged or cut wire strands</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Solutions:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Cut off terminal and re-crimp with new terminal</li>
                          <li>• Verify correct crimp tool and die size</li>
                          <li>• Ensure full tool closure for complete crimp</li>
                          <li>• Use fresh wire end if strands are damaged</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Problem 2 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Problem: Terminal won&apos;t insert into housing
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Causes:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Wrong terminal type for housing</li>
                          <li>• Terminal retention lance bent or damaged</li>
                          <li>• Incorrect orientation</li>
                          <li>• Obstruction in housing cavity</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Solutions:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Verify terminal type matches connector specification</li>
                          <li>• Inspect retention lance - replace terminal if damaged</li>
                          <li>• Check terminal orientation guide on housing</li>
                          <li>• Inspect cavity for debris or previous terminal remnants</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Problem 3 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Problem: High contact resistance or intermittent connection
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Causes:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Poor crimp quality (inadequate metal-to-metal contact)</li>
                          <li>• Oxidation or contamination on terminals</li>
                          <li>• Terminal not fully inserted in housing</li>
                          <li>• Damaged contact area</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Solutions:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Remove and replace with properly crimped terminal</li>
                          <li>• Clean contacts with electronic contact cleaner</li>
                          <li>• Verify terminal is fully locked (should hear/feel click)</li>
                          <li>• Inspect for bent or damaged contact springs</li>
                          <li>• Measure contact resistance - should be less than 5 milliohms</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Problem 4 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Problem: Connectors won&apos;t mate properly
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Causes:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Mismatched keying codes</li>
                          <li>• Bent or damaged pins/terminals</li>
                          <li>• Foreign material in connector</li>
                          <li>• Incorrect connector pairing</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Solutions:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Verify keying codes match (check connector markings)</li>
                          <li>• Inspect for bent pins - carefully straighten if possible</li>
                          <li>• Clean both connectors with compressed air</li>
                          <li>• Confirm connector types are compatible (check part numbers)</li>
                          <li>• Ensure correct alignment during mating</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Problem 5 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Problem: Terminal backs out after insertion
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Causes:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Terminal not fully seated (incomplete insertion)</li>
                          <li>• Damaged retention lance</li>
                          <li>• Excessive wire tension or pulling</li>
                          <li>• Wrong terminal type</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Solutions:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>
                            • Remove terminal and re-insert, ensuring positive click/lock
                          </li>
                          <li>• Replace terminal if lance is damaged</li>
                          <li>• Add strain relief to prevent wire tension</li>
                          <li>• Verify correct terminal part number for housing</li>
                          <li>• Check that locking feature fully engages</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Problem 6 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Problem: Overheating or melted connector
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Causes:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Excessive current for wire/terminal rating</li>
                          <li>• Poor crimp creating high resistance</li>
                          <li>• Corroded or contaminated contacts</li>
                          <li>• Loose connection</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Solutions:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• Verify current load is within connector rating</li>
                          <li>• Replace connector and re-terminate with quality crimps</li>
                          <li>• Use larger wire gauge if current is near limit</li>
                          <li>• Check for high resistance with multimeter</li>
                          <li>• Ensure proper terminal insertion and locking</li>
                          <li>• Consider parallel circuits for high-current applications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Still Having Problems?
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    If you&apos;ve tried these solutions and still experiencing issues:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 mb-3">
                    <li>• Review the complete installation guide from Step 1</li>
                    <li>• Verify you have correct components for your application</li>
                    <li>• Consult manufacturer datasheets for specific requirements</li>
                    <li>• Consider replacing all components with fresh parts</li>
                  </ul>
                  <Button variant="outline" className="mt-2" asChild>
                    <a href="#contact">
                      Contact Technical Support
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
                <CardTitle className="text-lg">Installation Checklist</CardTitle>
                <CardDescription>Track your progress</CardDescription>
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
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/resources"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>All Resources</span>
                </Link>
                <Link
                  href="/resources/connector-guide"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <Cable className="h-4 w-4 text-gray-500" />
                  <span>Connector Selection Guide</span>
                </Link>
                <a
                  href="#contact"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                  <span>Technical Support</span>
                </a>
              </CardContent>
            </Card>

            {/* Quality Standards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">Compliant With:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• IEC 60352 (Crimping)</li>
                    <li>• IEC 60603 (Connectors)</li>
                    <li>• UL 310 (Wire Terminals)</li>
                    <li>• ISO 8092 (Contact Retention)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Version Info */}
            <Card>
              <CardContent className="py-4 text-xs text-gray-500">
                <p className="mb-1">
                  <strong>Document Version:</strong> 2.1
                </p>
                <p className="mb-1">
                  <strong>Last Updated:</strong> March 2025
                </p>
                <p>
                  <strong>Next Review:</strong> September 2025
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
            <h2 className="text-3xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Our technical support team is here to assist with connector selection, installation
              questions, and troubleshooting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary">
                <HelpCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                <Download className="mr-2 h-5 w-5" />
                Download Full Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
