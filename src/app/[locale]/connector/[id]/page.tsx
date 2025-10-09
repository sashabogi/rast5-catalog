import { supabase } from '@/lib/supabase/client'
import { Connector } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionContainer } from '@/components/shared'
import {
  ProductHeader,
  ProductBreadcrumbs,
  ProductVideo,
  ProductSpecs,
  SpecialNotes,
  QuickSpecs,
  ProductHighlights,
  TerminalRequirements,
  MatingConnectors,
  AssemblyVariants,
  DocumentationSection,
  ProductActions
} from '@/components/product'
import type { QuickSpec, Highlight } from '@/components/product'
import {
  Zap,
  Package,
  Cpu,
  ArrowUpDown,
  FileText,
  Info,
  AlertCircle
} from 'lucide-react'
import { notFound } from 'next/navigation'
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

  // Quick specs data
  const quickSpecs: QuickSpec[] = [
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

  // Product highlights data
  const highlights: Highlight[] = [
    {
      title: await t('overview.highlights.quality.title'),
      description: await t('overview.highlights.quality.description')
    },
    {
      title: await t('overview.highlights.configuration.title', { poleCount: typedConnector.pole_count }),
      description: await t('overview.highlights.configuration.description')
    },
    {
      title: await t('overview.highlights.standard.title'),
      description: await t('overview.highlights.standard.description')
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ProductHeader
        model={typedConnector.model}
        displayName={typedConnector.display_name}
        gender={typedConnector.gender}
        category={typedConnector.category}
        isSpecialVersion={typedConnector.is_special_version}
        poleCount={typedConnector.pole_count}
        translations={{
          specialVersion: await t('badges.specialVersion'),
          defaultDisplayName: await t('product.defaultDisplayName')
        }}
      />

      {/* Breadcrumbs */}
      <ProductBreadcrumbs
        locale={locale}
        model={typedConnector.model}
        translations={{
          home: await t('breadcrumbs.home'),
          catalog: await t('breadcrumbs.catalog')
        }}
      />

      {/* Main Content */}
      <SectionContainer variant="default" spacing="large">
        {/* Product Video and Specifications Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <ProductVideo
              videoUrl={typedConnector.video_360_url}
              badge360Text={await t('video.badge360')}
            />
            {typedConnector.special_notes && (
              <div className="mt-6">
                <SpecialNotes
                  notes={typedConnector.special_notes}
                  specialNoteTitle={await t('product.specialNote')}
                />
              </div>
            )}
          </div>

          <ProductSpecs
            model={typedConnector.model}
            gender={typedConnector.gender}
            genderColor={genderColor}
            poleCount={typedConnector.pole_count}
            orientation={typedConnector.orientation}
            terminalSuffix={typedConnector.terminal_suffix}
            category={typedConnector.category}
            translations={{
              title: await t('specs.title'),
              model: await t('specs.model'),
              series: await t('specs.series'),
              gender: await t('specs.gender'),
              poleCount: await t('specs.poleCount'),
              orientation: await t('specs.orientation'),
              orientationStandard: await t('specs.orientationStandard'),
              terminalType: await t('specs.terminalType'),
              category: await t('specs.category'),
              statusInStock: await t('status.inStock'),
              statusContactForAvailability: await t('status.contactForAvailability')
            }}
          />
        </div>

        {/* Quick Specs Section */}
        <QuickSpecs specs={quickSpecs} title={await t('quickSpecs.title')} />

        {/* Tabbed Content Section */}
        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-auto p-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-xl py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 data-[state=active]:text-blue-600"
            >
              {await t('tabs.overview')}
            </TabsTrigger>
            <TabsTrigger
              value="compatibility"
              className="data-[state=active]:bg-white data-[state=active]:shadow-xl py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 data-[state=active]:text-blue-600"
            >
              {await t('tabs.compatibility')}
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-white data-[state=active]:shadow-xl py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 data-[state=active]:text-blue-600"
            >
              {await t('tabs.documentation')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-10" data-aos="fade-up">
            <div className="grid md:grid-cols-2 gap-8">
              <ProductHighlights highlights={highlights} title={await t('overview.highlights.title')} />
              <TerminalRequirements
                terminals={terminals}
                terminalSuffix={typedConnector.terminal_suffix}
                terminalDescription={typedConnector.terminal_description}
                terminalSpecs={typedConnector.terminal_specs}
                translations={{
                  title: await t('overview.terminals.title'),
                  requires: await t('overview.terminals.requires'),
                  specifications: await t('overview.terminals.specifications'),
                  contactForDetails: await t('overview.terminals.contactForDetails')
                }}
              />
            </div>
          </TabsContent>

          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="space-y-12">
            {matingConnectors && matingConnectors.length > 0 && (
              <MatingConnectors
                connectors={matingConnectors}
                locale={locale}
                translations={{
                  title: await t('compatibility.mating.title'),
                  description: await t('compatibility.mating.description'),
                  badge360: await t('video.badge360'),
                  poleBadge: await t('compatibility.card.poleBadge')
                }}
              />
            )}

            {assemblyVariantConnectors && assemblyVariantConnectors.length > 0 && (
              <AssemblyVariants
                variants={assemblyVariantConnectors}
                locale={locale}
                translations={{
                  title: await t('compatibility.variants.title'),
                  description: await t('compatibility.variants.description')
                }}
              />
            )}

            {!matingConnectors && !assemblyVariantConnectors && (
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 p-12" data-aos="fade-up">
                <div className="text-center">
                  <div className="p-4 bg-slate-100 rounded-full inline-flex mb-6">
                    <AlertCircle className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {await t('compatibility.noInfo.title')}
                  </h3>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    {await t('compatibility.noInfo.description')}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-10" data-aos="fade-up">
            <DocumentationSection
              keyingPdf={typedConnector.keying_pdf}
              technicalDrawingUrl={typedConnector.technical_drawing_url}
              connectorModel={typedConnector.model}
              translations={{
                keyingTitle: await t('documentation.keying.title'),
                keyingDescription: await t('documentation.keying.description'),
                keyingNoAvailable: await t('documentation.keying.noAvailable'),
                drawingsTitle: await t('documentation.drawings.title'),
                drawingsDescription: await t('documentation.drawings.description'),
                drawingsComingSoon: await t('documentation.drawings.comingSoon'),
                pdfDocument: await t('documentation.pdfDocument')
              }}
            />

            {/* Additional Resources */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">{await t('documentation.resources.title')}</h3>
                <p className="text-sm text-slate-300 mt-1">
                  {await t('documentation.resources.description')}
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
                    <span className="font-semibold">{await t('documentation.resources.datasheet')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-6 justify-start border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                    disabled
                  >
                    <Package className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                    <span className="font-semibold">{await t('documentation.resources.model3d')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-6 justify-start border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                    disabled
                  >
                    <Info className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                    <span className="font-semibold">{await t('documentation.resources.applicationNotes')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SectionContainer>

      {/* Call to Action Section */}
      <SectionContainer variant="gradient" spacing="large">
        <ProductActions
          translations={{
            readyToOrder: await t('actions.readyToOrder'),
            contactUs: await t('actions.contactUs'),
            addToProject: await t('actions.addToProject'),
            requestQuote: await t('actions.requestQuote'),
            comingSoon: await t('actions.comingSoon')
          }}
        />
      </SectionContainer>
    </div>
  )
}
