# Component Architecture Diagram

## Visual Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Window                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         Page Header (Server Rendered)                     │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Connector Catalog                                  │  │ │
│  │  │  Browse our complete collection of RAST 5...        │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │   🔒 STICKY FILTER BAR (CatalogFilters - Client)         │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  🔍 Search: [          Search by model...      ] ❌  │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  Desktop Layout (lg+):                                   │ │
│  │  ┌──────────┬──────────┬──────────┬──────────┬────────┐  │ │
│  │  │  Gender  │  Poles   │ Orientation│ Category│Special│  │ │
│  │  │  ☐Female │ [2][3][4]│ ☐Horiz   │ ☐Socket │ ☐Show │  │ │
│  │  │  ☐Male   │ [5][6][7]│ ☐Vert    │ ☐Tab    │       │  │ │
│  │  │  ☐PCB    │ [8][9].. │          │ ☐PCB    │       │  │ │
│  │  └──────────┴──────────┴──────────┴──────────┴────────┘  │ │
│  │                                                           │ │
│  │  Active Filters: [3]          [Clear All Filters ❌]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ↑ Scrolls with page                                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │        Catalog Content (CatalogContent - Client)          │ │
│  │                                                           │ │
│  │  Filtered Results           12 of 56 connectors          │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │ │
│  │  │  Card 1  │  │  Card 2  │  │  Card 3  │               │ │
│  │  │ [360°🎥] │  │ [360°🎥] │  │ [360°🎥] │               │ │
│  │  │ RAST 5   │  │ RAST 5   │  │ RAST 5   │               │ │
│  │  │ 4-Pole   │  │ 5-Pole   │  │ 6-Pole   │               │ │
│  │  │ [Female] │  │ [Female] │  │ [Female] │               │ │
│  │  └──────────┘  └──────────┘  └──────────┘               │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │ │
│  │  │  Card 4  │  │  Card 5  │  │  Card 6  │               │ │
│  │  │    ...   │  │    ...   │  │    ...   │               │ │
│  │  └──────────┘  └──────────┘  └──────────┘               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (< 1024px)

```
┌─────────────────────────────┐
│    Mobile Browser           │
├─────────────────────────────┤
│  Page Header                │
│  Connector Catalog          │
├─────────────────────────────┤
│  🔒 STICKY FILTER BAR       │
│  ┌───────────────────────┐  │
│  │ [🔍 Filters (3) ▼]    │  │ ← Tap to expand
│  │           [Clear All] │  │
│  └───────────────────────┘  │
│                             │
│  When expanded:             │
│  ┌───────────────────────┐  │
│  │ Search: [_________]   │  │
│  │                       │  │
│  │ Gender:               │  │
│  │ [Female][Male][PCB]   │  │
│  │                       │  │
│  │ Pole Count:           │  │
│  │ [2][3][4][5]          │  │
│  │ [6][7][8][9]          │  │
│  │ [10][11][12]          │  │
│  │                       │  │
│  │ Orientation:          │  │
│  │ [Horizontal]          │  │
│  │ [Vertical]            │  │
│  │                       │  │
│  │ Category:             │  │
│  │ [Socket Terminals]    │  │
│  │ [Tab Terminals]       │  │
│  │ [PCB Headers]         │  │
│  │                       │  │
│  │ ☐ Special versions    │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Catalog Content            │
│  ┌───────────────────────┐  │
│  │  Card 1               │  │
│  │  [360° Video]         │  │
│  │  RAST 5 4-Pole        │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Card 2               │  │
│  └───────────────────────┘  │
│          ...                │
└─────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               /app/catalog/page.tsx (Server)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1. Fetch connectors from Supabase                    │  │
│  │  2. Handle errors/empty states                        │  │
│  │  3. Render page structure                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│  CatalogFilters (Client) │   │ CatalogContent (Client)  │
│  ┌────────────────────┐  │   │  ┌────────────────────┐  │
│  │ Filter State       │  │   │  │ Props: connectors  │  │
│  │ • search           │  │   │  │ (all 56 items)     │  │
│  │ • gender[]         │  │   │  └────────────────────┘  │
│  │ • poleCount[]      │  │   │           │              │
│  │ • orientation[]    │  │   │           ▼              │
│  │ • category[]       │  │   │  ┌────────────────────┐  │
│  │ • specialVersion   │  │   │  │ useSearchParams()  │  │
│  └────────────────────┘  │   │  │ Read URL params    │  │
│           │              │   │  └────────────────────┘  │
│           ▼              │   │           │              │
│  ┌────────────────────┐  │   │           ▼              │
│  │ useEffect()        │  │   │  ┌────────────────────┐  │
│  │ Update URL params  │────────▶│ useMemo()          │  │
│  └────────────────────┘  │   │  │ Filter connectors  │  │
│                          │   │  └────────────────────┘  │
│  ┌────────────────────┐  │   │           │              │
│  │ Render Filter UI   │  │   │           ▼              │
│  │ • Search box       │  │   │  ┌────────────────────┐  │
│  │ • Checkboxes       │  │   │  │ Render Cards       │  │
│  │ • Buttons          │  │   │  │ (filtered)         │  │
│  │ • Clear button     │  │   │  └────────────────────┘  │
│  └────────────────────┘  │   └──────────────────────────┘
└──────────────────────────┘
```

## State Management Flow

