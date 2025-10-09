import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { Button } from '@/components/ui/button'
import {
  Compass,
  Wrench,
  Book,
  FileText,
  ArrowRight,
  Download,
  ExternalLink,
  Lightbulb,
  Shield,
  Cpu,
  Layers
} from 'lucide-react'

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ResourcesPage' })

  const resources = [
    {
      href: `/${locale}/catalog`,
      icon: FileText,
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200 hover:border-blue-400',
      title: t('keyingDocs.title'),
      description: t('keyingDocs.description'),
      details: t('keyingDocs.details'),
      badge: 'Catalog',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      href: `/${locale}/resources/connector-guide`,
      icon: Compass,
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200 hover:border-purple-400',
      title: t('selectionGuide.title'),
      description: t('selectionGuide.description'),
      badge: 'Interactive',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      href: `/${locale}/resources/terminals`,
      icon: Wrench,
      iconColor: 'text-orange-600',
      bgGradient: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200 hover:border-orange-400',
      title: t('terminals.title'),
      description: t('terminals.description'),
      badge: 'Technical',
      badgeColor: 'bg-orange-100 text-orange-700'
    },
    {
      href: `/${locale}/resources/installation`,
      icon: Book,
      iconColor: 'text-green-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200 hover:border-green-400',
      title: t('installation.title'),
      description: t('installation.description'),
      badge: 'Guide',
      badgeColor: 'bg-green-100 text-green-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <PageHero
        title={
          <span className="font-inter font-bold">
            {t('title')}
          </span>
        }
        subtitle={t('description')}
        icon={
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
        }
        isDark={true}
      />

      {/* Main Resources Grid */}
      <SectionContainer variant="gradient" spacing="large">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-inter font-bold text-slate-900 mb-4">
            Explore Our Resources
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Access comprehensive guides, technical documentation, and interactive tools to help you make the right connector choices
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16" data-aos="fade-up" data-aos-delay="100">
          {resources.map((resource, index) => (
            <Link key={resource.href} href={resource.href}>
              <div
                className={`group relative h-full bg-gradient-to-br ${resource.bgGradient} border-2 ${resource.borderColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden`}
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                  }} />
                </div>

                {/* Badge */}
                <div className="relative mb-6 flex items-start justify-between">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${resource.badgeColor}`}>
                    {resource.badge}
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-all duration-300 group-hover:translate-x-1" />
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white shadow-lg ${resource.iconColor}`}>
                    <resource.icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-inter font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  {resource.details && (
                    <p className="text-sm text-slate-500">
                      {resource.details}
                    </p>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Resources Section */}
        <div className="border-t border-slate-200 pt-12" data-aos="fade-up">
          <h3 className="text-2xl font-inter font-semibold text-slate-900 mb-8 text-center">
            Quick Access Tools
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="100">
              <Shield className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h4 className="font-inter font-semibold text-slate-900 mb-2">Safety Standards</h4>
              <p className="text-sm text-slate-600 mb-4">ISO 9001 compliant documentation</p>
              <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                Learn More <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="group text-center p-6 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="200">
              <Cpu className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h4 className="font-inter font-semibold text-slate-900 mb-2">Technical Specs</h4>
              <p className="text-sm text-slate-600 mb-4">Detailed electrical specifications</p>
              <Button variant="ghost" size="sm" className="group-hover:text-purple-600">
                View Specs <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="group text-center p-6 rounded-xl bg-white border border-slate-200 hover:border-green-400 hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="300">
              <Download className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h4 className="font-inter font-semibold text-slate-900 mb-2">Downloads</h4>
              <p className="text-sm text-slate-600 mb-4">CAD files and datasheets</p>
              <Button variant="ghost" size="sm" className="group-hover:text-green-600">
                Browse Files <Download className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="group text-center p-6 rounded-xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300" data-aos="zoom-in" data-aos-delay="400">
              <Layers className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h4 className="font-inter font-semibold text-slate-900 mb-2">3D Models</h4>
              <p className="text-sm text-slate-600 mb-4">Interactive 360° views</p>
              <Button variant="ghost" size="sm" className="group-hover:text-orange-600">
                Explore <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer variant="dark" spacing="medium">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-inter font-bold text-white mb-4">
            Need Technical Support?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Our engineering team is ready to help you find the perfect connector solution for your application
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Contact Support
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              Download Catalog
              <Download className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
