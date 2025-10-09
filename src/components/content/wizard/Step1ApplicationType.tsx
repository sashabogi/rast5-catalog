'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Cable, CircuitBoard, Package } from 'lucide-react'
import { ApplicationType } from '@/types/wizard.types'

interface Step1Props {
  selectedValue: ApplicationType
  onValueChange: (value: ApplicationType) => void
  translations: {
    title: string
    description: string
    wireToWire: {
      title: string
      description: string
      socketBadge: string
      tabBadge: string
    }
    wireToBoard: {
      title: string
      description: string
      socketBadge: string
      pcbBadge: string
    }
    boardToBoard: {
      title: string
      description: string
      pcbBadge1: string
      pcbBadge2: string
    }
  }
}

export function Step1ApplicationType({ selectedValue, onValueChange, translations: t }: Step1Props) {
  return (
    <Card className="shadow-2xl border-2 border-slate-200" data-aos="fade-up">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
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
          onValueChange={(value) => onValueChange(value as ApplicationType)}
        >
          <div className="grid gap-6">
            {/* Wire-to-Wire */}
            <div
              className={`group relative flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedValue === 'wire-to-wire'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                  : 'border-slate-200 hover:border-blue-300 bg-white'
              }`}
              onClick={() => onValueChange('wire-to-wire')}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <RadioGroupItem value="wire-to-wire" id="wire-to-wire" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Label htmlFor="wire-to-wire" className="text-xl font-inter font-bold cursor-pointer text-slate-900">
                      {t.wireToWire.title}
                    </Label>
                    <p className="text-base text-slate-600 mt-2">
                      {t.wireToWire.description}
                    </p>
                  </div>
                  <Cable className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="bg-white">
                    {t.wireToWire.socketBadge}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {t.wireToWire.tabBadge}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Wire-to-Board */}
            <div
              className={`group relative flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedValue === 'wire-to-board'
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                  : 'border-slate-200 hover:border-purple-300 bg-white'
              }`}
              onClick={() => onValueChange('wire-to-board')}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <RadioGroupItem value="wire-to-board" id="wire-to-board" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Label htmlFor="wire-to-board" className="text-xl font-inter font-bold cursor-pointer text-slate-900">
                      {t.wireToBoard.title}
                    </Label>
                    <p className="text-base text-slate-600 mt-2">
                      {t.wireToBoard.description}
                    </p>
                  </div>
                  <CircuitBoard className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="bg-white">
                    {t.wireToBoard.socketBadge}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {t.wireToBoard.pcbBadge}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Board-to-Board */}
            <div
              className={`group relative flex items-start space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedValue === 'board-to-board'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-slate-200 hover:border-green-300 bg-white'
              }`}
              onClick={() => onValueChange('board-to-board')}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <RadioGroupItem value="board-to-board" id="board-to-board" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Label htmlFor="board-to-board" className="text-xl font-inter font-bold cursor-pointer text-slate-900">
                      {t.boardToBoard.title}
                    </Label>
                    <p className="text-base text-slate-600 mt-2">
                      {t.boardToBoard.description}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="bg-white">
                    {t.boardToBoard.pcbBadge1}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {t.boardToBoard.pcbBadge2}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
