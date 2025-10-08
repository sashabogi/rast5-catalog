'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VideoThumbnail } from './VideoThumbnail'
import type { Connector } from '@/types/database'

interface ConnectorCardProps {
  connector: Connector
}

export function ConnectorCard({ connector }: ConnectorCardProps) {
  const locale = useLocale()

  const genderColor =
    connector.gender === 'Female' ? 'bg-blue-500' :
    connector.gender === 'Male' ? 'bg-orange-500' :
    'bg-green-500'

  const genderHoverColor =
    connector.gender === 'Female' ? 'hover:bg-blue-600' :
    connector.gender === 'Male' ? 'hover:bg-orange-600' :
    'hover:bg-green-600'

  return (
    <Link href={`/${locale}/connector/${connector.id}`}>
      <Card
        className="group relative overflow-hidden bg-white border-2 border-slate-200 hover:border-[#5696ff] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full"
      >
        {/* 360° video thumbnail - no hover changes */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          <VideoThumbnail
            videoUrl={connector.video_360_url}
            time={connector.video_thumbnail_time || 0}
          />
          {/* 360° indicator badge */}
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            360°
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Title with better typography */}
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-slate-900 tracking-tight group-hover:text-[#2174ea] transition-colors duration-300">
              {connector.model}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {connector.display_name || `${connector.pole_count}-Pole ${connector.gender} Connector`}
            </p>
          </div>

          {/* Badges with improved styling */}
          <div className="flex gap-2 flex-wrap pt-2">
            {/* Gender Badge with enhanced styling */}
            <Badge
              className={`${genderColor} ${genderHoverColor} text-white font-semibold px-3 py-1 text-xs tracking-wide shadow-sm transition-all duration-300`}
            >
              {connector.gender}
            </Badge>

            {/* Pole Count Badge */}
            <Badge
              variant="outline"
              className="border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-3 py-1 text-xs tracking-wide transition-all duration-300"
            >
              {connector.pole_count}-Pole
            </Badge>

            {/* Orientation Badge */}
            {connector.orientation && (
              <Badge
                variant="secondary"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1 text-xs tracking-wide transition-all duration-300"
              >
                {connector.orientation}
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Subtle hover accent line at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#5696ff] to-[#2174ea] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Card>
    </Link>
  )
}
