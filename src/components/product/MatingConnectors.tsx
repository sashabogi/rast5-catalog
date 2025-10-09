import { Badge } from '@/components/ui/badge'
import { Play } from 'lucide-react'

interface MatingConnector {
  id: string
  model: string
  display_name: string
  gender: string
  pole_count: number
  orientation: string | null
  video_360_url: string
}

interface MatingConnectorsProps {
  connectors: MatingConnector[]
  locale: string
  translations: {
    title: string
    description: string
    badge360: string
    poleBadge: string
  }
}

export function MatingConnectors({ connectors, locale, translations }: MatingConnectorsProps) {
  return (
    <div data-aos="fade-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-900 mb-2">{translations.title}</h3>
        <p className="text-lg text-slate-600">{translations.description}</p>
      </div>

      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {connectors.map((mate, index) => (
            <div
              key={mate.id}
              className="min-w-[320px] snap-start"
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <a href={`/${locale}/connector/${mate.id}`} className="block group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-400">
                  <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
                    <video
                      src={mate.video_360_url}
                      className="w-full h-full object-contain"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Badge className="bg-white/95 backdrop-blur text-slate-900 border-slate-200 font-bold">
                        <Play className="h-3 w-3 mr-1.5" />
                        {translations.badge360}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {mate.model}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      {mate.display_name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${mate.gender === 'Female' ? 'bg-blue-500' : 'bg-orange-500'} text-white font-bold px-3`}>
                        {mate.gender}
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-700 font-bold border-slate-300">
                        {translations.poleBadge.replace('{count}', mate.pole_count.toString())}
                      </Badge>
                      {mate.orientation && (
                        <Badge className="bg-green-100 text-green-700 font-bold border-green-300">
                          {mate.orientation}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
