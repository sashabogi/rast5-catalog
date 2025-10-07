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
import { getTranslations } from 'next-intl/server'

interface ConnectorPageProps {
  params: Promise<{ id: string; locale: string }>
}

export default async function ConnectorPage({ params }: ConnectorPageProps) {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: 'ConnectorDetailPage' })

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
      label: await t('quickSpecs.poles'),
      value: typedConnector.pole_count.toString()
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      label: await t('quickSpecs.type'),
      value: typedConnector.connector_type === 'R' || typedConnector.connector_type === 'S'
        ? await t('quickSpecs.typeSocket')
        : typedConnector.connector_type === 'T'
          ? await t('quickSpecs.typeTab')
          : await t('quickSpecs.typePCB')
    },
    {
      icon: <ArrowUpDown className="h-5 w-5" />,
      label: await t('quickSpecs.orientation'),
      value: typedConnector.orientation || await t('quickSpecs.orientationStandard')
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: await t('quickSpecs.series'),
      value: 'CS'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-gray-700">{t('breadcrumbs.home')}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/catalog`} className="hover:text-gray-700">{t('breadcrumbs.catalog')}</Link>
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
                      {t('video.badge360')}
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
                  {t('badges.specialVersion')}
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
                {typedConnector.display_name || t('product.defaultDisplayName', { poleCount: typedConnector.pole_count, gender: typedConnector.gender })}
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
                <CardTitle>{t('specs.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.model')}</td>
                        <td className="py-2 px-3 text-gray-900 font-semibold">{typedConnector.model}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.series')}</td>
                        <td className="py-2 px-3 text-gray-900">CS</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.gender')}</td>
                        <td className="py-2 px-3">
                          <Badge className={`${genderColor} text-white`}>
                            {typedConnector.gender}
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.poleCount')}</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.pole_count}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.orientation')}</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.orientation || t('specs.orientationStandard')}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.terminalType')}</td>
                        <td className="py-2 px-3 text-gray-900">{typedConnector.terminal_suffix}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-700">{t('specs.category')}</td>
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
                  <span className="font-medium text-green-900">{t('status.inStock')}</span>
                </div>
                <span className="text-sm text-green-700">{t('status.contactForAvailability')}</span>
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
              {t('tabs.overview')}
            </TabsTrigger>
            <TabsTrigger
              value="compatibility"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              {t('tabs.compatibility')}
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              {t('tabs.documentation')}
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
                    {t('overview.highlights.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('overview.highlights.quality.title')}</p>
                      <p className="text-sm text-gray-600">{t('overview.highlights.quality.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('overview.highlights.configuration.title', { poleCount: typedConnector.pole_count })}</p>
                      <p className="text-sm text-gray-600">{t('overview.highlights.configuration.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('overview.highlights.standard.title')}</p>
                      <p className="text-sm text-gray-600">{t('overview.highlights.standard.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terminal Requirements Detail */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('overview.terminals.title')}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {typedConnector.terminal_description || t('overview.terminals.requires', { terminalSuffix: typedConnector.terminal_suffix })}
                  </p>
                </CardHeader>
                <CardContent>
                  {terminals && terminals.length > 0 ? (
                    <TerminalGallery terminals={terminals} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="font-medium">{t('overview.terminals.specifications')}</p>
                      <p className="text-sm mt-1">{typedConnector.terminal_specs?.join(', ') || t('overview.terminals.contactForDetails')}</p>
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
                  <h3 className="text-2xl font-bold text-gray-900">{t('compatibility.mating.title')}</h3>
                  <p className="text-gray-600 mt-1">{t('compatibility.mating.description')}</p>
                </div>

                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                    {matingConnectors.map((mate) => (
                      <Card
                        key={mate.id}
                        className="min-w-[280px] snap-start hover:shadow-lg transition-shadow group"
                      >
                        <CardContent className="p-0">
                          <a href={`/${locale}/connector/${mate.id}`} className="block">
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
                                  {t('video.badge360')}
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
                                <Badge variant="outline">{t('compatibility.card.poleBadge', { count: mate.pole_count })}</Badge>
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
                  <h3 className="text-2xl font-bold text-gray-900">{t('compatibility.variants.title')}</h3>
                  <p className="text-gray-600 mt-1">{t('compatibility.variants.description')}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assemblyVariantConnectors.map((variant) => (
                    <Card key={variant.id} className="hover:shadow-lg transition-shadow group">
                      <CardContent className="p-0">
                        <a href={`/${locale}/connector/${variant.id}`} className="block">
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
                    {t('compatibility.noInfo.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('compatibility.noInfo.description')}
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
                      {t('documentation.keying.title')}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {t('documentation.keying.description')}
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
                          <p className="text-xs text-gray-500">{t('documentation.pdfDocument')}</p>
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
                      {t('documentation.keying.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {t('documentation.keying.noAvailable')}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Technical Drawings - Placeholder */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-500">
                    <FileText className="h-5 w-5" />
                    {t('documentation.drawings.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {t('documentation.drawings.comingSoon')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>{t('documentation.resources.title')}</CardTitle>
                <p className="text-sm text-gray-600">
                  {t('documentation.resources.description')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    {t('documentation.resources.datasheet')}
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <Package className="mr-2 h-4 w-4" />
                    {t('documentation.resources.model3d')}
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <Info className="mr-2 h-4 w-4" />
                    {t('documentation.resources.applicationNotes')}
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
            {t('actions.addToProject')}
            <Badge className="ml-2 bg-white/20" variant="secondary">
              {t('actions.comingSoon')}
            </Badge>
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
            disabled
          >
            <FileText className="mr-2 h-5 w-5" />
            {t('actions.requestQuote')}
          </Button>
        </div>
      </div>
    </div>
  )
}