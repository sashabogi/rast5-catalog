import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cable, Search, Book, Zap, Lightbulb, Compass } from 'lucide-react'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cable className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/${locale}/catalog`}>
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                {t('hero.browseCatalog')}
              </Button>
            </Link>
            <Link href={`/${locale}/resources`}>
              <Button size="lg" variant="outline" className="gap-2">
                <Book className="h-5 w-5" />
                {t('hero.resources')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{t('features.title')}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>{t('features.view360.title')}</CardTitle>
              <CardDescription>
                {t('features.view360.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Cable className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>{t('features.compatibility.title')}</CardTitle>
              <CardDescription>
                {t('features.compatibility.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Book className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>{t('features.documentation.title')}</CardTitle>
              <CardDescription>
                {t('features.documentation.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Interactive Connector Selection Guide Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lightbulb className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('selectionGuide.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('selectionGuide.description')}
          </p>
          <Link href={`/${locale}/resources/connector-guide`}>
            <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6 h-auto">
              <Compass className="h-5 w-5" />
              {t('selectionGuide.launchGuide')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('categories.title')}</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href={`/${locale}/catalog?category=X-For+socket+terminals`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    {t('categories.socket.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('categories.socket.description')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href={`/${locale}/catalog?category=X-For+tab+terminals`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    {t('categories.tab.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('categories.tab.description')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href={`/${locale}/catalog?category=X-Printed+circuit+board+headers`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    {t('categories.pcb.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('categories.pcb.description')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
