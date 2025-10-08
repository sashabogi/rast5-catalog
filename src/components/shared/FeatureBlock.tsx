import { ReactNode } from 'react'

export interface FeatureBlockProps {
  icon: ReactNode
  title: string
  description: string
  variant?: 'vertical' | 'horizontal'
  accentColor?: string
  className?: string
}

export function FeatureBlock({
  icon,
  title,
  description,
  variant = 'vertical',
  accentColor = 'bg-blue-100 text-blue-600',
  className = '',
}: FeatureBlockProps) {
  if (variant === 'horizontal') {
    return (
      <div className={`flex gap-4 ${className}`}>
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full ${accentColor} flex items-center justify-center`}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${accentColor} mb-6`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}
