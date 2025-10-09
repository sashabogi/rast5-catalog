import { PageConfig } from './page-config.types'

export const resourcesPageConfig: PageConfig = {
  hero: {
    title: 'title',
    description: 'description',
    icon: {
      name: 'book',
      gradient: 'from-blue-600 to-purple-600',
    },
    isDark: true,
  },
  sections: [
    // Main Resources Grid
    {
      type: 'info-cards',
      title: 'exploreResources.title',
      description: 'exploreResources.description',
      columns: 2,
      variant: 'gradient',
      spacing: 'large',
      cards: [
        {
          icon: 'book',
          iconGradient: 'from-blue-600 to-indigo-600',
          title: 'keyingDocs.title',
          description: 'keyingDocs.description',
          badge: 'keyingDocs.badge',
          actions: [
            {
              label: 'keyingDocs.action',
              href: '/catalog',
              variant: 'primary',
              icon: 'arrow-right',
            },
          ],
        },
        {
          icon: 'compass',
          iconGradient: 'from-purple-600 to-pink-600',
          title: 'selectionGuide.title',
          description: 'selectionGuide.description',
          badge: 'selectionGuide.badge',
          actions: [
            {
              label: 'selectionGuide.action',
              href: '/resources/connector-guide',
              variant: 'primary',
              icon: 'arrow-right',
            },
          ],
        },
        {
          icon: 'wrench',
          iconGradient: 'from-orange-600 to-amber-600',
          title: 'terminals.title',
          description: 'terminals.description',
          badge: 'terminals.badge',
          actions: [
            {
              label: 'terminals.action',
              href: '/resources/terminals',
              variant: 'primary',
              icon: 'arrow-right',
            },
          ],
        },
        {
          icon: 'book-open',
          iconGradient: 'from-green-600 to-emerald-600',
          title: 'installation.title',
          description: 'installation.description',
          badge: 'installation.badge',
          actions: [
            {
              label: 'installation.action',
              href: '/resources/installation',
              variant: 'primary',
              icon: 'arrow-right',
            },
          ],
        },
      ],
    },
    // Quick Access Tools
    {
      type: 'info-cards',
      title: 'quickAccess.title',
      columns: 4,
      variant: 'default',
      spacing: 'medium',
      className: 'border-t border-slate-200 pt-12',
      cards: [
        {
          icon: 'shield',
          iconGradient: 'from-blue-600 to-blue-700',
          title: 'quickAccess.safety.title',
          description: 'quickAccess.safety.description',
          actions: [
            {
              label: 'quickAccess.safety.action',
              variant: 'outline',
              icon: 'external-link',
            },
          ],
        },
        {
          icon: 'cpu',
          iconGradient: 'from-purple-600 to-purple-700',
          title: 'quickAccess.specs.title',
          description: 'quickAccess.specs.description',
          actions: [
            {
              label: 'quickAccess.specs.action',
              variant: 'outline',
              icon: 'arrow-right',
            },
          ],
        },
        {
          icon: 'download',
          iconGradient: 'from-green-600 to-green-700',
          title: 'quickAccess.downloads.title',
          description: 'quickAccess.downloads.description',
          actions: [
            {
              label: 'quickAccess.downloads.action',
              variant: 'outline',
              icon: 'download',
            },
          ],
        },
        {
          icon: 'package',
          iconGradient: 'from-orange-600 to-orange-700',
          title: 'quickAccess.models.title',
          description: 'quickAccess.models.description',
          actions: [
            {
              label: 'quickAccess.models.action',
              variant: 'outline',
              icon: 'arrow-right',
            },
          ],
        },
      ],
    },
  ],
}
