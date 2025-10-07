import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cable, Search, Book, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cable className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">RAST 5 Connector Catalog</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional catalog of RAST 5 electrical connectors with detailed specifications,
            360° interactive views, and complete compatibility information.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                Browse Catalog
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="gap-2">
                <Book className="h-5 w-5" />
                Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use This Catalog?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>360° Views</CardTitle>
              <CardDescription>
                Interactive 360° videos of every connector. Drag to rotate and explore from all angles.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Cable className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Complete Compatibility</CardTitle>
              <CardDescription>
                See which connectors mate with each other, required terminal components, and assembly variants.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Book className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Detailed Documentation</CardTitle>
              <CardDescription>
                Access keying guides, technical specifications, and installation resources.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Connector Categories</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/catalog?category=X-For+socket+terminals">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    Socket Connectors (Female)
                  </CardTitle>
                  <CardDescription>
                    34 female socket housings for receiving tab terminals
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/catalog?category=X-For+tab+terminals">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    Tab Connectors (Male)
                  </CardTitle>
                  <CardDescription>
                    16 male tab housings that insert into socket connectors
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/catalog?category=X-Printed+circuit+board+headers">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    PCB Headers
                  </CardTitle>
                  <CardDescription>
                    6 printed circuit board mounted headers
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
