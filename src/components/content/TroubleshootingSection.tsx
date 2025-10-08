import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export interface Problem {
  title: string
  causes: string[]
  solutions: string[]
}

export interface TroubleshootingSectionProps {
  problems: Problem[]
  className?: string
}

export function TroubleshootingSection({ problems, className = '' }: TroubleshootingSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {problems.map((problem, index) => (
        <Card key={index} className="border-2 border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <h4 className="font-inter font-bold text-red-900">{problem.title}</h4>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Causes Section */}
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-red-800">Possible Causes:</p>
              </div>
              <ul className="text-sm text-slate-700 space-y-1 ml-6">
                {problem.causes.map((cause, i) => (
                  <li key={i} className="list-disc">{cause}</li>
                ))}
              </ul>
            </div>

            {/* Solutions Section */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-green-800">Solutions:</p>
              </div>
              <ul className="text-sm text-slate-700 space-y-1 ml-6">
                {problem.solutions.map((solution, i) => (
                  <li key={i} className="list-disc">{solution}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
