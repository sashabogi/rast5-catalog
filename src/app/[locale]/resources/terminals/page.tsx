'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { InfoCard } from '@/components/content/InfoCard'
import { StepGuide } from '@/components/content/StepGuide'
import {
  TerminalTypesSection,
  MaterialDetailsSection,
  RequiredToolsSection,
  TerminalRemovalSection,
  CommonMistakesSection,
  DownloadResourcesSection,
  RelatedResourcesSection
} from '@/components/content'
import {
  WrenchIcon,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Cable,
  Info,
  CheckCircle,
  Gauge,
  Zap,
  Ruler,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TerminalsPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('TerminalsGuide')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <PageHero
        title={<span className="font-inter font-bold">{t('hero.title')}</span>}
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
          <InfoCard
            icon={Cable}
            iconGradient="from-blue-600 to-indigo-600"
            title={t('overview.whatAreTerminals.title')}
            description={t('overview.whatAreTerminals.description')}
            className="border-2 border-blue-100 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50"
          />
          <InfoCard
            icon={Info}
            iconGradient="from-green-600 to-emerald-600"
            title={t('overview.whyDifferentTypes.title')}
            description={t('overview.whyDifferentTypes.description')}
            className="border-2 border-green-100 hover:border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <InfoCard
            icon={CheckCircle}
            iconGradient="from-purple-600 to-pink-600"
            title={t('overview.namingConvention.title')}
            description={t('overview.namingConvention.description')}
            className="border-2 border-purple-100 hover:border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>
      </SectionContainer>

      {/* Terminal Types Section */}
      <SectionContainer variant="default" spacing="large">
        <TerminalTypesSection translationNamespace="TerminalsGuide" />
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
          <InfoCard
            icon={Gauge}
            iconGradient="from-blue-100 to-indigo-100"
            title={t('technicalSpecs.currentRating.title')}
            description={t('technicalSpecs.currentRating.description')}
            badge={t('technicalSpecs.currentRating.value')}
            className="text-center border-2 border-slate-200 hover:border-blue-400"
          />
          <InfoCard
            icon={Zap}
            iconGradient="from-blue-100 to-indigo-100"
            title={t('technicalSpecs.voltageRating.title')}
            description={t('technicalSpecs.voltageRating.description')}
            badge={t('technicalSpecs.voltageRating.value')}
            className="text-center border-2 border-slate-200 hover:border-blue-400"
          />
          <InfoCard
            icon={Ruler}
            iconGradient="from-blue-100 to-indigo-100"
            title={t('technicalSpecs.wireRange.title')}
            description={t('technicalSpecs.wireRange.description')}
            badge={t('technicalSpecs.wireRange.value')}
            className="text-center border-2 border-slate-200 hover:border-blue-400"
          />
          <InfoCard
            icon={ShieldCheck}
            iconGradient="from-blue-100 to-indigo-100"
            title={t('technicalSpecs.contactMaterial.title')}
            description={t('technicalSpecs.contactMaterial.description')}
            badge={t('technicalSpecs.contactMaterial.value')}
            className="text-center border-2 border-slate-200 hover:border-blue-400"
          />
        </div>

        <MaterialDetailsSection translationNamespace="TerminalsGuide" />
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

        <RequiredToolsSection translationNamespace="TerminalsGuide" />

        <StepGuide
          steps={[
            {
              number: 1,
              title: t('installation.steps.1.title'),
              description: t('installation.steps.1.description'),
              warning: t('installation.steps.1.warning')
            },
            {
              number: 2,
              title: t('installation.steps.2.title'),
              description: t('installation.steps.2.description'),
              warning: t('installation.steps.2.warning')
            },
            {
              number: 3,
              title: t('installation.steps.3.title'),
              description: t('installation.steps.3.description'),
              warning: t('installation.steps.3.warning')
            },
            {
              number: 4,
              title: t('installation.steps.4.title'),
              description: t('installation.steps.4.description'),
              warning: t('installation.steps.4.warning')
            },
            {
              number: 5,
              title: t('installation.steps.5.title'),
              description: t('installation.steps.5.description'),
              warning: t('installation.steps.5.warning')
            }
          ]}
        />

        <TerminalRemovalSection translationNamespace="TerminalsGuide" />
      </SectionContainer>

      {/* Common Mistakes Section */}
      <SectionContainer variant="gradient" spacing="large">
        <CommonMistakesSection translationNamespace="TerminalsGuide" />
      </SectionContainer>

      {/* Download Resources Section */}
      <SectionContainer variant="dark" spacing="medium">
        <DownloadResourcesSection translationNamespace="TerminalsGuide" />
      </SectionContainer>

      {/* Related Resources Section */}
      <SectionContainer variant="gradient" spacing="large">
        <RelatedResourcesSection translationNamespace="TerminalsGuide" />
      </SectionContainer>
    </div>
  )
}
