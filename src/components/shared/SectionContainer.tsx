import { ReactNode } from 'react'

export interface SectionContainerProps {
  children: ReactNode
  variant?: 'default' | 'dark' | 'gradient'
  className?: string
  spacing?: 'small' | 'medium' | 'large'
}

export function SectionContainer({
  children,
  variant = 'default',
  className = '',
  spacing = 'medium',
}: SectionContainerProps) {
  // Background variants
  const backgroundClasses = {
    default: 'bg-white',
    dark: 'bg-slate-900',
    gradient: 'bg-gradient-to-br from-slate-50 to-blue-50',
  }

  // Spacing variants
  const spacingClasses = {
    small: 'py-12 md:py-16',
    medium: 'py-16 md:py-20 lg:py-24',
    large: 'py-20 md:py-28 lg:py-32',
  }

  return (
    <section
      className={`${backgroundClasses[variant]} ${spacingClasses[spacing]} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
