import { supabase } from '@/lib/supabase/client'
import { Connector } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TerminalGallery } from '@/components/TerminalGallery'
import { TechnicalDrawingViewer } from '@/components/TechnicalDrawingViewer'
import { PageHero, SectionContainer } from '@/components/shared'
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
  Play,
  Cable
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
    <div className="min-h-screen bg-white">
      {/* Hero Section with Dark Background */}
      <PageHero
        isDark={true}
        title={
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl md:text-6xl font-bold">{typedConnector.model}</h1>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className={`${genderColor} text-white px-4 py-1.5 text-sm font-semibold`}>
                {typedConnector.gender}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur text-white border-white/30 px-4 py-1.5 text-sm font-semibold">
                {typedConnector.category}
              </Badge>
              {typedConnector.is_special_version && (
                <Badge className="bg-red-500 text-white px-4 py-1.5 text-sm font-semibold">
                  {t('badges.specialVersion')}
                </Badge>
              )}
            </div>
          </div>
        }
        subtitle={typedConnector.display_name || t('product.defaultDisplayName', { poleCount: typedConnector.pole_count, gender: typedConnector.gender })}
        icon={<Cable className="h-16 w-16 text-white/80" />}
      />

      {/* Breadcrumbs */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-slate-600" data-aos="fade-right">
            <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors font-semibold">{t('breadcrumbs.home')}</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href={`/${locale}/catalog`} className="hover:text-blue-600 transition-colors font-semibold">{t('breadcrumbs.catalog')}</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-bold">{typedConnector.model}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <SectionContainer variant="default" spacing="large">
        {/* Product Video and Details Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Video Player */}
          <div className="space-y-6" data-aos="fade-right" data-aos-delay="100">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-700 group">
              <div className="aspect-square relative">
                <video
                  src={typedConnector.video_360_url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 px-3 py-1.5 font-semibold">
                    <Play className="h-3 w-3 mr-1.5" />
                    {t('video.badge360')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Special Notes Alert */}
            {typedConnector.special_notes && (
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-900 text-sm mb-1">{t('product.specialNote')}</p>
                    <p className="text-sm text-amber-800 leading-relaxed">{typedConnector.special_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Specifications */}
          <div className="space-y-8" data-aos="fade-left" data-aos-delay="100">
            {/* Specifications Card with Modern Design */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t('specs.title')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Model Row */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.model')}</span>
                    <span className="text-lg font-bold text-slate-900">{typedConnector.model}</span>
                  </div>

                  {/* Series Row */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.series')}</span>
                    <span className="text-lg font-bold text-slate-900">CS</span>
                  </div>

                  {/* Gender Row */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.gender')}</span>
                    <Badge className={`${genderColor} text-white px-3 py-1 font-bold`}>
                      {typedConnector.gender}
                    </Badge>
                  </div>

                  {/* Pole Count Row */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.poleCount')}</span>
                    <span className="text-lg font-bold text-slate-900">{typedConnector.pole_count}</span>
                  </div>

                  {/* Orientation Row */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.orientation')}</span>
                    <span className="text-lg font-bold text-slate-900">{typedConnector.orientation || t('specs.orientationStandard')}</span>
                  </div>

                  {/* Terminal Type Row */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.terminalType')}</span>
                    <span className="text-lg font-bold text-slate-900">{typedConnector.terminal_suffix}</span>
                  </div>

                  {/* Category Row */}
                  <div className="flex items-center justify-between py-3 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('specs.category')}</span>
                    <span className="text-lg font-bold text-slate-900">{typedConnector.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card with Modern Design */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-lg">{t('status.inStock')}</p>
                    <p className="text-sm text-green-700">{t('status.contactForAvailability')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Specs Section with Modern Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8" data-aos="fade-up">
            {t('quickSpecs.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickSpecs.map((spec, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 overflow-hidden group"
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
              >
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {spec.icon}
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {spec.label}
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {spec.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed Content Section with Modern Design */}
        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-auto p-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-xl py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 data-[state=active]:text-blue-600"
            >
              {t('tabs.overview')}
            </TabsTrigger>
            <TabsTrigger
              value="compatibility"
              className="data-[state=active]:bg-white data-[state=active]:shadow-xl py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 data-[state=active]:text-blue-600"
            >
              {t('tabs.compatibility')}
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-white data-[state=active]:shadow-xl py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 data-[state=active]:text-blue-600"
            >
              {t('tabs.documentation')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-10" data-aos="fade-up">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Highlights Card */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {t('overview.highlights.title')}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-1">{t('overview.highlights.quality.title')}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{t('overview.highlights.quality.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-1">{t('overview.highlights.configuration.title', { poleCount: typedConnector.pole_count })}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{t('overview.highlights.configuration.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-1">{t('overview.highlights.standard.title')}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{t('overview.highlights.standard.description')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Requirements Card */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">{t('overview.terminals.title')}</h3>
                  <p className="text-sm text-orange-100 mt-1">
                    {typedConnector.terminal_description || t('overview.terminals.requires', { terminalSuffix: typedConnector.terminal_suffix })}
                  </p>
                </div>
                <div className="p-6">
                  {terminals && terminals.length > 0 ? (
                    <TerminalGallery terminals={terminals} />
                  ) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-orange-100 rounded-full inline-flex mb-4">
                        <AlertCircle className="h-12 w-12 text-orange-600" />
                      </div>
                      <p className="font-bold text-slate-900 mb-2">{t('overview.terminals.specifications')}</p>
                      <p className="text-sm text-slate-600">{typedConnector.terminal_specs?.join(', ') || t('overview.terminals.contactForDetails')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="space-y-12">
            {/* Mating Connectors */}
            {matingConnectors && matingConnectors.length > 0 && (
              <div data-aos="fade-up">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{t('compatibility.mating.title')}</h3>
                  <p className="text-lg text-slate-600">{t('compatibility.mating.description')}</p>
                </div>

                <div className="relative">
                  <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    {matingConnectors.map((mate, index) => (
                      <div
                        key={mate.id}
                        className="min-w-[320px] snap-start"
                        data-aos="fade-up"
                        data-aos-delay={100 + index * 50}
                      >
                        <a href={`/${locale}/connector/${mate.id}`} className="block group">
                          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-400">
                            <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
                              <video
                                src={mate.video_360_url}
                                className="w-full h-full object-contain"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <Badge className="bg-white/95 backdrop-blur text-slate-900 border-slate-200 font-bold">
                                  <Play className="h-3 w-3 mr-1.5" />
                                  {t('video.badge360')}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-5">
                              <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                                {mate.model}
                              </p>
                              <p className="text-sm text-slate-600 mb-4">
                                {mate.display_name}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge className={`${mate.gender === 'Female' ? 'bg-blue-500' : 'bg-orange-500'} text-white font-bold px-3`}>
                                  {mate.gender}
                                </Badge>
                                <Badge className="bg-slate-100 text-slate-700 font-bold border-slate-300">
                                  {t('compatibility.card.poleBadge', { count: mate.pole_count })}
                                </Badge>
                                {mate.orientation && (
                                  <Badge className="bg-green-100 text-green-700 font-bold border-green-300">
                                    {mate.orientation}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Assembly Variants */}
            {assemblyVariantConnectors && assemblyVariantConnectors.length > 0 && (
              <div data-aos="fade-up">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{t('compatibility.variants.title')}</h3>
                  <p className="text-lg text-slate-600">{t('compatibility.variants.description')}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assemblyVariantConnectors.map((variant, index) => (
                    <div
                      key={variant.id}
                      data-aos="fade-up"
                      data-aos-delay={100 + index * 50}
                    >
                      <a href={`/${locale}/connector/${variant.id}`} className="block group">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-400">
                          <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
                            <video
                              src={variant.video_360_url}
                              className="w-full h-full object-contain"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-5">
                            <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                              {variant.model}
                            </p>
                            <p className="text-sm text-slate-600 mb-4">
                              {variant.display_name}
                            </p>
                            <Badge className="bg-purple-100 text-purple-700 font-bold border-purple-300">
                              {variant.orientation}
                            </Badge>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!matingConnectors && !assemblyVariantConnectors && (
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 p-12" data-aos="fade-up">
                <div className="text-center">
                  <div className="p-4 bg-slate-100 rounded-full inline-flex mb-6">
                    <AlertCircle className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {t('compatibility.noInfo.title')}
                  </h3>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    {t('compatibility.noInfo.description')}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-10" data-aos="fade-up">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Keying Documentation */}
              {typedConnector.keying_pdf ? (
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('documentation.keying.title')}
                    </h3>
                    <p className="text-sm text-blue-100 mt-1">
                      {t('documentation.keying.description')}
                    </p>
                  </div>
                  <div className="p-6">
                    <a
                      href={`https://rbbjnwebxrxzxvwgdykf.supabase.co/storage/v1/object/public/keying-pdfs/${typedConnector.keying_pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all duration-300 group border border-blue-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-md border border-slate-200">
                          <FileText className="h-7 w-7 text-red-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {typedConnector.keying_pdf}
                          </p>
                          <p className="text-sm text-slate-600">{t('documentation.pdfDocument')}</p>
                        </div>
                      </div>
                      <Download className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8">
                  <div className="text-center">
                    <div className="p-3 bg-slate-100 rounded-full inline-flex mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-500 mb-2">{t('documentation.keying.title')}</h3>
                    <p className="text-sm text-slate-500">
                      {t('documentation.keying.noAvailable')}
                    </p>
                  </div>
                </div>
              )}

              {/* Technical Drawings */}
              {typedConnector.technical_drawing_url ? (
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl border border-green-100 overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('documentation.drawings.title')}
                    </h3>
                    <p className="text-sm text-green-100 mt-1">
                      {t('documentation.drawings.description')}
                    </p>
                  </div>
                  <div className="p-6">
                    <TechnicalDrawingViewer
                      imageUrl={typedConnector.technical_drawing_url}
                      connectorModel={typedConnector.model}
                      description={t('documentation.drawings.description')}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8">
                  <div className="text-center">
                    <div className="p-3 bg-slate-100 rounded-full inline-flex mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-500 mb-2">{t('documentation.drawings.title')}</h3>
                    <p className="text-sm text-slate-500">
                      {t('documentation.drawings.comingSoon')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Resources */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">{t('documentation.resources.title')}</h3>
                <p className="text-sm text-slate-300 mt-1">
                  {t('documentation.resources.description')}
                </p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-6 justify-start border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                    disabled
                  >
                    <FileText className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                    <span className="font-semibold">{t('documentation.resources.datasheet')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-6 justify-start border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                    disabled
                  >
                    <Package className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                    <span className="font-semibold">{t('documentation.resources.model3d')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-6 justify-start border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                    disabled
                  >
                    <Info className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                    <span className="font-semibold">{t('documentation.resources.applicationNotes')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SectionContainer>

      {/* Call to Action Section */}
      <SectionContainer variant="gradient" spacing="large">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('actions.readyToOrder')}
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {t('actions.contactUs')}
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <Button
              className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
              disabled
            >
              <ShoppingCart className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t('actions.addToProject')}
              <Badge className="ml-3 bg-white/20 backdrop-blur text-white border-white/30 font-semibold">
                {t('actions.comingSoon')}
              </Badge>
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 text-lg font-bold border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 group"
              size="lg"
              disabled
            >
              <FileText className="mr-3 h-5 w-5 text-slate-600 group-hover:text-blue-600" />
              <span className="text-slate-700 group-hover:text-blue-600">{t('actions.requestQuote')}</span>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}