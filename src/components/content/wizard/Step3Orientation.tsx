'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowUpDown, Package } from 'lucide-react'
import { Orientation } from '@/types/wizard.types'

interface Step3Props {
  selectedValue: Orientation
  onValueChange: (value: Orientation) => void
  translations: {
    title: string
    description: string
    horizontal: {
      title: string
      description: string
    }
    vertical: {
      title: string
      description: string
    }
    either: {
      title: string
      description: string
    }
  }
}

export function Step3Orientation({ selectedValue, onValueChange, translations: t }: Step3Props) {
  return (
    <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b-2 border-slate-200">
        <CardTitle className="text-3xl font-inter font-bold text-slate-900">
          {t.title}
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 mt-2">
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <RadioGroup
          value={selectedValue || ''}
          onValueChange={(value) => onValueChange(value as Orientation)}
        >
          <div className="grid gap-6">
            {/* Horizontal */}
            <div
              className={`group flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedValue === 'horizontal'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-slate-200 hover:border-green-300 bg-white'
              }`}
              onClick={() => onValueChange('horizontal')}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <RadioGroupItem value="horizontal" id="horizontal" className="mt-1" />
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <Label htmlFor="horizontal" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-3">
                    <ArrowUpDown className="h-6 w-6 rotate-90 text-green-600" />
                    {t.horizontal.title}
                  </Label>
                  <p className="text-base text-slate-600 mt-2">
                    {t.horizontal.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Vertical */}
            <div
              className={`group flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedValue === 'vertical'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                  : 'border-slate-200 hover:border-blue-300 bg-white'
              }`}
              onClick={() => onValueChange('vertical')}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <RadioGroupItem value="vertical" id="vertical" className="mt-1" />
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <Label htmlFor="vertical" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-3">
                    <ArrowUpDown className="h-6 w-6 text-blue-600" />
                    {t.vertical.title}
                  </Label>
                  <p className="text-base text-slate-600 mt-2">
                    {t.vertical.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Either */}
            <div
              className={`group flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedValue === 'either'
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                  : 'border-slate-200 hover:border-purple-300 bg-white'
              }`}
              onClick={() => onValueChange('either')}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <RadioGroupItem value="either" id="either" className="mt-1" />
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <Label htmlFor="either" className="text-xl font-inter font-bold cursor-pointer text-slate-900 flex items-center gap-3">
                    <Package className="h-6 w-6 text-purple-600" />
                    {t.either.title}
                  </Label>
                  <p className="text-base text-slate-600 mt-2">
                    {t.either.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
