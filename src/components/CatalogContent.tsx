'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ConnectorCard } from '@/components/ConnectorCard'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import type { Connector } from '@/types/database'

interface CatalogContentProps {
  connectors: Connector[]
}

export function CatalogContent({ connectors }: CatalogContentProps) {
  const searchParams = useSearchParams()

  // Extract filter parameters
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''
  const genderFilters = searchParams.getAll('gender')
  const poleCountFilters = searchParams.getAll('poles').map(Number)
  const orientationFilters = searchParams.getAll('orientation')
  const categoryFilters = searchParams.getAll('category')
  const specialVersionFilter = searchParams.get('special') === 'true'

  // Filter connectors based on search params
  const filteredConnectors = useMemo(() => {
    return connectors.filter(connector => {
      // Search filter
      if (searchQuery) {
        const matchesSearch =
          connector.model.toLowerCase().includes(searchQuery) ||
          connector.display_name?.toLowerCase().includes(searchQuery)
        if (!matchesSearch) return false
      }

      // Gender filter
      if (genderFilters.length > 0) {
        const matchesGender = genderFilters.includes(connector.gender)
        if (!matchesGender) return false
      }

      // Pole count filter
      if (poleCountFilters.length > 0) {
        const matchesPoleCount = poleCountFilters.includes(connector.pole_count)
        if (!matchesPoleCount) return false
      }

      // Orientation filter
      if (orientationFilters.length > 0) {
        if (!connector.orientation) return false
        const matchesOrientation = orientationFilters.includes(connector.orientation)
        if (!matchesOrientation) return false
      }

      // Category filter
      if (categoryFilters.length > 0) {
        const matchesCategory = categoryFilters.includes(connector.category)
        if (!matchesCategory) return false
      }

      // Special version filter
      if (specialVersionFilter && !connector.is_special_version) {
        return false
      }

      return true
    })
  }, [
    connectors,
    searchQuery,
    genderFilters,
    poleCountFilters,
    orientationFilters,
    categoryFilters,
    specialVersionFilter,
  ])

  // Show empty state if no results
  if (filteredConnectors.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">No connectors found</p>
            </div>
            <p className="text-sm text-amber-600 mt-2">
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex justify-between items-center mb-8" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          {filteredConnectors.length === connectors.length
            ? 'All Connectors'
            : 'Filtered Results'}
        </h2>
        <p className="text-slate-600 text-lg">
          {filteredConnectors.length} of {connectors.length} connector
          {connectors.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredConnectors.map((connector: Connector, index: number) => (
          <div key={connector.id} data-aos="fade-up" data-aos-delay={index < 6 ? index * 50 : 0}>
            <ConnectorCard connector={connector} />
          </div>
        ))}
      </div>
    </div>
  )
}
