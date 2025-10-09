import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Shield } from 'lucide-react'

interface SafetyWarningProps {
  namespace?: string
}

export function SafetyWarning({ namespace = 'InstallationGuide' }: SafetyWarningProps) {
  const t = useTranslations(namespace)

  return (
    <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-pink-50" data-aos="fade-up">
      <CardContent className="py-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-inter font-bold text-red-900 mb-4">
              {t('safetyWarning.title')}
            </h3>
            <ul className="space-y-3">
              {['1', '2', '3', '4', '5'].map((num) => (
                <li
                  key={num}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200"
                >
                  <Shield className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 font-inter">
                    {t(`safetyWarning.items.${num}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
