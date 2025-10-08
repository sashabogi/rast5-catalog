import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass, Wrench, Book, FileText } from 'lucide-react'

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ResourcesPage' })

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-12">{t('description')}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href={`/${locale}/catalog`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>{t('keyingDocs.title')}</CardTitle>
                <CardDescription>
                  {t('keyingDocs.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {t('keyingDocs.details')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${locale}/resources/connector-guide`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Compass className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>{t('selectionGuide.title')}</CardTitle>
                <CardDescription>
                  {t('selectionGuide.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={`/${locale}/resources/terminals`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Wrench className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>{t('terminals.title')}</CardTitle>
                <CardDescription>
                  {t('terminals.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={`/${locale}/resources/installation`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Book className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>{t('installation.title')}</CardTitle>
                <CardDescription>
                  {t('installation.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
