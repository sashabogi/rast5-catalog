'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Database,
  Settings,
  Menu,
  ChevronRight,
  Package,
  Cable,
  Users
} from 'lucide-react'

export interface SidebarItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
}

export interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

interface SidebarProps {
  sections?: SidebarSection[]
  className?: string
}

// Default configuration for admin sidebar
const defaultSections: SidebarSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/en/admin/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Connectors',
        href: '/en/admin/connectors',
        icon: Cable,
        badge: 'Soon',
      },
      {
        label: 'Terminals',
        href: '/en/admin/terminals',
        icon: Package,
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Users',
        href: '/en/admin/users',
        icon: Users,
      },
      {
        label: 'Settings',
        href: '/en/admin/settings',
        icon: Settings,
      },
    ],
  },
]

function SidebarContent({
  sections = defaultSections,
  pathname,
  onItemClick,
}: {
  sections?: SidebarSection[]
  pathname: string
  onItemClick?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1 px-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Sidebar({
  sections = defaultSections,
  className,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center h-16 px-6 border-b">
            <Database className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-bold">RAST 5 Admin</span>
          </div>
          <SidebarContent
            sections={sections}
            pathname={pathname}
            onItemClick={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0',
        className
      )}>
        <div className="flex items-center h-16 px-6 border-b">
          <Database className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-lg font-bold">RAST 5 Admin</span>
        </div>
        <SidebarContent sections={sections} pathname={pathname} />
      </aside>
    </>
  )
}