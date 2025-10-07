import { supabase } from '@/lib/supabase/client'
import { Connector } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TerminalGallery } from '@/components/TerminalGallery'
import {
  Download,
  AlertCircle,
  Zap,
  Package,
  Cpu,
  ArrowUpDown,
  FileText,
  CheckCircle,
  ShoppingCart,
  ChevronRight,
  Info,
  Play
} from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ConnectorPageProps {
  params: Promise<{ id: string }>
}

export default async function ConnectorPage({ params }: ConnectorPageProps) {
  const { id } = await params

  // Fetch connector from Supabase
  const { data: connector, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !connector) {
    notFound()
  }

  const typedConnector = connector as Connector

  const genderColor =
    typedConnector.gender === 'Female' ? 'bg-blue-500' :
    typedConnector.gender === 'Male' ? 'bg-orange-500' :
    'bg-green-500'

  // Fetch terminals for this connector
  const { data: terminals } = await supabase
    .from('terminals')
    .select('*')
    .eq('terminal_type', typedConnector.terminal_suffix)

  // Fetch mating connectors
  const { data: matingConnectors } = typedConnector.mates_with && typedConnector.mates_with.length > 0
    ? await supabase
        .from('connectors')
        .select('id, model, display_name, gender, pole_count, orientation, video_360_url')
        .in('id', typedConnector.mates_with)
    : { data: null }

  // Fetch assembly variants
  const { data: assemblyVariantConnectors } = typedConnector.assembly_variants && typedConnector.assembly_variants.length > 0
    ? await supabase
        .from('connectors')
        .select('id, model, display_name, gender, pole_count, orientation, video_360_url')
        .in('id', typedConnector.assembly_variants)
    : { data: null }

  // Quick specs for the hero section
  const quickSpecs = [
    {
      icon: <Zap className="h-5 w-5" />,
      label: 'Poles',
      value: typedConnector.pole_count.toString()
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      label: 'Type',
      value: typedConnector.connector_type === 'R' || typedConnector.connector_type === 'S'
        ? 'Socket'
        : typedConnector.connector_type === 'T'
          ? 'Tab'
          : 'PCB'
    },
    {
      icon: <ArrowUpDown className="h-5 w-5" />,
      label: 'Orientation',
      value: typedConnector.orientation || 'Standard'
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Series',
      value: 'CS'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/catalog" className="hover:text-gray-700">Catalog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{typedConnector.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Video and Title */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Video Player */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-700 relative group">
                  <video
                    src={typedConnector.video_360_url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="bg-black/50 backdrop-blur text-white">
                      360° View
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`${genderColor} text-white`}>
                {typedConnector.gender}
              </Badge>
              <Badge variant="outline">
                {typedConnector.category}
              </Badge>
              {typedConnector.is_special_version && (
                <Badge variant="destructive">
                  Special Version
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Product Info and Specifications */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {typedConnector.model}
              </h1>
              <p className="text-xl text-gray-600">
                {typedConnector.display_name || `${typedConnector.pole_count}-Pole ${typedConnector.gender} Connector`}
              </p>
              {typedConnector.special_notes && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{typedConnector.special_notes}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Specifications Table */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Model</td>
                        <td className="py-2 px-3 text-gray-900 font-semibold">{typedConnector.model}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Series</td>
                        <td className="py-2 px-3 text-gray-900">CS</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Gender</td>
                        <td className="py-2 px-3">
                          <Badge className={`${genderColor} text-white`}>
                            {typedConnector.gender}
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Pole Count</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.pole_count}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Orientation</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.orientation || 'Standard'}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Terminal Type</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.terminal_suffix}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">Category</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.category}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Status Badge */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">In Stock</span>
                </div>
                <span className="text-sm text-green-700">Contact for availability</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Specs - Horizontal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickSpecs.map((spec, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    {spec.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {spec.label}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {spec.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Content Section */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1 bg-gray-100">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="compatibility"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              Compatibility
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              Documentation
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Product Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">High-Quality Construction</p>
                      <p className="text-sm text-gray-600">Durable materials for long-lasting performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{typedConnector.pole_count}-Pole Configuration</p>
                      <p className="text-sm text-gray-600">Optimal for power and signal transmission</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Industry Standard</p>
                      <p className="text-sm text-gray-600">Compatible with CS series specifications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terminal Requirements Detail */}
              <Card>
                <CardHeader>
                  <CardTitle>Terminal Requirements</CardTitle>
                  <p className="text-sm text-gray-600">
                    {typedConnector.terminal_description || `Requires ${typedConnector.terminal_suffix} terminals`}
                  </p>
                </CardHeader>
                <CardContent>
                  {terminals && terminals.length > 0 ? (
                    <TerminalGallery terminals={terminals} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="font-medium">Terminal specifications</p>
                      <p className="text-sm mt-1">{typedConnector.terminal_specs?.join(', ') || 'Contact for details'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="space-y-8">
            {/* Mating Connectors */}
            {matingConnectors && matingConnectors.length > 0 && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Compatible Mating Connectors</h3>
                  <p className="text-gray-600 mt-1">Direct mating partners for this connector</p>
                </div>

                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                    {matingConnectors.map((mate) => (
                      <Card
                        key={mate.id}
                        className="min-w-[280px] snap-start hover:shadow-lg transition-shadow group"
                      >
                        <CardContent className="p-0">
                          <a href={`/connector/${mate.id}`} className="block">
                            <div className="aspect-square bg-black relative overflow-hidden">
                              <video
                                src={mate.video_360_url}
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
                                  360° View
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                {mate.model}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {mate.display_name}
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Badge className={mate.gender === 'Female' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}>
                                  {mate.gender}
                                </Badge>
                                <Badge variant="outline">{mate.pole_count}-Pole</Badge>
                                {mate.orientation && (
                                  <Badge variant="secondary">{mate.orientation}</Badge>
                                )}
                              </div>
                            </div>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Assembly Variants */}
            {assemblyVariantConnectors && assemblyVariantConnectors.length > 0 && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Assembly Variants</h3>
                  <p className="text-gray-600 mt-1">Alternative orientations and configurations</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assemblyVariantConnectors.map((variant) => (
                    <Card key={variant.id} className="hover:shadow-lg transition-shadow group">
                      <CardContent className="p-0">
                        <a href={`/connector/${variant.id}`} className="block">
                          <div className="aspect-square bg-black relative overflow-hidden">
                            <video
                              src={variant.video_360_url}
                              className="w-full h-full object-contain"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {variant.model}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {variant.display_name}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {variant.orientation}
                            </Badge>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!matingConnectors && !assemblyVariantConnectors && (
              <Card className="border-gray-200">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Compatibility Information Available
                  </h3>
                  <p className="text-gray-600">
                    Contact our technical support team for compatibility details
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Keying Documentation */}
              {typedConnector.keying_pdf ? (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Keying Documentation
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Detailed keying specifications and configurations
                    </p>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={`https://rbbjnwebxrxzxvwgdykf.supabase.co/storage/v1/object/public/keying-pdfs/${typedConnector.keying_pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded border border-gray-200">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600">
                            {typedConnector.keying_pdf}
                          </p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-500">
                      <FileText className="h-5 w-5" />
                      Keying Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      No keying documentation available for this connector
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Technical Drawings - Placeholder */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-500">
                    <FileText className="h-5 w-5" />
                    Technical Drawings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Technical drawings coming soon
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <p className="text-sm text-gray-600">
                  Need more information? Contact our technical support team
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    Datasheet
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <Package className="mr-2 h-4 w-4" />
                    3D Model
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <Info className="mr-2 h-4 w-4" />
                    Application Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-12 max-w-md mx-auto space-y-3">
          <Button
            className="w-full h-12 text-lg font-semibold"
            size="lg"
            disabled
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Project
            <Badge className="ml-2 bg-white/20" variant="secondary">
              Coming Soon
            </Badge>
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
            disabled
          >
            <FileText className="mr-2 h-5 w-5" />
            Request Quote
          </Button>
        </div>
      </div>
    </div>
  )
}