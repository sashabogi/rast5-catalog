import { ReactNode } from 'react'

export interface PageHeroProps {
  title: string | ReactNode
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  isDark?: boolean
  className?: string
}

export function PageHero({
  title,
  subtitle,
  icon,
  actions,
  isDark = true,
  className = '',
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        isDark ? 'bg-slate-900' : 'bg-white'
      } ${className}`}
    >
      {/* Clip-path polygon background for dark variant */}
      {isDark && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="text-center">
          {/* Icon */}
          {icon && (
            <div
              className="flex justify-center mb-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {icon}
            </div>
          )}

          {/* Title */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {subtitle}
            </p>
          )}

          {/* Actions */}
          {actions && (
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
