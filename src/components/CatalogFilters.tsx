'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterState {
  search: string
  gender: string[]
  poleCount: string[]
  orientation: string[]
  category: string[]
  specialVersion: boolean
}

const GENDER_OPTIONS = ['Female', 'Male', 'PCB Header']
const POLE_COUNT_OPTIONS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const ORIENTATION_OPTIONS = ['Horizontal', 'Vertical']
const CATEGORY_OPTIONS = [
  'X-For socket terminals',
  'X-For tab terminals',
  'X-Printed circuit board headers',
]

export function CatalogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    gender: searchParams.getAll('gender'),
    poleCount: searchParams.getAll('poles'),
    orientation: searchParams.getAll('orientation'),
    category: searchParams.getAll('category'),
    specialVersion: searchParams.get('special') === 'true',
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.search) params.set('search', filters.search)
    filters.gender.forEach(g => params.append('gender', g))
    filters.poleCount.forEach(p => params.append('poles', p))
    filters.orientation.forEach(o => params.append('orientation', o))
    filters.category.forEach(c => params.append('category', c))
    if (filters.specialVersion) params.set('special', 'true')

    const queryString = params.toString()
    // Extract locale from current path
    const pathSegments = window.location.pathname.split('/')
    const locale = pathSegments[1] // Assumes /{locale}/catalog structure
    router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [filters, router])

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      gender: [],
      poleCount: [],
      orientation: [],
      category: [],
      specialVersion: false,
    })
  }

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.gender.length +
    filters.poleCount.length +
    filters.orientation.length +
    filters.category.length +
    (filters.specialVersion ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Mobile: Collapsible header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
              {isMobileExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar - Always visible */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by model or name..."
            value={filters.search}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls - Collapsible on mobile */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[2000px] lg:opacity-100'
          }`}
        >
          <div className="space-y-3">
            {/* Desktop: Single row layout */}
            <div className="hidden lg:flex lg:items-start lg:gap-4 lg:flex-wrap">
              {/* Gender */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <div className="space-y-2">
                  {GENDER_OPTIONS.map(gender => (
                    <div key={gender} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender-${gender}`}
                        checked={filters.gender.includes(gender)}
                        onCheckedChange={() => toggleArrayFilter('gender', gender)}
                      />
                      <label
                        htmlFor={`gender-${gender}`}
                        className="text-sm cursor-pointer select-none"
                      >
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pole Count */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Pole Count {filters.poleCount.length > 0 && `(${filters.poleCount.length} selected)`}
                </label>
                <Select
                  value={filters.poleCount[0] || ''}
                  onValueChange={(value) => {
                    if (value) {
                      toggleArrayFilter('poleCount', value)
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Click to select (multi-select)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2">
                    <div className="px-2 py-1.5 text-xs font-medium text-slate-500 border-b mb-1">
                      Click to add/remove • Multiple selection
                    </div>
                    {POLE_COUNT_OPTIONS.map(count => (
                      <SelectItem key={count} value={count} className="bg-white hover:bg-blue-50">
                        <div className="flex items-center justify-between w-full">
                          <span>{count} Pole</span>
                          {filters.poleCount.includes(count) && (
                            <span className="ml-2 text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.poleCount.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.poleCount.map(count => (
                      <Badge
                        key={count}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => toggleArrayFilter('poleCount', count)}
                      >
                        {count} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Orientation */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Orientation</label>
                <div className="space-y-2">
                  {ORIENTATION_OPTIONS.map(orientation => (
                    <div key={orientation} className="flex items-center space-x-2">
                      <Checkbox
                        id={`orientation-${orientation}`}
                        checked={filters.orientation.includes(orientation)}
                        onCheckedChange={() => toggleArrayFilter('orientation', orientation)}
                      />
                      <label
                        htmlFor={`orientation-${orientation}`}
                        className="text-sm cursor-pointer select-none"
                      >
                        {orientation}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  {CATEGORY_OPTIONS.map(category => {
                    const displayName =
                      category === 'X-For socket terminals'
                        ? 'Socket Terminals'
                        : category === 'X-For tab terminals'
                        ? 'Tab Terminals'
                        : 'PCB Headers'
                    return (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.category.includes(category)}
                          onCheckedChange={() => toggleArrayFilter('category', category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer select-none"
                        >
                          {displayName}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Special Version */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Special Version</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="special-version"
                    checked={filters.specialVersion}
                    onCheckedChange={(checked) =>
                      setFilters(prev => ({ ...prev, specialVersion: checked === true }))
                    }
                  />
                  <label
                    htmlFor="special-version"
                    className="text-sm cursor-pointer select-none"
                  >
                    Show only special versions
                  </label>
                </div>
              </div>
            </div>

            {/* Mobile: Stacked layout */}
            <div className="lg:hidden space-y-3">
              {/* Gender */}
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDER_OPTIONS.map(gender => (
                    <Button
                      key={gender}
                      variant={filters.gender.includes(gender) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('gender', gender)}
                      className="transition-all text-xs"
                    >
                      {gender}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pole Count */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Pole Count {filters.poleCount.length > 0 && `(${filters.poleCount.length} selected)`}
                </label>
                <Select
                  value={filters.poleCount[0] || ''}
                  onValueChange={(value) => {
                    if (value) {
                      toggleArrayFilter('poleCount', value)
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Click to select (multi-select)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2">
                    <div className="px-2 py-1.5 text-xs font-medium text-slate-500 border-b mb-1">
                      Click to add/remove • Multiple selection
                    </div>
                    {POLE_COUNT_OPTIONS.map(count => (
                      <SelectItem key={count} value={count} className="bg-white hover:bg-blue-50">
                        <div className="flex items-center justify-between w-full">
                          <span>{count} Pole</span>
                          {filters.poleCount.includes(count) && (
                            <span className="ml-2 text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.poleCount.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.poleCount.map(count => (
                      <Badge
                        key={count}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => toggleArrayFilter('poleCount', count)}
                      >
                        {count} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Orientation */}
              <div>
                <label className="text-sm font-medium mb-2 block">Orientation</label>
                <div className="grid grid-cols-2 gap-2">
                  {ORIENTATION_OPTIONS.map(orientation => (
                    <Button
                      key={orientation}
                      variant={filters.orientation.includes(orientation) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('orientation', orientation)}
                      className="transition-all"
                    >
                      {orientation}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  {CATEGORY_OPTIONS.map(category => {
                    const displayName =
                      category === 'X-For socket terminals'
                        ? 'Socket Terminals'
                        : category === 'X-For tab terminals'
                        ? 'Tab Terminals'
                        : 'PCB Headers'
                    return (
                      <Button
                        key={category}
                        variant={filters.category.includes(category) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleArrayFilter('category', category)}
                        className="w-full transition-all text-xs"
                      >
                        {displayName}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Special Version */}
              <div className="flex items-center space-x-2 p-3 border rounded-md">
                <Checkbox
                  id="special-version-mobile"
                  checked={filters.specialVersion}
                  onCheckedChange={(checked) =>
                    setFilters(prev => ({ ...prev, specialVersion: checked === true }))
                  }
                />
                <label
                  htmlFor="special-version-mobile"
                  className="text-sm cursor-pointer select-none"
                >
                  Show only special versions
                </label>
              </div>
            </div>

            {/* Active Filters & Clear Button (Desktop) */}
            <div className="hidden lg:flex lg:items-center lg:justify-between lg:pt-2 lg:border-t">
              <div className="flex items-center gap-2 flex-wrap">
                {hasActiveFilters && (
                  <>
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    <Badge variant="secondary">{activeFilterCount}</Badge>
                  </>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
