import { PageConfig } from './page-config.types'

export const installationPageConfig: PageConfig = {
  hero: {
    title: 'hero.title',
    description: 'hero.subtitle',
    icon: {
      name: 'book-open',
      gradient: 'from-green-600 to-emerald-600',
    },
    isDark: true,
    actions: [
      {
        type: 'primary',
        label: 'quickActions.printGuide',
        icon: 'printer',
      },
      {
        type: 'outline',
        label: 'quickActions.downloadPdf',
        icon: 'download',
      },
    ],
  },
  sections: [
    // Safety Warning Section
    {
      type: 'info-cards',
      columns: 1,
      variant: 'default',
      spacing: 'small',
      className: 'max-w-5xl mx-auto',
      cards: [
        {
          icon: 'alert-triangle',
          iconGradient: 'from-red-600 to-pink-600',
          title: 'safetyWarning.title',
          description: 'safetyWarning.items.1',
          badge: 'SAFETY',
        },
      ],
    },

    // Getting Started - Required Tools
    {
      type: 'info-cards',
      title: 'gettingStarted.title',
      description: 'gettingStarted.description',
      columns: 2,
      variant: 'gradient',
      spacing: 'medium',
      cards: [
        {
          icon: 'wrench',
          iconGradient: 'from-blue-600 to-indigo-600',
          title: 'gettingStarted.requiredTools.items.1.name',
          description: 'gettingStarted.requiredTools.items.1.description',
        },
        {
          icon: 'scissors',
          iconGradient: 'from-purple-600 to-pink-600',
          title: 'gettingStarted.requiredTools.items.2.name',
          description: 'gettingStarted.requiredTools.items.2.description',
        },
        {
          icon: 'cut',
          iconGradient: 'from-orange-600 to-amber-600',
          title: 'gettingStarted.requiredTools.items.3.name',
          description: 'gettingStarted.requiredTools.items.3.description',
        },
        {
          icon: 'tool',
          iconGradient: 'from-green-600 to-emerald-600',
          title: 'gettingStarted.requiredTools.items.4.name',
          description: 'gettingStarted.requiredTools.items.4.description',
        },
        {
          icon: 'search',
          iconGradient: 'from-cyan-600 to-blue-600',
          title: 'gettingStarted.requiredTools.items.5.name',
          description: 'gettingStarted.requiredTools.items.5.description',
        },
        {
          icon: 'activity',
          iconGradient: 'from-indigo-600 to-purple-600',
          title: 'gettingStarted.requiredTools.items.6.name',
          description: 'gettingStarted.requiredTools.items.6.description',
          badge: 'gettingStarted.requiredTools.items.6.name',
        },
      ],
    },

    // Troubleshooting Section
    {
      type: 'troubleshooting',
      title: 'troubleshooting.title',
      description: 'troubleshooting.description',
      spacing: 'large',
      problems: [
        {
          title: 'troubleshooting.problem1.title',
          causes: [
            'troubleshooting.problem1.causes.items.1',
            'troubleshooting.problem1.causes.items.2',
            'troubleshooting.problem1.causes.items.3',
          ],
          solutions: [
            'troubleshooting.problem1.solutions.items.1',
            'troubleshooting.problem1.solutions.items.2',
            'troubleshooting.problem1.solutions.items.3',
            'troubleshooting.problem1.solutions.items.4',
          ],
        },
        {
          title: 'troubleshooting.problem2.title',
          causes: [
            'troubleshooting.problem2.causes.items.1',
            'troubleshooting.problem2.causes.items.2',
            'troubleshooting.problem2.causes.items.3',
            'troubleshooting.problem2.causes.items.4',
          ],
          solutions: [
            'troubleshooting.problem2.solutions.items.1',
            'troubleshooting.problem2.solutions.items.2',
            'troubleshooting.problem2.solutions.items.3',
            'troubleshooting.problem2.solutions.items.4',
          ],
        },
        {
          title: 'troubleshooting.problem3.title',
          causes: [
            'troubleshooting.problem3.causes.items.1',
            'troubleshooting.problem3.causes.items.2',
            'troubleshooting.problem3.causes.items.3',
            'troubleshooting.problem3.causes.items.4',
          ],
          solutions: [
            'troubleshooting.problem3.solutions.items.1',
            'troubleshooting.problem3.solutions.items.2',
            'troubleshooting.problem3.solutions.items.3',
            'troubleshooting.problem3.solutions.items.4',
            'troubleshooting.problem3.solutions.items.5',
          ],
        },
        {
          title: 'troubleshooting.problem4.title',
          causes: [
            'troubleshooting.problem4.causes.items.1',
            'troubleshooting.problem4.causes.items.2',
            'troubleshooting.problem4.causes.items.3',
            'troubleshooting.problem4.causes.items.4',
          ],
          solutions: [
            'troubleshooting.problem4.solutions.items.1',
            'troubleshooting.problem4.solutions.items.2',
            'troubleshooting.problem4.solutions.items.3',
            'troubleshooting.problem4.solutions.items.4',
            'troubleshooting.problem4.solutions.items.5',
          ],
        },
        {
          title: 'troubleshooting.problem5.title',
          causes: [
            'troubleshooting.problem5.causes.items.1',
            'troubleshooting.problem5.causes.items.2',
            'troubleshooting.problem5.causes.items.3',
            'troubleshooting.problem5.causes.items.4',
          ],
          solutions: [
            'troubleshooting.problem5.solutions.items.1',
            'troubleshooting.problem5.solutions.items.2',
            'troubleshooting.problem5.solutions.items.3',
            'troubleshooting.problem5.solutions.items.4',
            'troubleshooting.problem5.solutions.items.5',
          ],
        },
        {
          title: 'troubleshooting.problem6.title',
          causes: [
            'troubleshooting.problem6.causes.items.1',
            'troubleshooting.problem6.causes.items.2',
            'troubleshooting.problem6.causes.items.3',
            'troubleshooting.problem6.causes.items.4',
          ],
          solutions: [
            'troubleshooting.problem6.solutions.items.1',
            'troubleshooting.problem6.solutions.items.2',
            'troubleshooting.problem6.solutions.items.3',
            'troubleshooting.problem6.solutions.items.4',
            'troubleshooting.problem6.solutions.items.5',
            'troubleshooting.problem6.solutions.items.6',
          ],
        },
      ],
    },
  ],
}
