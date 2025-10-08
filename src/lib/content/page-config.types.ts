import { LucideIcon } from 'lucide-react'
import { InfoCardAction } from '@/components/content/InfoCard'
import { SpecItem } from '@/components/content/SpecTable'
import { Step } from '@/components/content/StepGuide'
import { Problem } from '@/components/content/TroubleshootingSection'

// Icon configuration
export interface IconConfig {
  name: string
  gradient?: string
}

// Hero section configuration
export interface HeroConfig {
  title: string              // Translation key
  description: string        // Translation key
  icon: IconConfig
  isDark?: boolean
  actions?: {
    type: 'primary' | 'secondary' | 'outline'
    label: string           // Translation key
    icon?: string          // Icon name
    href?: string
  }[]
}

// Base section config
export interface BaseSection {
  variant?: 'default' | 'dark' | 'gradient'
  spacing?: 'small' | 'medium' | 'large'
  className?: string
}

// InfoCard grid section
export interface InfoCardSection extends BaseSection {
  type: 'info-cards'
  title?: string            // Translation key
  description?: string      // Translation key
  columns?: 1 | 2 | 3 | 4
  cards: {
    icon: string           // Icon name
    iconGradient?: string
    title: string          // Translation key
    description: string    // Translation key
    badge?: string         // Translation key
    actions?: InfoCardAction[]
  }[]
}

// SpecTable section
export interface SpecTableSection extends BaseSection {
  type: 'spec-table'
  title?: string            // Translation key
  specs: {
    label: string          // Translation key
    value: string          // Translation key or direct value
    icon?: string          // Icon name
    highlight?: boolean
  }[]
}

// StepGuide section
export interface StepGuideSection extends BaseSection {
  type: 'step-guide'
  title?: string            // Translation key
  description?: string      // Translation key
  steps: {
    number: number
    title: string          // Translation key
    description: string    // Translation key
    icon?: string          // Icon name
    warning?: string       // Translation key
  }[]
}

// Troubleshooting section
export interface TroubleshootingSection extends BaseSection {
  type: 'troubleshooting'
  title?: string            // Translation key
  description?: string      // Translation key
  problems: {
    title: string          // Translation key
    causes: string[]       // Translation keys
    solutions: string[]    // Translation keys
  }[]
}

// Custom content section (for one-off cases)
export interface CustomSection extends BaseSection {
  type: 'custom'
  component: string        // Component name to render
  props?: Record<string, any>
}

// Union type for all sections
export type PageSection =
  | InfoCardSection
  | SpecTableSection
  | StepGuideSection
  | TroubleshootingSection
  | CustomSection

// Complete page configuration
export interface PageConfig {
  hero: HeroConfig
  sections: PageSection[]
}

// Utility type to extract translation keys
export type TranslationKey<T> = T extends string ? T : never
