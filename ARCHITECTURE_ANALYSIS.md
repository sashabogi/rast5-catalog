# RAST 5 Catalog - Architecture Analysis & Refactoring Plan

## Executive Summary

**Problem**: Pages are becoming massive monoliths (500-1,130 lines) with hard-coded content, inline helper components, and no reusable template system. This creates maintenance overhead and prevents scalability.

**Solution**: Implement a template-based architecture with content/presentation separation, reusable components, and data-driven page rendering.

---

## Current Architecture Problems

### 1. **Massive Page Files**
```
terminals/page.tsx:        1,130 lines
connector-guide/page.tsx:    983 lines
connector/[id]/page.tsx:     676 lines
installation/page.tsx:       529 lines
```

### 2. **Hard-Coded Data Structures in Components**
```typescript
// ❌ BAD: Data mixed with presentation
const getTerminalSuffixes = (t) => [
  {
    suffix: 'FR',
    name: t('terminalTypes.socket.FR.name'),
    description: t('terminalTypes.socket.FR.description'),
    // ... 50+ more translation calls
  },
  // ... 5 more objects
]
```

### 3. **Inline Helper Components**
```typescript
// ❌ BAD: Components defined in page files
function StepContent({ stepId }: { stepId: string }) {
  return <div>...</div>
}

function TroubleshootingAccordion() {
  return <div>...</div>
}
```

### 4. **Translation Logic Everywhere**
- Every piece of text requires a `t()` call
- Translation keys scattered throughout JSX
- No centralized content management

### 5. **No Content/Presentation Separation**
- Page structure and content are tightly coupled
- Impossible to update content without touching code
- No way to preview content changes

---

## Identified Patterns

### Repeating Page Structures

1. **Hero Section** (Every page)
   - Title
   - Description
   - Icon
   - Actions (buttons)

2. **Content Sections** (Most pages)
   - Section with Card layout
   - Tabs for different content types
   - Accordion for collapsible content
   - Gallery/Grid for items

3. **Data Display Patterns**
   - Specification tables
   - Feature lists
   - Step-by-step guides
   - Comparison tables

### Repeating Component Patterns

1. **InfoCard** - Icon + Title + Description + Optional Actions
2. **SpecTable** - Key-value specifications
3. **FeatureList** - Checkmarked or bulleted lists
4. **StepGuide** - Numbered steps with icons
5. **TabSection** - Tabbed content areas
6. **Gallery** - Image grid with modal

---

## Proposed Architecture

### Directory Structure
```
src/
├── app/[locale]/
│   └── [...pages].tsx          # Minimal routing files
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── shared/                 # Shared layout components
│   ├── content/                # NEW: Content block components
│   │   ├── InfoCard.tsx
│   │   ├── SpecTable.tsx
│   │   ├── FeatureList.tsx
│   │   ├── StepGuide.tsx
│   │   ├── TabSection.tsx
│   │   ├── GalleryGrid.tsx
│   │   └── TroubleshootingSection.tsx
│   └── templates/              # NEW: Page templates
│       ├── GuidePageTemplate.tsx
│       ├── ResourcePageTemplate.tsx
│       └── WizardPageTemplate.tsx
├── content/                    # NEW: Content configuration
│   ├── pages/
│   │   ├── terminals.config.ts
│   │   ├── installation.config.ts
│   │   └── connector-guide.config.ts
│   └── schemas/
│       ├── guide-page.schema.ts
│       └── wizard-page.schema.ts
└── lib/
    └── content-loader.ts       # NEW: Content loading utilities
```

### Content Configuration Pattern

