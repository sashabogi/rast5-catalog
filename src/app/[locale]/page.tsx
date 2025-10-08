import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cable, Play, BookOpen, ChevronRight, Lightbulb, Compass } from 'lucide-react'
import { PageHero, SectionContainer, FeatureBlock, Footer } from '@/components/shared'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return (
    <div>
      {/* Hero Section with PageHero Component */}
      <PageHero
        isDark={true}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        icon={<Cable className="h-20 w-20 text-white" />}
        actions={
          <>
            <Link href={`/${locale}/catalog`}>
              <Button size="lg" className="gap-2 text-lg px-8 py-6 h-14 bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 min-w-[200px]">
                {t('hero.browseCatalog')}
              </Button>
            </Link>
            <Link href={`/${locale}/resources`}>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6 h-14 bg-white hover:bg-blue-50 text-blue-600 border-2 border-white hover:border-blue-100 min-w-[200px]"
              >
                {t('hero.resources')}
              </Button>
            </Link>
          </>
        }
      />

      {/* Features Section */}
      <SectionContainer variant="default">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div data-aos="fade-up" data-aos-delay="100">
            <FeatureBlock
              icon={<Play className="h-8 w-8" />}
              title={t('features.views360.title')}
              description={t('features.views360.description')}
              accentColor="bg-blue-100 text-blue-600"
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <FeatureBlock
              icon={<Cable className="h-8 w-8" />}
              title={t('features.compatibility.title')}
              description={t('features.compatibility.description')}
              accentColor="bg-orange-100 text-orange-600"
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <FeatureBlock
              icon={<BookOpen className="h-8 w-8" />}
              title={t('features.documentation.title')}
              description={t('features.documentation.description')}
              accentColor="bg-green-100 text-green-600"
            />
          </div>
        </div>
      </SectionContainer>

      {/* Category Cards Section */}
      <SectionContainer variant="gradient">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('categories.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Socket Category */}
          <Link href={`/${locale}/catalog?category=X-For+socket+terminals`}>
            <Card
              className="h-full hover:shadow-2xl hover:border-blue-600 hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Cable className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    {t('categories.socket.title')}
                  </h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {t('categories.socket.description')}
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  {t('categories.browse')}
                  <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Tab Category */}
          <Link href={`/${locale}/catalog?category=X-For+tab+terminals`}>
            <Card
              className="h-full hover:shadow-2xl hover:border-orange-600 hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Cable className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-orange-600 transition">
                    {t('categories.tab.title')}
                  </h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {t('categories.tab.description')}
                </p>
                <div className="flex items-center text-orange-600 font-semibold">
                  {t('categories.browse')}
                  <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* PCB Category */}
          <Link href={`/${locale}/catalog?category=X-Printed+circuit+board+headers`}>
            <Card
              className="h-full hover:shadow-2xl hover:border-green-600 hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Cable className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-green-600 transition">
                    {t('categories.pcb.title')}
                  </h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {t('categories.pcb.description')}
                </p>
                <div className="flex items-center text-green-600 font-semibold">
                  {t('categories.browse')}
                  <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </SectionContainer>

      {/* Selection Guide CTA Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="zoom-in">
            <Lightbulb className="h-16 w-16 text-blue-200 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              {t('cta.subtitle')}
            </p>
            <Link href={`/${locale}/resources/connector-guide`}>
              <Button
                size="lg"
                className="gap-2 text-lg px-8 py-6 h-auto bg-white hover:bg-slate-50 text-blue-600 shadow-xl hover:shadow-2xl transition-all"
              >
                <Compass className="h-6 w-6" />
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
