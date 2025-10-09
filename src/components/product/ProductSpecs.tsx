import { Badge } from '@/components/ui/badge'
import { CheckCircle, Info } from 'lucide-react'

interface Spec {
  label: string
  value: string | number
  isBadge?: boolean
  badgeColor?: string
}

interface ProductSpecsProps {
  model: string
  gender: string
  genderColor: string
  poleCount: number
  orientation: string | null
  terminalSuffix: string
  category: string
  translations: {
    title: string
    model: string
    series: string
    gender: string
    poleCount: string
    orientation: string
    orientationStandard: string
    terminalType: string
    category: string
    statusInStock: string
    statusContactForAvailability: string
  }
}

export function ProductSpecs({
  model,
  gender,
  genderColor,
  poleCount,
  orientation,
  terminalSuffix,
  category,
  translations
}: ProductSpecsProps) {
  const specs: Spec[] = [
    { label: translations.model, value: model },
    { label: translations.series, value: 'CS' },
    {
      label: translations.gender,
      value: gender,
      isBadge: true,
      badgeColor: genderColor
    },
    { label: translations.poleCount, value: poleCount },
    { label: translations.orientation, value: orientation || translations.orientationStandard },
    { label: translations.terminalType, value: terminalSuffix },
    { label: translations.category, value: category }
  ]

  return (
    <div className="space-y-8" data-aos="fade-left" data-aos-delay="100">
      {/* Specifications Card */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Info className="h-5 w-5" />
            {translations.title}
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {specs.map((spec, index) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between py-3 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition-colors ${
                  index < specs.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  {spec.label}
                </span>
                {spec.isBadge ? (
                  <Badge className={`${spec.badgeColor} text-white px-3 py-1 font-bold`}>
                    {spec.value}
                  </Badge>
                ) : (
                  <span className="text-lg font-bold text-slate-900">{spec.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-900 text-lg">{translations.statusInStock}</p>
              <p className="text-sm text-green-700">{translations.statusContactForAvailability}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
