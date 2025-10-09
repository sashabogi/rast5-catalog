import { ResourcePageTemplate } from '@/components/templates/ResourcePageTemplate'
import { resourcesPageConfig } from '@/lib/content/resources-page.config'

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Update config hrefs to include locale
  const localizedConfig = {
    ...resourcesPageConfig,
    sections: resourcesPageConfig.sections.map(section => {
      if (section.type === 'info-cards') {
        return {
          ...section,
          cards: section.cards.map(card => ({
            ...card,
            actions: card.actions?.map(action => ({
              ...action,
              href: action.href ? `/${locale}${action.href}` : undefined
            }))
          }))
        }
      }
      return section
    })
  }

  return (
    <ResourcePageTemplate
      config={localizedConfig}
      namespace="ResourcesPage"
    />
  )
}
