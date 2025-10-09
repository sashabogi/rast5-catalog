'use client'

import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/shared/PageHero'
import { SectionContainer } from '@/components/shared/SectionContainer'
import { InfoCard } from '@/components/content/InfoCard'
import { SpecTable } from '@/components/content/SpecTable'
import { StepGuide } from '@/components/content/StepGuide'
import { TroubleshootingSection } from '@/components/content/TroubleshootingSection'
import { Button } from '@/components/ui/button'
import { getIcon } from '@/lib/content/icon-map'
import {
  PageConfig,
  PageSection,
  InfoCardSection,
  SpecTableSection,
  StepGuideSection,
  TroubleshootingSection as TroubleshootingSectionType,
} from '@/lib/content/page-config.types'
import Link from 'next/link'

export interface ResourcePageTemplateProps {
  config: PageConfig
  namespace: string  // Translation namespace (e.g., 'Resources')
}

export function ResourcePageTemplate({ config, namespace }: ResourcePageTemplateProps) {
  const t = useTranslations(namespace)

  // Render hero icon
  const HeroIcon = getIcon(config.hero.icon.name)
  const heroIconGradient = config.hero.icon.gradient || 'from-blue-600 to-indigo-600'

  // Render hero actions
  const renderHeroActions = () => {
    if (!config.hero.actions || config.hero.actions.length === 0) return null

    return (
      <>
        {config.hero.actions.map((action, index) => {
          const ActionIcon = action.icon ? getIcon(action.icon) : null
          const variant =
            action.type === 'primary'
              ? 'default'
              : action.type === 'secondary'
              ? 'secondary'
              : 'outline'

          const buttonContent = (
            <>
              {t(action.label)}
              {ActionIcon && <ActionIcon className="ml-2 h-5 w-5" />}
            </>
          )

          if (action.href) {
            return (
              <Button key={index} size="lg" variant={variant} asChild>
                <Link href={action.href}>{buttonContent}</Link>
              </Button>
            )
          }

          return (
            <Button key={index} size="lg" variant={variant}>
              {buttonContent}
            </Button>
          )
        })}
      </>
    )
  }

  // Render section based on type
  const renderSection = (section: PageSection, index: number) => {
    switch (section.type) {
      case 'info-cards': {
        const cardSection = section as InfoCardSection
        const columns = cardSection.columns || 3

        return (
          <div key={index} className="space-y-6">
            {cardSection.title && (
              <h2 className="text-3xl font-inter font-bold text-slate-900">
                {t(cardSection.title)}
              </h2>
            )}
            {cardSection.description && (
              <p className="text-lg text-slate-600">{t(cardSection.description)}</p>
            )}
            <div className={`grid gap-6 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`}>
              {cardSection.cards.map((card, cardIndex) => {
                const CardIcon = getIcon(card.icon)
                return (
                  <InfoCard
                    key={cardIndex}
                    icon={CardIcon}
                    iconGradient={card.iconGradient}
                    title={t(card.title)}
                    description={t(card.description)}
                    badge={card.badge ? t(card.badge) : undefined}
                    actions={card.actions?.map((action) => {
                      const ActionIcon = action.icon ? getIcon(action.icon) : undefined
                      return {
                        type: action.variant || 'outline',
                        label: t(action.label),
                        href: action.href,
                        icon: ActionIcon,
                      }
                    })}
                  />
                )
              })}
            </div>
          </div>
        )
      }

      case 'spec-table': {
        const specSection = section as SpecTableSection
        return (
          <div key={index} className="space-y-6">
            {specSection.title && (
              <h2 className="text-3xl font-inter font-bold text-slate-900">
                {t(specSection.title)}
              </h2>
            )}
            <SpecTable
              specs={specSection.specs.map((spec) => {
                const SpecIcon = spec.icon ? getIcon(spec.icon) : undefined
                return {
                  label: t(spec.label),
                  value: t(spec.value),
                  icon: SpecIcon,
                  highlight: spec.highlight,
                }
              })}
            />
          </div>
        )
      }

      case 'step-guide': {
        const stepSection = section as StepGuideSection
        return (
          <div key={index} className="space-y-6">
            {stepSection.title && (
              <h2 className="text-3xl font-inter font-bold text-slate-900">
                {t(stepSection.title)}
              </h2>
            )}
            {stepSection.description && (
              <p className="text-lg text-slate-600">{t(stepSection.description)}</p>
            )}
            <StepGuide
              steps={stepSection.steps.map((step) => {
                const StepIcon = step.icon ? getIcon(step.icon) : undefined
                return {
                  number: step.number,
                  title: t(step.title),
                  description: t(step.description),
                  icon: StepIcon,
                  warning: step.warning ? t(step.warning) : undefined,
                }
              })}
            />
          </div>
        )
      }

      case 'troubleshooting': {
        const troubleshootingSection = section as TroubleshootingSectionType
        return (
          <div key={index} className="space-y-6">
            {troubleshootingSection.title && (
              <h2 className="text-3xl font-inter font-bold text-slate-900">
                {t(troubleshootingSection.title)}
              </h2>
            )}
            {troubleshootingSection.description && (
              <p className="text-lg text-slate-600">
                {t(troubleshootingSection.description)}
              </p>
            )}
            <TroubleshootingSection
              problems={troubleshootingSection.problems.map((problem) => ({
                title: t(problem.title),
                causes: problem.causes.map((cause) => t(cause)),
                solutions: problem.solutions.map((solution) => t(solution)),
              }))}
            />
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <PageHero
        title={<span className="font-inter font-bold">{t(config.hero.title)}</span>}
        subtitle={t(config.hero.description)}
        icon={
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${heroIconGradient} flex items-center justify-center shadow-xl`}
          >
            <HeroIcon className="w-10 h-10 text-white" />
          </div>
        }
        isDark={config.hero.isDark}
        actions={renderHeroActions()}
      />

      {/* Sections */}
      {config.sections.map((section, index) => (
        <SectionContainer
          key={index}
          variant={section.variant}
          spacing={section.spacing}
          className={section.className}
        >
          {renderSection(section, index)}
        </SectionContainer>
      ))}
    </div>
  )
}
