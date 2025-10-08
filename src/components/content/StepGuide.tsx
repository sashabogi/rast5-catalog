import { LucideIcon, AlertTriangle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface Step {
  number: number
  title: string
  description: string
  icon?: LucideIcon
  warning?: string
  content?: React.ReactNode
}

export interface StepGuideProps {
  steps: Step[]
  defaultOpen?: string
  className?: string
}

export function StepGuide({ steps, defaultOpen, className = '' }: StepGuideProps) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen} className={className}>
      {steps.map((step) => {
        const StepIcon = step.icon

        return (
          <AccordionItem key={step.number} value={`step-${step.number}`} className="border-2 border-slate-200 rounded-xl mb-4 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-lg">
                  {step.number}
                </div>
                {StepIcon && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                    <StepIcon className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div className="text-left flex-1">
                  <h3 className="font-inter font-bold text-slate-900">{step.title}</h3>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-gradient-to-br from-slate-50 to-white">
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{step.description}</p>

                {step.content && (
                  <div className="mt-4">{step.content}</div>
                )}

                {step.warning && (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">Warning</p>
                      <p className="text-yellow-800 text-sm">{step.warning}</p>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