```typescript
// content/pages/terminals.config.ts
import { GuidePageConfig } from '@/content/schemas/guide-page.schema'

export const terminalsPageConfig: GuidePageConfig = {
  hero: {
    title: 'TerminalsGuide.hero.title',
    description: 'TerminalsGuide.hero.description',
    icon: 'wrench',
    iconGradient: 'orange-to-red',
    actions: [
      { type: 'primary', label: 'TerminalsGuide.hero.exploreButton', icon: 'arrow-right' },
      { type: 'outline', label: 'TerminalsGuide.hero.installationButton', icon: 'book' }
    ]
  },
  sections: [
    {
      type: 'info-cards',
      title: 'TerminalsGuide.typesSection.title',
      items: [
        {
          icon: 'cable',
          title: 'TerminalsGuide.socket.title',
          description: 'TerminalsGuide.socket.description',
          badge: 'TerminalsGuide.socket.badge'
        }
        // ... more items
      ]
    },
    {
      type: 'tab-section',
      title: 'TerminalsGuide.detailedGuide.title',
      tabs: [
        {
          id: 'socket',
          label: 'TerminalsGuide.tabs.socket',
          content: {
            type: 'terminal-details',
            dataSource: 'terminals',
            filter: { category: 'socket' }
          }
        }
        // ... more tabs
      ]
    }
    // ... more sections
  ]
}
```

### Template Pattern

```typescript
// components/templates/GuidePageTemplate.tsx
import { GuidePageConfig } from '@/content/schemas/guide-page.schema'
import { useTranslations } from 'next-intl'
import { renderSection } from '@/lib/content-loader'

interface GuidePageTemplateProps {
  config: GuidePageConfig
  namespace: string
}

export function GuidePageTemplate({ config, namespace }: GuidePageTemplateProps) {
  const t = useTranslations(namespace)

  return (
    <div className="min-h-screen">
      <PageHero
        title={t(config.hero.title)}
        subtitle={t(config.hero.description)}
        icon={getIcon(config.hero.icon, config.hero.iconGradient)}
        actions={renderActions(config.hero.actions, t)}
      />

      {config.sections.map((section, index) => (
        <SectionContainer key={index} variant={section.variant}>
          {renderSection(section, t)}
        </SectionContainer>
      ))}
    </div>
  )
}
```

### Simplified Page Files

```typescript
// app/[locale]/resources/terminals/page.tsx
import { GuidePageTemplate } from '@/components/templates/GuidePageTemplate'
import { terminalsPageConfig } from '@/content/pages/terminals.config'

export default function TerminalsPage() {
  return (
    <GuidePageTemplate
      config={terminalsPageConfig}
      namespace="TerminalsGuide"
    />
  )
}
```

**Result**: Page files go from **1,130 lines → ~10 lines**

---

## Content Block Components

### 1. InfoCard Component
```typescript
// components/content/InfoCard.tsx
interface InfoCardProps {
  icon: IconType
  title: string
  description: string
  badge?: string
  actions?: Action[]
  gradient?: string
}

export function InfoCard({ icon: Icon, title, description, badge, actions, gradient }: InfoCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all">
      <CardHeader>
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {badge && <Badge>{badge}</Badge>}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
        {actions && <div className="mt-4 flex gap-2">{renderActions(actions)}</div>}
      </CardContent>
    </Card>
  )
}
```

### 2. SpecTable Component
```typescript
// components/content/SpecTable.tsx
interface SpecTableProps {
  specs: Array<{ label: string; value: string; icon?: IconType }>
}

export function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="grid gap-2">
      {specs.map((spec, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            {spec.icon && <spec.icon className="w-4 h-4 text-slate-500" />}
            <span className="font-medium">{spec.label}</span>
          </div>
          <span className="text-slate-700">{spec.value}</span>
        </div>
      ))}
    </div>
  )
}
```

### 3. StepGuide Component
```typescript
// components/content/StepGuide.tsx
interface Step {
  number: number
  title: string
  description: string
  icon?: IconType
  warning?: string
}

export function StepGuide({ steps }: { steps: Step[] }) {
  return (
    <Accordion type="single" collapsible>
      {steps.map((step) => (
        <AccordionItem key={step.number} value={`step-${step.number}`}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                {step.number}
              </div>
              <div className="text-left">
                <h3 className="font-bold">{step.title}</h3>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p>{step.description}</p>
            {step.warning && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="inline mr-2" />
                {step.warning}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
```

