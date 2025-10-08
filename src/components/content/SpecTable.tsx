import { LucideIcon } from 'lucide-react'

export interface SpecItem {
  label: string
  value: string | number
  icon?: LucideIcon
  highlight?: boolean
}

export interface SpecTableProps {
  specs: SpecItem[]
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export function SpecTable({ specs, variant = 'default', className = '' }: SpecTableProps) {
  const baseClasses = 'grid gap-2'
  const variantClasses = {
    default: 'gap-2',
    compact: 'gap-1',
    detailed: 'gap-3',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {specs.map((spec, index) => {
        const SpecIcon = spec.icon

        return (
          <div
            key={index}
            className={`flex items-center justify-between p-3 ${
              spec.highlight
                ? 'bg-blue-50 border-2 border-blue-200'
                : 'bg-slate-50'
            } rounded-lg transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center gap-2">
              {SpecIcon && <SpecIcon className="w-4 h-4 text-slate-500" />}
              <span className={`font-medium ${spec.highlight ? 'text-blue-900' : 'text-slate-700'}`}>
                {spec.label}
              </span>
            </div>
            <span className={`font-semibold ${spec.highlight ? 'text-blue-700' : 'text-slate-900'}`}>
              {spec.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
