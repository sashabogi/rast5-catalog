import { Suspense } from 'react'
import { supabase } from '@/lib/supabase/client'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CatalogFilters } from '@/components/CatalogFilters'
import { CatalogContent } from '@/components/CatalogContent'

export default async function CatalogPage() {
  // Fetch all connectors from Supabase
  const { data: connectors, error } = await supabase
    .from('connectors')
    .select('*')
    .order('pole_count', { ascending: true })

  // Handle errors
  if (error) {
    console.error('Error fetching connectors:', error)
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Connector Catalog</h1>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-semibold">Error loading connectors</p>
              </div>
              <p className="text-sm text-red-600 mt-2">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Handle empty state
  if (!connectors || connectors.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Connector Catalog</h1>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-semibold">No connectors found</p>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Run the migration script to populate the database with connectors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold">Connector Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Browse our complete collection of RAST 5 connectors
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Suspense fallback={<div className="h-24 bg-background border-b animate-pulse" />}>
        <CatalogFilters />
      </Suspense>

      {/* Catalog Grid */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded" />
                      <div className="h-6 w-16 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <CatalogContent connectors={connectors} />
      </Suspense>
    </div>
  )
}