### 4. TroubleshootingSection Component
```typescript
// components/content/TroubleshootingSection.tsx
interface Problem {
  title: string
  causes: string[]
  solutions: string[]
}

export function TroubleshootingSection({ problems }: { problems: Problem[] }) {
  return (
    <div className="space-y-4">
      {problems.map((problem, i) => (
        <Card key={i} className="border-2">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <h4 className="font-bold text-red-900">{problem.title}</h4>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-1">Causes:</p>
              <ul className="text-sm text-slate-700 space-y-1">
                {problem.causes.map((cause, j) => (
                  <li key={j}>• {cause}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1">Solutions:</p>
              <ul className="text-sm text-slate-700 space-y-1">
                {problem.solutions.map((solution, j) => (
                  <li key={j}>• {solution}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## Content Schemas

```typescript
// content/schemas/guide-page.schema.ts
export interface GuidePageConfig {
  hero: {
    title: string          // Translation key
    description: string    // Translation key
    icon: string          // Icon name
    iconGradient?: string // Gradient colors
    actions?: Action[]
  }
  sections: Section[]
}

export interface Section {
  type: 'info-cards' | 'tab-section' | 'step-guide' | 'troubleshooting' | 'spec-table' | 'gallery'
  title?: string         // Translation key
  description?: string   // Translation key
  variant?: 'default' | 'dark' | 'gradient'
  spacing?: 'small' | 'medium' | 'large'
  items?: any[]          // Type depends on section type
  tabs?: Tab[]
  dataSource?: string    // For dynamic data
  filter?: object        // For filtering data
}

export interface Action {
  type: 'primary' | 'secondary' | 'outline'
  label: string          // Translation key
  icon?: string
  href?: string
}
```

---

## Migration Strategy

### Phase 1: Build Foundation (Week 1)
1. ✅ Create content block components library
2. ✅ Create page template components
3. ✅ Create content configuration schemas
4. ✅ Build content loader utility

### Phase 2: Migrate One Page (Week 1-2)
1. ✅ Choose simplest page (Resources page - 223 lines)
2. ✅ Extract content to config file
3. ✅ Apply template
4. ✅ Test thoroughly
5. ✅ Document process

### Phase 3: Migrate Complex Pages (Week 2-3)
1. ✅ Migrate Installation page (529 lines)
2. ✅ Migrate Connector Detail page (676 lines)
3. ✅ Migrate Connector Guide page (983 lines)
4. ✅ Migrate Terminals page (1,130 lines)

### Phase 4: Cleanup & Optimization (Week 3-4)
1. ✅ Remove old page files
2. ✅ Optimize bundle size
3. ✅ Add content validation
4. ✅ Create documentation
5. ✅ Create content authoring guide

---

## Expected Results

### Before Refactor:
- ❌ Average page: 500-1,000 lines
- ❌ Hard to maintain
- ❌ No content reuse
- ❌ High duplication
- ❌ TypeScript errors from complexity

### After Refactor:
- ✅ Average page: 10-20 lines
- ✅ Easy to maintain
- ✅ Content reusable across pages
- ✅ DRY architecture
- ✅ Type-safe content
- ✅ Content can be updated without code changes

---

## Success Metrics

1. **Code Reduction**: 80% reduction in page file lines
2. **Reusability**: 90% of UI components reusable
3. **Maintainability**: Content changes without touching code
4. **Type Safety**: 100% typed content configs
5. **Build Time**: Faster builds from smaller files
6. **Developer Experience**: New pages in minutes, not hours

---

## Next Steps

1. **Review & Approve** this architecture
2. **Create content block components** (InfoCard, SpecTable, etc.)
3. **Build first template** (GuidePageTemplate)
4. **Migrate one page** as proof of concept
5. **Scale to all pages**

---

## Decision Required

**Question**: Should we proceed with this refactoring approach?

- ✅ **YES** → Let's build the foundation
- ❌ **NO** → Discuss alternative approaches
- 🤔 **MODIFY** → What changes do you suggest?
