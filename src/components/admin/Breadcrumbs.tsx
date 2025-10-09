'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  separator?: React.ReactNode
  showHome?: boolean
  homeHref?: string
  homeLabel?: string
  className?: string
  itemClassName?: string
  activeClassName?: string
  capitalizeLabels?: boolean
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  // Skip locale (e.g., 'en')
  const startIndex = paths[0] && paths[0].length === 2 ? 1 : 0

  paths.slice(startIndex).forEach((path, index, array) => {
    const href = '/' + paths.slice(0, startIndex + index + 1).join('/')
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    items.push({
      label,
      href: index === array.length - 1 ? undefined : href, // Last item has no href
    })
  })

  return items
}

export function Breadcrumbs({
  items,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  showHome = true,
  homeHref = '/en/admin/dashboard',
  homeLabel = 'Dashboard',
  className,
  itemClassName = 'text-sm font-medium',
  activeClassName = 'text-gray-900',
  capitalizeLabels = true,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  // Don't render if no items and home is hidden
  if (!showHome && breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav
      className={cn('flex items-center space-x-2', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {/* Home Link */}
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className={cn(
                  itemClassName,
                  'text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1',
                  pathname === homeHref && activeClassName
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{homeLabel}</span>
              </Link>
            </li>
            {breadcrumbItems.length > 0 && (
              <li className="flex items-center" aria-hidden="true">
                {separator}
              </li>
            )}
          </>
        )}

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const Icon = item.icon
          const displayLabel = capitalizeLabels
            ? item.label.charAt(0).toUpperCase() + item.label.slice(1)
            : item.label

          return (
            <li key={index} className="flex items-center">
              {index > 0 && !showHome && (
                <span className="mr-2" aria-hidden="true">
                  {separator}
                </span>
              )}
              {index > 0 && showHome && index === 1 && breadcrumbItems.length > 1 && (
                <span className="mr-2" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    itemClassName,
                    activeClassName,
                    'flex items-center gap-1'
                  )}
                  aria-current="page"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {displayLabel}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    itemClassName,
                    'text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {displayLabel}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Export a helper component for common admin breadcrumbs
export function AdminBreadcrumbs({ className }: { className?: string }) {
  return (
    <Breadcrumbs
      showHome={true}
      homeHref="/en/admin/dashboard"
      homeLabel="Dashboard"
      className={className}
    />
  )
}