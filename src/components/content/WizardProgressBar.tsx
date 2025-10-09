'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle, LucideIcon } from 'lucide-react'

interface WizardProgressBarProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  stepIcons: LucideIcon[]
}

export function WizardProgressBar({
  currentStep,
  totalSteps,
  stepTitles,
  stepIcons,
}: WizardProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps Navigation */}
        <div className="flex items-center justify-between mb-6">
          {stepTitles.map((title, index) => {
            const Icon = stepIcons[index]
            const isActive = index + 1 === currentStep
            const isCompleted = index + 1 < currentStep

            return (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index < stepTitles.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-green-600'
                        : 'bg-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Icon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div
                      className={`absolute top-1/2 left-full w-full h-1 -translate-y-1/2 transition-all duration-500 ${
                        isCompleted ? 'bg-green-600' : 'bg-slate-300'
                      }`}
                      style={{ width: 'calc(100% - 3rem)' }}
                    />
                  )}
                </div>
                <span
                  className={`mt-3 text-xs font-inter font-semibold transition-colors duration-300 ${
                    isActive
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-slate-500'
                  }`}
                >
                  {title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <Progress value={progress} className="h-3 bg-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-inter font-bold text-white mix-blend-difference">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
