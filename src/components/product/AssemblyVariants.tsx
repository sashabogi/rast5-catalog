import { Badge } from '@/components/ui/badge'

interface AssemblyVariant {
  id: string
  model: string
  display_name: string
  orientation: string | null
  video_360_url: string
}

interface AssemblyVariantsProps {
  variants: AssemblyVariant[]
  locale: string
  translations: {
    title: string
    description: string
  }
}

export function AssemblyVariants({ variants, locale, translations }: AssemblyVariantsProps) {
  return (
    <div data-aos="fade-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-900 mb-2">{translations.title}</h3>
        <p className="text-lg text-slate-600">{translations.description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            data-aos="fade-up"
            data-aos-delay={100 + index * 50}
          >
            <a href={`/${locale}/connector/${variant.id}`} className="block group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-400">
                <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
                  <video
                    src={variant.video_360_url}
                    className="w-full h-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {variant.model}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    {variant.display_name}
                  </p>
                  {variant.orientation && (
                    <Badge className="bg-purple-100 text-purple-700 font-bold border-purple-300">
                      {variant.orientation}
                    </Badge>
                  )}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