```
USER INTERACTION
       │
       ▼
┌─────────────────────┐
│ Click Filter Option │
└─────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ toggleArrayFilter()         │
│ • Update filters state      │
│ • Add/remove from array     │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ useEffect detects change    │
│ • Build URLSearchParams     │
│ • router.push() new URL     │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ URL updates                 │
│ /catalog?gender=Female      │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ CatalogContent re-renders   │
│ • useSearchParams() reads   │
│ • useMemo() recalculates    │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ UI updates with filtered    │
│ results (no page reload!)   │
└─────────────────────────────┘
```

## Component Responsibility Matrix

| Component        | Type   | Responsibilities                        | State Management     |
|------------------|--------|-----------------------------------------|---------------------|
| CatalogPage      | Server | • Fetch data from Supabase              | None (Server)       |
|                  |        | • Error handling                        |                     |
|                  |        | • Empty state handling                  |                     |
|                  |        | • Page structure                        |                     |
|------------------|--------|-----------------------------------------|---------------------|
| CatalogFilters   | Client | • Filter UI rendering                   | Local State         |
|                  |        | • User input handling                   | (filters object)    |
|                  |        | • URL parameter management              |                     |
|                  |        | • Active filter counting                |                     |
|                  |        | • Responsive layout                     |                     |
|------------------|--------|-----------------------------------------|---------------------|
| CatalogContent   | Client | • Receive all connectors                | None (props only)   |
|                  |        | • Read URL parameters                   | Derived State       |
|                  |        | • Filter logic execution                | (useMemo)           |
|                  |        | • Render filtered results               |                     |
|                  |        | • Empty state (no results)              |                     |
|------------------|--------|-----------------------------------------|---------------------|
| ConnectorCard    | Client | • Display single connector              | Local State         |
|                  |        | • 360° video hover effect               | (isHovered)         |
|                  |        | • Badge rendering                       |                     |
|                  |        | • Link to detail page                   |                     |

## Filter Matching Logic

```
┌──────────────────────────────┐
│   All Connectors (56 items)  │
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│   Filter Pipeline:           │
│                              │
│   1. Search Filter           │
│      ↓ (if search text)      │
│   2. Gender Filter           │
│      ↓ (if gender selected)  │
│   3. Pole Count Filter       │
│      ↓ (if poles selected)   │
│   4. Orientation Filter      │
│      ↓ (if orientation set)  │
│   5. Category Filter         │
│      ↓ (if category set)     │
│   6. Special Version Filter  │
│      ↓ (if special checked)  │
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│  Filtered Results (0-56)     │
└──────────────────────────────┘
```

## URL Structure Examples

### No Filters
```
/catalog
```

### Single Filter
```
/catalog?gender=Female
```

### Multiple Values Same Filter
```
/catalog?gender=Female&gender=Male
```

### Multiple Different Filters
```
/catalog?gender=Female&poles=4&orientation=Vertical
```

### Complex Filter Combination
```
/catalog?search=rast&gender=Female&gender=Male&poles=4&poles=5&poles=6&orientation=Vertical&category=X-For+socket+terminals&special=true
```

## Performance Characteristics

```
┌─────────────────────────────────────────────────────────┐
│                    Performance Metrics                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Initial Page Load:                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Server Render → HTML (fast)                      │   │
│  │ Fetch Connectors → ~50ms (Supabase)             │   │
│  │ Client Hydration → ~200ms                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  Filter Interaction:                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Click → State Update → ~1ms                      │   │
│  │ URL Update → ~5ms                                │   │
│  │ useMemo Filter → ~10ms (56 items)                │   │
│  │ Re-render → ~50ms                                │   │
│  │ TOTAL: ~66ms (instant to user)                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  Memory Usage:                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ All Connectors: ~50KB                            │   │
│  │ Filtered Array: ~variable                        │   │
│  │ Component State: ~1KB                            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────┐
│           Frontend Stack                    │
├─────────────────────────────────────────────┤
│  Framework:      Next.js 15.5.4 (App Router)│
│  Language:       TypeScript                 │
│  Styling:        Tailwind CSS 3.x           │
│  Components:     shadcn/ui                  │
│  Icons:          Lucide React               │
├─────────────────────────────────────────────┤
│           Backend Stack                     │
├─────────────────────────────────────────────┤
│  Database:       Supabase (PostgreSQL)      │
│  Client:         @supabase/supabase-js      │
│  Storage:        Supabase Storage (videos)  │
├─────────────────────────────────────────────┤
│           Key Libraries                     │
├─────────────────────────────────────────────┤
│  State:          React useState/useMemo     │
│  Routing:        Next.js useRouter          │
│  Params:         useSearchParams            │
│  Forms:          Checkbox, Input, Button    │
└─────────────────────────────────────────────┘
```

## File Dependencies

```
src/app/catalog/page.tsx
├── imports CatalogFilters from '@/components/CatalogFilters'
├── imports CatalogContent from '@/components/CatalogContent'
├── imports supabase from '@/lib/supabase/client'
└── imports types from '@/types/database'

src/components/CatalogFilters.tsx
├── imports UI from '@/components/ui/*'
├── imports next/navigation
└── defines FilterState interface

src/components/CatalogContent.tsx
├── imports ConnectorCard from '@/components/ConnectorCard'
├── imports types from '@/types/database'
└── imports next/navigation

src/components/ConnectorCard.tsx
├── imports UI from '@/components/ui/*'
├── imports Video360Player
├── imports VideoThumbnail
└── imports types from '@/types/database'
```
