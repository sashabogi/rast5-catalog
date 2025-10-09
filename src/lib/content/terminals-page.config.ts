import { PageConfig } from './page-config.types'

export const terminalsPageConfig: PageConfig = {
  hero: {
    title: 'hero.title',
    description: 'hero.description',
    icon: {
      name: 'wrench',
      gradient: 'from-orange-600 to-red-600'
    },
    isDark: true,
    actions: [
      {
        type: 'primary',
        label: 'hero.exploreButton',
        icon: 'arrow-right'
      },
      {
        type: 'outline',
        label: 'hero.installationButton',
        icon: 'book-open'
      }
    ]
  },
  sections: [
    // Overview Section
    {
      type: 'info-cards',
      variant: 'gradient',
      spacing: 'large',
      title: 'overview.sectionTitle',
      description: 'overview.sectionDescription',
      columns: 3,
      cards: [
        {
          icon: 'cable',
          iconGradient: 'from-blue-600 to-indigo-600',
          title: 'overview.whatAreTerminals.title',
          description: 'overview.whatAreTerminals.description'
        },
        {
          icon: 'info',
          iconGradient: 'from-green-600 to-emerald-600',
          title: 'overview.whyDifferentTypes.title',
          description: 'overview.whyDifferentTypes.description'
        },
        {
          icon: 'check-circle',
          iconGradient: 'from-purple-600 to-pink-600',
          title: 'overview.namingConvention.title',
          description: 'overview.namingConvention.description'
        }
      ]
    },
    // Terminal Types Section (Custom Component)
    {
      type: 'custom',
      variant: 'default',
      spacing: 'large',
      component: 'TerminalTypesSection',
      props: {
        translationNamespace: 'TerminalsGuide'
      }
    },
    // Technical Specifications Section
    {
      type: 'info-cards',
      variant: 'gradient',
      spacing: 'large',
      title: 'technicalSpecs.sectionTitle',
      description: 'technicalSpecs.sectionDescription',
      columns: 4,
      cards: [
        {
          icon: 'gauge',
          iconGradient: 'from-blue-100 to-indigo-100',
          title: 'technicalSpecs.currentRating.title',
          description: 'technicalSpecs.currentRating.description',
          badge: 'technicalSpecs.currentRating.value'
        },
        {
          icon: 'zap',
          iconGradient: 'from-blue-100 to-indigo-100',
          title: 'technicalSpecs.voltageRating.title',
          description: 'technicalSpecs.voltageRating.description',
          badge: 'technicalSpecs.voltageRating.value'
        },
        {
          icon: 'ruler',
          iconGradient: 'from-blue-100 to-indigo-100',
          title: 'technicalSpecs.wireRange.title',
          description: 'technicalSpecs.wireRange.description',
          badge: 'technicalSpecs.wireRange.value'
        },
        {
          icon: 'shield-check',
          iconGradient: 'from-blue-100 to-indigo-100',
          title: 'technicalSpecs.contactMaterial.title',
          description: 'technicalSpecs.contactMaterial.description',
          badge: 'technicalSpecs.contactMaterial.value'
        }
      ]
    },
    // Material Details (Custom inline section in main page)
    {
      type: 'custom',
      variant: 'gradient',
      spacing: 'large',
      component: 'MaterialDetailsSection',
      props: {
        translationNamespace: 'TerminalsGuide'
      }
    },
    // Installation Guide Section
    {
      type: 'step-guide',
      variant: 'default',
      spacing: 'large',
      title: 'installation.sectionTitle',
      description: 'installation.sectionDescription',
      steps: [
        {
          number: 1,
          title: 'installation.steps.1.title',
          description: 'installation.steps.1.description',
          warning: 'installation.steps.1.warning'
        },
        {
          number: 2,
          title: 'installation.steps.2.title',
          description: 'installation.steps.2.description',
          warning: 'installation.steps.2.warning'
        },
        {
          number: 3,
          title: 'installation.steps.3.title',
          description: 'installation.steps.3.description',
          warning: 'installation.steps.3.warning'
        },
        {
          number: 4,
          title: 'installation.steps.4.title',
          description: 'installation.steps.4.description',
          warning: 'installation.steps.4.warning'
        },
        {
          number: 5,
          title: 'installation.steps.5.title',
          description: 'installation.steps.5.description',
          warning: 'installation.steps.5.warning'
        }
      ]
    },
    // Terminal Removal Section (Custom inline section in main page)
    {
      type: 'custom',
      variant: 'default',
      spacing: 'large',
      component: 'TerminalRemovalSection',
      props: {
        translationNamespace: 'TerminalsGuide'
      }
    },
    // Common Mistakes Section (Custom inline section in main page)
    {
      type: 'custom',
      variant: 'gradient',
      spacing: 'large',
      component: 'CommonMistakesSection',
      props: {
        translationNamespace: 'TerminalsGuide'
      }
    },
    // Download Resources Section
    {
      type: 'custom',
      variant: 'dark',
      spacing: 'medium',
      component: 'DownloadResourcesSection',
      props: {
        translationNamespace: 'TerminalsGuide'
      }
    },
    // Related Resources Section
    {
      type: 'custom',
      variant: 'gradient',
      spacing: 'large',
      component: 'RelatedResourcesSection',
      props: {
        translationNamespace: 'TerminalsGuide'
      }
    }
  ]
}
