'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { Button } from '@/components/ui/button'
import { SafetyWarning } from '@/components/content/SafetyWarning'
import { InstallationSteps } from '@/components/content/InstallationSteps'
import { InstallationSidebar } from '@/components/content/InstallationSidebar'
import { TroubleshootingSection } from '@/components/content/TroubleshootingSection'
import { BookOpen, Printer, Download, HelpCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function InstallationPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('InstallationGuide')

  const handlePrint = () => {
    window.print()
  }

  // Troubleshooting problems data
  const troubleshootingProblems = [
    {
      title: t('troubleshooting.problem1.title'),
      causes: [
        t('troubleshooting.problem1.causes.items.1'),
        t('troubleshooting.problem1.causes.items.2'),
        t('troubleshooting.problem1.causes.items.3'),
      ],
      solutions: [
        t('troubleshooting.problem1.solutions.items.1'),
        t('troubleshooting.problem1.solutions.items.2'),
        t('troubleshooting.problem1.solutions.items.3'),
        t('troubleshooting.problem1.solutions.items.4'),
      ],
    },
    {
      title: t('troubleshooting.problem2.title'),
      causes: [
        t('troubleshooting.problem2.causes.items.1'),
        t('troubleshooting.problem2.causes.items.2'),
        t('troubleshooting.problem2.causes.items.3'),
        t('troubleshooting.problem2.causes.items.4'),
      ],
      solutions: [
        t('troubleshooting.problem2.solutions.items.1'),
        t('troubleshooting.problem2.solutions.items.2'),
        t('troubleshooting.problem2.solutions.items.3'),
        t('troubleshooting.problem2.solutions.items.4'),
      ],
    },
    {
      title: t('troubleshooting.problem3.title'),
      causes: [
        t('troubleshooting.problem3.causes.items.1'),
        t('troubleshooting.problem3.causes.items.2'),
        t('troubleshooting.problem3.causes.items.3'),
        t('troubleshooting.problem3.causes.items.4'),
      ],
      solutions: [
        t('troubleshooting.problem3.solutions.items.1'),
        t('troubleshooting.problem3.solutions.items.2'),
        t('troubleshooting.problem3.solutions.items.3'),
        t('troubleshooting.problem3.solutions.items.4'),
        t('troubleshooting.problem3.solutions.items.5'),
      ],
    },
    {
      title: t('troubleshooting.problem4.title'),
      causes: [
        t('troubleshooting.problem4.causes.items.1'),
        t('troubleshooting.problem4.causes.items.2'),
        t('troubleshooting.problem4.causes.items.3'),
        t('troubleshooting.problem4.causes.items.4'),
      ],
      solutions: [
        t('troubleshooting.problem4.solutions.items.1'),
        t('troubleshooting.problem4.solutions.items.2'),
        t('troubleshooting.problem4.solutions.items.3'),
        t('troubleshooting.problem4.solutions.items.4'),
        t('troubleshooting.problem4.solutions.items.5'),
      ],
    },
    {
      title: t('troubleshooting.problem5.title'),
      causes: [
        t('troubleshooting.problem5.causes.items.1'),
        t('troubleshooting.problem5.causes.items.2'),
        t('troubleshooting.problem5.causes.items.3'),
        t('troubleshooting.problem5.causes.items.4'),
      ],
      solutions: [
        t('troubleshooting.problem5.solutions.items.1'),
        t('troubleshooting.problem5.solutions.items.2'),
        t('troubleshooting.problem5.solutions.items.3'),
        t('troubleshooting.problem5.solutions.items.4'),
        t('troubleshooting.problem5.solutions.items.5'),
      ],
    },
    {
      title: t('troubleshooting.problem6.title'),
      causes: [
        t('troubleshooting.problem6.causes.items.1'),
        t('troubleshooting.problem6.causes.items.2'),
        t('troubleshooting.problem6.causes.items.3'),
        t('troubleshooting.problem6.causes.items.4'),
      ],
      solutions: [
        t('troubleshooting.problem6.solutions.items.1'),
        t('troubleshooting.problem6.solutions.items.2'),
        t('troubleshooting.problem6.solutions.items.3'),
        t('troubleshooting.problem6.solutions.items.4'),
        t('troubleshooting.problem6.solutions.items.5'),
        t('troubleshooting.problem6.solutions.items.6'),
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <PageHero
        title={
          <span className="font-inter font-bold">
            {t('hero.title')}
          </span>
        }
        subtitle={t('hero.subtitle')}
        icon={
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        }
        isDark={true}
        actions={
          <>
            <Button size="lg" onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Printer className="mr-2 h-5 w-5" />
              {t('quickActions.printGuide')}
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              <Download className="mr-2 h-5 w-5" />
              {t('quickActions.downloadPdf')}
            </Button>
          </>
        }
      />

      {/* Quick Actions Bar */}
      <div className="bg-white border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link href={`/${locale}/resources`} className="hover:text-blue-600 transition-colors font-inter">
                {t('hero.breadcrumb.resources')}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-inter font-semibold text-slate-900">{t('hero.breadcrumb.current')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Critical Safety Warning */}
            <SafetyWarning />

            {/* Getting Started Section - Simplified with just workspace setup */}
            <SectionContainer variant="default" spacing="small" className="px-0">
              <div className="p-6 bg-white rounded-xl border-2 border-slate-200" data-aos="fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-inter font-bold text-slate-900">
                    {t('gettingStarted.title')}
                  </h3>
                </div>
                <p className="text-slate-600 mb-6">{t('gettingStarted.description')}</p>

                {/* Workspace Setup */}
                <div>
                  <h4 className="font-inter font-bold text-lg mb-4 text-slate-800">
                    {t('gettingStarted.workspaceSetup.title')}
                  </h4>
                  <ul className="space-y-3">
                    {['1', '2', '3', '4'].map((num) => (
                      <li key={num} className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center text-sm font-inter font-bold flex-shrink-0">
                          {num}
                        </div>
                        <span className="text-slate-700 font-inter">{t(`gettingStarted.workspaceSetup.items.${num}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionContainer>

            {/* Step-by-Step Installation Process */}
            <SectionContainer variant="default" spacing="small" className="px-0">
              <InstallationSteps />
            </SectionContainer>

            {/* Troubleshooting Section */}
            <SectionContainer variant="default" spacing="small" className="px-0">
              <div data-aos="fade-up">
                <h2 className="text-2xl font-inter font-bold text-slate-900 mb-2">
                  {t('troubleshooting.title')}
                </h2>
                <p className="text-slate-600 mb-6">{t('troubleshooting.description')}</p>
                <TroubleshootingSection problems={troubleshootingProblems} />
              </div>
            </SectionContainer>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <InstallationSidebar locale={locale} />
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <SectionContainer variant="dark" spacing="medium">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-inter font-bold text-white mb-6">
            {t('contactSupport.title')}
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {t('contactSupport.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <HelpCircle className="mr-2 h-5 w-5" />
              {t('contactSupport.buttons.contactSupport')}
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              <Download className="mr-2 h-5 w-5" />
              {t('contactSupport.buttons.downloadDocumentation')}
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
