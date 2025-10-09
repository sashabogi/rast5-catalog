'use client'

import { Badge } from '@/components/ui/badge'
import { Play } from 'lucide-react'

interface ProductVideoProps {
  videoUrl: string
  badge360Text: string
}

export function ProductVideo({ videoUrl, badge360Text }: ProductVideoProps) {
  return (
    <div className="space-y-6" data-aos="fade-right" data-aos-delay="100">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-700 group">
        <div className="aspect-square relative">
          <video
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 px-3 py-1.5 font-semibold">
              <Play className="h-3 w-3 mr-1.5" />
              {badge360Text}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
