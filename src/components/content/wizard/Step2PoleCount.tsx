'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Zap } from 'lucide-react'

interface Step2Props {
  selectedValue: number | null
  onValueChange: (value: number) => void
  translations: {
    title: string
    description: string
    pole: string
    poles: string
  }
}

export function Step2PoleCount({ selectedValue, onValueChange, translations: t }: Step2Props) {
  const poleCounts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50 border-b-2 border-slate-200">
        <CardTitle className="text-3xl font-inter font-bold text-slate-900">
          {t.title}
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 mt-2">
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <RadioGroup
          value={selectedValue?.toString() || ''}
          onValueChange={(value) => onValueChange(parseInt(value))}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {poleCounts.map((count) => (
              <div
                key={count}
                className={`group relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedValue === count
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg scale-105'
                    : 'border-slate-200 hover:border-orange-300 bg-white'
                }`}
                onClick={() => onValueChange(count)}
                data-aos="zoom-in"
                data-aos-delay={50 * count}
              >
                <RadioGroupItem
                  value={count.toString()}
                  id={`pole-${count}`}
                  className="absolute top-3 right-3"
                />
                <Zap className="h-10 w-10 mb-3 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-inter font-bold text-slate-900">
                  {count}
                </span>
                <span className="text-sm text-slate-600 mt-1">
                  {count === 1 ? t.pole : t.poles}
                </span>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
