'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Zap, ArrowUpDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Connector {
  id: string
  model: string
  display_name?: string
  gender: string
  pole_count: number
  orientation?: string
  is_special_version?: boolean
  video_360_url: string
}

interface ConnectorCardProps {
  connector: Connector
  locale: string
}

export function ConnectorCard({ connector, locale }: ConnectorCardProps) {
  const t = useTranslations('ConnectorGuide.connectorCard')

  const genderColor =
    connector.gender === 'Female'
      ? 'from-blue-600 to-indigo-600'
      : connector.gender === 'Male'
      ? 'from-orange-600 to-red-600'
      : 'from-green-600 to-emerald-600'

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-slate-200 hover:border-blue-400">
      <Link href={`/${locale}/connector/${connector.id}`}>
        {/* Video Thumbnail */}
        <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
          <video
            src={connector.video_360_url}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="bg-white/95 text-black shadow-lg">
              <Play className="h-3 w-3 mr-1" />
              {t('view360')}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6">
          <h4 className="font-inter font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
            {connector.model}
          </h4>
          <p className="text-base text-slate-600 mb-4">
            {connector.display_name ||
              t('poleConnector', { count: connector.pole_count, gender: connector.gender })}
          </p>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`bg-gradient-to-r ${genderColor} text-white`}>
              {connector.gender}
            </Badge>
            <Badge variant="outline" className="border-slate-300">
              <Zap className="h-3 w-3 mr-1" />
              {t('poleLabel', { count: connector.pole_count })}
            </Badge>
            {connector.orientation && (
              <Badge variant="secondary" className="bg-slate-100">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                {connector.orientation}
              </Badge>
            )}
          </div>

          {/* Special Notes */}
          {connector.is_special_version && (
            <div className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl">
              <p className="text-sm text-amber-800 font-inter font-semibold">
                {t('specialVersion')}
              </p>
            </div>
          )}

          {/* View Details Button */}
          <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
            {t('viewDetails')}
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
