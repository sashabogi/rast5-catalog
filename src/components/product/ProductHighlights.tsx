import { CheckCircle, Info } from 'lucide-react'

export interface Highlight {
  title: string
  description: string
}

interface ProductHighlightsProps {
  highlights: Highlight[]
  title: string
}

export function ProductHighlights({ highlights, title }: ProductHighlightsProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Info className="h-5 w-5" />
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-5">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start gap-4 group">
            <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">{highlight.title}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{highlight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
