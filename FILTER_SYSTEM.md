# Catalog Filter System Documentation

## Overview

The RAST 5 Connector Catalog now includes a comprehensive top-bar filter system that allows users to filter through 56 connectors based on multiple criteria. The filter system is fully responsive, uses URL parameters for shareability, and provides a smooth user experience.

## Features

### 1. Sticky Filter Bar
- Remains visible while scrolling for easy access
- Positioned below the page header
- Backdrop blur effect for modern aesthetics

### 2. Search Functionality
- Real-time search across model names and display names
- Clear button (X) appears when search has content
- Debounced to prevent excessive filtering

### 3. Filter Categories

#### Gender Filter
- Female
- Male
- PCB Header
- Multi-select using checkboxes (desktop) or buttons (mobile)

#### Pole Count Filter
- Options: 2-12 poles
- Button grid layout for easy selection
- Visual indication of active filters

#### Orientation Filter
- Horizontal
- Vertical
- Multi-select capability

#### Category Filter
- Socket Terminals (X-For socket terminals)
- Tab Terminals (X-For tab terminals)
- PCB Headers (X-Printed circuit board headers)
- User-friendly display names

#### Special Version Toggle
- Checkbox to show only special configuration connectors
- Boolean filter type

### 4. URL Parameter Integration
All filters update the URL with query parameters:

```
/catalog?search=rast&gender=Female&poles=4&orientation=Vertical&category=X-For+socket+terminals&special=true
```

This allows:
- Bookmarkable filtered views
- Shareable links
- Browser back/forward navigation
- Direct linking to specific filter states

### 5. Active Filter Indicators
- Badge showing count of active filters
- Visual feedback on selected options
- "Clear All Filters" button when filters are active

### 6. Responsive Design

#### Desktop (lg+)
- Horizontal layout with all filters visible
- Checkboxes for multi-select options
- Single row display with flex-wrap
- Active filter count at bottom

#### Mobile
- Collapsible filter panel (tap to expand)
- Button-based interface instead of checkboxes
- Grid layouts optimized for touch
- Stacked vertical layout

### 7. Empty States
- Friendly message when no connectors match filters
- Suggestion to adjust filters
- Maintains catalog structure

## File Structure

```
src/
├── app/
│   └── catalog/
│       └── page.tsx              # Main catalog page (Server Component)
├── components/
│   ├── CatalogFilters.tsx        # Filter UI component (Client Component)
│   ├── CatalogContent.tsx        # Filtered content display (Client Component)
│   └── ConnectorCard.tsx         # Individual connector card
└── types/
    └── database.ts               # TypeScript interfaces
```

## Component Architecture

### CatalogPage (Server Component)
- Fetches all connectors from Supabase
- Handles error and empty states
- Renders page structure with Suspense boundaries
- Passes data to client components

### CatalogFilters (Client Component)
- Manages filter state
- Updates URL parameters
- Provides responsive UI
- Handles user interactions

### CatalogContent (Client Component)
- Receives all connectors as props
- Reads URL parameters via useSearchParams
- Filters connectors client-side using useMemo
- Displays filtered results

## How It Works

### 1. Initial Page Load
```
User visits /catalog
↓
Server fetches all connectors
↓
Renders page with filters and content
↓
Client components hydrate
```

### 2. Filter Interaction
```
User selects filter option
↓
CatalogFilters updates internal state
↓
useEffect updates URL parameters
↓
CatalogContent reads new URL parameters
↓
useMemo recalculates filtered connectors
↓
UI updates with filtered results
```

### 3. Direct URL Access
```
User visits /catalog?gender=Female&poles=4
↓
CatalogFilters reads URL parameters on mount
↓
Initializes filter state from URL
↓
CatalogContent filters connectors based on URL
↓
UI shows pre-filtered results
```

## Filter Logic

### Search Filter
```typescript
if (searchQuery) {
  const matchesSearch =
    connector.model.toLowerCase().includes(searchQuery) ||
    connector.display_name?.toLowerCase().includes(searchQuery)
  if (!matchesSearch) return false
}
```

### Array Filters (Gender, Pole Count, etc.)
```typescript
if (genderFilters.length > 0) {
  const matchesGender = genderFilters.includes(connector.gender)
  if (!matchesGender) return false
}
```

### Boolean Filter (Special Version)
```typescript
if (specialVersionFilter && !connector.is_special_version) {
  return false
}
```

## Performance Optimizations

1. **useMemo Hook**: Filters are recalculated only when dependencies change
2. **Client-Side Filtering**: Fast filtering after initial server data fetch
3. **Suspense Boundaries**: Progressive loading with skeleton states
4. **No Server Round-Trips**: URL changes don't trigger server requests

## Customization

### Adding New Filters

1. Update `FilterState` interface in `CatalogFilters.tsx`:
```typescript
interface FilterState {
  // ... existing filters
  newFilter: string[]
}
```

2. Add filter options constant:
```typescript
const NEW_FILTER_OPTIONS = ['Option1', 'Option2', 'Option3']
```

3. Add UI in both desktop and mobile sections:
```tsx
<div>
  <label className="text-sm font-medium mb-2 block">New Filter</label>
  {/* Add checkboxes or buttons */}
</div>
```

4. Update URL parameter logic in `useEffect`
5. Add filtering logic in `CatalogContent.tsx`

### Styling

The filter system uses:
- Tailwind CSS utility classes
- shadcn/ui component styling
- CSS variables from theme
- Responsive breakpoints (sm, md, lg)

## Accessibility

- Keyboard navigation support
- Proper label associations
- Focus states on interactive elements
- Semantic HTML structure
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses Next.js App Router features
- Supports browser back/forward navigation

## Future Enhancements

Potential improvements:
- Filter presets/saved searches
- Filter combinations counter per category
- Advanced search with operators
- Filter history
- Export filtered results
- URL shortening for complex filters
