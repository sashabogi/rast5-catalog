import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface InfoCardAction {
  type: 'primary' | 'secondary' | 'outline'
  label: string
  href?: string
  onClick?: () => void
  icon?: LucideIcon
}

export interface InfoCardProps {
  icon: LucideIcon
  iconGradient?: string
  title: string
  description: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  actions?: InfoCardAction[]
  children?: ReactNode
  className?: string
}

export function InfoCard({
  icon: Icon,
  iconGradient = 'from-blue-600 to-indigo-600',
  title,
  description,
  badge,
  badgeVariant = 'default',
  actions,
  children,
  className = '',
}: InfoCardProps) {
  const renderAction = (action: InfoCardAction, index: number) => {
    const ActionIcon = action.icon
    const buttonContent = (
      <>
        {action.label}
        {ActionIcon && <ActionIcon className="ml-2 h-4 w-4" />}
      </>
    )

    const buttonVariant = action.type === 'primary' ? 'default' : action.type === 'secondary' ? 'secondary' : 'outline'

    if (action.href) {
      return (
        <Button key={index} variant={buttonVariant} size="sm" asChild>
          <Link href={action.href}>{buttonContent}</Link>
        </Button>
      )
    }

    return (
      <Button key={index} variant={buttonVariant} size="sm" onClick={action.onClick}>
        {buttonContent}
      </Button>
    )
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardHeader className="space-y-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {badge && (
          <Badge variant={badgeVariant} className="w-fit">
            {badge}
          </Badge>
        )}
        <CardTitle className="text-xl font-inter font-bold">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {(actions || children) && (
        <CardContent className="space-y-4">
          {children}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2">{actions.map((action, index) => renderAction(action, index))}</div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
