'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Info, AlertCircle } from 'lucide-react'
import { WizardState } from '@/types/wizard.types'

interface Step4Props {
  wizardState: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
  translations: {
    title: string
    description: string
    locking: {
      title: string
      description: string
    }
    specialVersion: {
      title: string
      description: string
    }
    keying: {
      title: string
      description: string
    }
    infoMessage: string
  }
}

export function Step4SpecialRequirements({ wizardState, onUpdate, translations: t }: Step4Props) {
  return (
    <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b-2 border-slate-200">
        <CardTitle className="text-3xl font-inter font-bold text-slate-900">
          {t.title}
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 mt-2">
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {/* Locking Mechanism */}
        <div
          className="group flex items-start space-x-4 p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Checkbox
            id="locking"
            checked={wizardState.requiresLocking}
            onCheckedChange={(checked) =>
              onUpdate({ requiresLocking: checked as boolean })
            }
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="locking" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              {t.locking.title}
            </Label>
            <p className="text-base text-slate-600 mt-2">
              {t.locking.description}
            </p>
          </div>
        </div>

        {/* Special Version */}
        <div
          className="group flex items-start space-x-4 p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Checkbox
            id="special"
            checked={wizardState.specialVersion}
            onCheckedChange={(checked) =>
              onUpdate({ specialVersion: checked as boolean })
            }
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="special" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              {t.specialVersion.title}
            </Label>
            <p className="text-base text-slate-600 mt-2">
              {t.specialVersion.description}
            </p>
          </div>
        </div>

        {/* Specific Keying */}
        <div
          className="group flex items-start space-x-4 p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-green-300 bg-gradient-to-br from-white to-green-50"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <Checkbox
            id="keying"
            checked={wizardState.specificKeying}
            onCheckedChange={(checked) =>
              onUpdate({ specificKeying: checked as boolean })
            }
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="keying" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              {t.keying.title}
            </Label>
            <p className="text-base text-slate-600 mt-2">
              {t.keying.description}
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200" data-aos="fade-up" data-aos-delay="400">
          <p className="text-base text-blue-800 flex items-start gap-3">
            <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
            <span>
              {t.infoMessage}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
