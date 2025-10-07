'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video360Player } from './Video360Player'
import { VideoThumbnail } from './VideoThumbnail'
import type { Connector } from '@/types/database'

interface ConnectorCardProps {
  connector: Connector
}

export function ConnectorCard({ connector }: ConnectorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const genderColor =
    connector.gender === 'Female' ? 'bg-blue-500' :
    connector.gender === 'Male' ? 'bg-orange-500' :
    'bg-green-500'

  return (
    <Link href={`/connector/${connector.id}`}>
      <Card
        className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 360° video as thumbnail */}
        <div className="relative aspect-video bg-gray-100">
          {isHovered ? (
            <Video360Player
              videoUrl={connector.video_360_url}
              autoRotate={true}
              showControls={false}
              className="w-full h-full"
            />
          ) : (
            <VideoThumbnail
              videoUrl={connector.video_360_url}
              time={connector.video_thumbnail_time || 0}
            />
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{connector.model}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {connector.display_name || `${connector.pole_count}-Pole ${connector.gender} Connector`}
          </p>

          <div className="flex gap-2 flex-wrap">
            <Badge className={genderColor}>
              {connector.gender}
            </Badge>
            <Badge variant="outline">
              {connector.pole_count}-Pole
            </Badge>
            {connector.orientation && (
              <Badge variant="secondary">
                {connector.orientation}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
