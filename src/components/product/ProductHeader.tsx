import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/shared'
import { Cable } from 'lucide-react'
import { ReactNode } from 'react'

interface ProductHeaderProps {
  model: string
  displayName: string | null
  gender: string
  category: string
  isSpecialVersion: boolean
  poleCount: number
  translations: {
    specialVersion: string
    defaultDisplayName: string
  }
}

export function ProductHeader({
  model,
  displayName,
  gender,
  category,
  isSpecialVersion,
  poleCount,
  translations
}: ProductHeaderProps) {
  const genderColor =
    gender === 'Female' ? 'bg-blue-500' :
    gender === 'Male' ? 'bg-orange-500' :
    'bg-green-500'

  const title = (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-5xl md:text-6xl font-bold">{model}</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge className={`${genderColor} text-white px-4 py-1.5 text-sm font-semibold`}>
          {gender}
        </Badge>
        <Badge className="bg-white/20 backdrop-blur text-white border-white/30 px-4 py-1.5 text-sm font-semibold">
          {category}
        </Badge>
        {isSpecialVersion && (
          <Badge className="bg-red-500 text-white px-4 py-1.5 text-sm font-semibold">
            {translations.specialVersion}
          </Badge>
        )}
      </div>
    </div>
  )

  const subtitle = displayName || translations.defaultDisplayName
    .replace('{poleCount}', poleCount.toString())
    .replace('{gender}', gender)

  return (
    <PageHero
      isDark={true}
      title={title}
      subtitle={subtitle}
      icon={<Cable className="h-16 w-16 text-white/80" />}
    />
  )
}
