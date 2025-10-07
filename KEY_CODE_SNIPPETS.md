# Key Code Snippets - Filter System

## 1. Filter State Management

### CatalogFilters.tsx - State Interface
```typescript
interface FilterState {
  search: string
  gender: string[]
  poleCount: string[]
  orientation: string[]
  category: string[]
  specialVersion: boolean
}
```

### Initialize State from URL
```typescript
const [filters, setFilters] = useState<FilterState>({
  search: searchParams.get('search') || '',
  gender: searchParams.getAll('gender'),
  poleCount: searchParams.getAll('poles'),
  orientation: searchParams.getAll('orientation'),
  category: searchParams.getAll('category'),
  specialVersion: searchParams.get('special') === 'true',
})
```

## 2. URL Parameter Sync

### Update URL When Filters Change
```typescript
useEffect(() => {
  const params = new URLSearchParams()

  if (filters.search) params.set('search', filters.search)
  filters.gender.forEach(g => params.append('gender', g))
  filters.poleCount.forEach(p => params.append('poles', p))
  filters.orientation.forEach(o => params.append('orientation', o))
  filters.category.forEach(c => params.append('category', c))
  if (filters.specialVersion) params.set('special', 'true')

  const queryString = params.toString()
  router.push(`/catalog${queryString ? `?${queryString}` : ''}`, { scroll: false })
}, [filters, router])
```

## 3. Multi-Select Filter Toggle

### Toggle Array Filter Function
```typescript
const toggleArrayFilter = (key: keyof FilterState, value: string) => {
  setFilters(prev => {
    const currentArray = prev[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    return { ...prev, [key]: newArray }
  })
}
```

### Usage with Checkbox
```tsx
<Checkbox
  id={`gender-${gender}`}
  checked={filters.gender.includes(gender)}
  onCheckedChange={() => toggleArrayFilter('gender', gender)}
/>
```

## 4. Active Filter Counter

### Calculate Active Filters
```typescript
const activeFilterCount =
  (filters.search ? 1 : 0) +
  filters.gender.length +
  filters.poleCount.length +
  filters.orientation.length +
  filters.category.length +
  (filters.specialVersion ? 1 : 0)

const hasActiveFilters = activeFilterCount > 0
```

### Display Badge
```tsx
{hasActiveFilters && (
  <Badge variant="secondary" className="ml-1">
    {activeFilterCount}
  </Badge>
)}
```

## 5. Client-Side Filtering Logic

### CatalogContent.tsx - Filter Implementation
```typescript
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
```

## 6. Responsive Mobile Filter

### Mobile Collapsible Header
```tsx
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
```

### Collapsible Content
```tsx
<div
  className={`transition-all duration-300 ease-in-out overflow-hidden ${
    isMobileExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[2000px] lg:opacity-100'
  }`}
>
  {/* Filter controls */}
</div>
```

## 7. Search Bar with Clear Button

### Search Input
```tsx
<div className="relative mb-4">
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
```

## 8. Sticky Filter Bar

### Sticky Positioning with Backdrop Blur
```tsx
<div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    {/* Filter content */}
  </div>
</div>
```

## 9. Clear All Filters

### Clear Function
```typescript
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
```

### Clear Button
```tsx
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
```

## 10. Page Structure with Suspense

### catalog/page.tsx - Main Layout
```tsx
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
    <Suspense fallback={<LoadingSkeleton />}>
      <CatalogContent connectors={connectors} />
    </Suspense>
  </div>
)
```

## 11. Empty State Handling

### No Results Message
```tsx
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
```

## 12. Filter Count Display

### Results Counter
```tsx
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-semibold">
    {filteredConnectors.length === connectors.length
      ? 'All Connectors'
      : 'Filtered Results'}
  </h2>
  <p className="text-muted-foreground">
    {filteredConnectors.length} of {connectors.length} connector
    {connectors.length !== 1 ? 's' : ''}
  </p>
</div>
```

## 13. Desktop Filter Layout

### Horizontal Flex Layout
```tsx
<div className="hidden lg:flex lg:items-start lg:gap-4 lg:flex-wrap">
  {/* Gender Filter */}
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

  {/* More filters... */}
</div>
```

## 14. Mobile Filter Layout

### Button-Based Mobile Interface
```tsx
<div className="lg:hidden space-y-4">
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

  {/* More filters... */}
</div>
```

## 15. Pole Count Grid

### Button Grid for Pole Selection
```tsx
<div className="flex-1 min-w-[200px]">
  <label className="text-sm font-medium mb-2 block">Pole Count</label>
  <div className="grid grid-cols-3 gap-2">
    {POLE_COUNT_OPTIONS.map(count => (
      <Button
        key={count}
        variant={filters.poleCount.includes(count) ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleArrayFilter('poleCount', count)}
        className="transition-all"
      >
        {count}
      </Button>
    ))}
  </div>
</div>
```

## Styling Notes

### Tailwind Classes Used
- `sticky top-0 z-40` - Sticky positioning
- `backdrop-blur` - Modern glass effect
- `transition-all duration-300` - Smooth animations
- `grid grid-cols-3 gap-2` - Responsive grids
- `flex items-center space-x-2` - Flexbox alignment
- `text-muted-foreground` - Theme colors
- `hover:shadow-xl` - Interactive feedback

### Responsive Breakpoints
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px (main breakpoint)
- `xl:` - 1280px+
