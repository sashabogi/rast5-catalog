'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ClipboardCheck, BookOpen, Cable, HelpCircle, Shield, CheckCircle2 } from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

interface InstallationSidebarProps {
  locale: string
  namespace?: string
}

export function InstallationSidebar({ locale, namespace = 'InstallationGuide' }: InstallationSidebarProps) {
  const t = useTranslations(namespace)

  // Checklist state for interactive tracking
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'tools', label: t('sidebar.installationChecklist.items.tools'), checked: false },
    { id: 'safety', label: t('sidebar.installationChecklist.items.safety'), checked: false },
    {
      id: 'terminal-selection',
      label: t('sidebar.installationChecklist.items.terminal-selection'),
      checked: false,
    },
    { id: 'wire-prep', label: t('sidebar.installationChecklist.items.wire-prep'), checked: false },
    { id: 'crimping', label: t('sidebar.installationChecklist.items.crimping'), checked: false },
    { id: 'insertion', label: t('sidebar.installationChecklist.items.insertion'), checked: false },
    { id: 'assembly', label: t('sidebar.installationChecklist.items.assembly'), checked: false },
    { id: 'inspection', label: t('sidebar.installationChecklist.items.inspection'), checked: false },
  ])

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const completionPercentage = Math.round(
    (checklist.filter((item) => item.checked).length / checklist.length) * 100
  )

  return (
    <div className="space-y-6">
      {/* Progress Checklist */}
      <Card
        className="sticky top-4 print:hidden border-2 border-slate-200 hover:shadow-xl transition-all duration-300"
        data-aos="fade-up"
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-inter font-bold flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            {t('sidebar.installationChecklist.title')}
          </CardTitle>
          <CardDescription className="text-sm">
            {t('sidebar.installationChecklist.description')}
          </CardDescription>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-inter font-medium text-slate-600">Progress</span>
              <span className="text-xs font-inter font-bold text-slate-900">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => toggleChecklistItem(item.id)}
                className="mt-0.5"
              />
              <label
                htmlFor={item.id}
                className={`text-sm cursor-pointer flex-1 font-inter ${
                  item.checked ? 'line-through text-slate-500' : 'text-slate-700'
                }`}
              >
                {item.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="print:hidden border-2 border-slate-200" data-aos="fade-up" data-aos-delay="100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-inter font-bold">
            {t('sidebar.quickLinks.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href={`/${locale}/resources`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-inter text-slate-700 group-hover:text-blue-600">
              {t('sidebar.quickLinks.allResources')}
            </span>
          </Link>
          <Link
            href={`/${locale}/resources/connector-guide`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cable className="h-4 w-4 text-purple-600" />
            </div>
            <span className="font-inter text-slate-700 group-hover:text-purple-600">
              {t('sidebar.quickLinks.connectorGuide')}
            </span>
          </Link>
          <a
            href="#contact"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="font-inter text-slate-700 group-hover:text-green-600">
              {t('sidebar.quickLinks.technicalSupport')}
            </span>
          </a>
        </CardContent>
      </Card>

      {/* Quality Standards */}
      <Card className="border-2 border-slate-200" data-aos="fade-up" data-aos-delay="200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-inter font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            {t('sidebar.qualityStandards.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-inter font-semibold text-slate-800 mb-2">
            {t('sidebar.qualityStandards.compliantWith')}
          </p>
          <ul className="space-y-2">
            {['1', '2', '3', '4'].map((num) => (
              <li key={num} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 font-inter">
                  {t(`sidebar.qualityStandards.items.${num}`)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
