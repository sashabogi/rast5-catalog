import { ReactNode } from 'react'

export interface QuickSpec {
  icon: ReactNode
  label: string
  value: string
}

interface QuickSpecsProps {
  specs: QuickSpec[]
  title: string
}

export function QuickSpecs({ specs, title }: QuickSpecsProps) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-slate-900 text-center mb-8" data-aos="fade-up">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay={100 + index * 100}
          >
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {spec.icon}
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {spec.label}
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {spec.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
