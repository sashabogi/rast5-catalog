'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  LogOut,
  Settings,
  UserCog,
  ChevronDown,
  Mail,
  Shield
} from 'lucide-react'

export interface UserProfileDropdownProps {
  email: string
  role?: string
  avatarUrl?: string
  onLogout?: () => Promise<void>
  showSettings?: boolean
  settingsHref?: string
  profileHref?: string
  className?: string
}

export function UserProfileDropdown({
  email,
  role = 'Administrator',
  avatarUrl,
  onLogout,
  showSettings = true,
  settingsHref = '/en/admin/settings',
  profileHref = '/en/admin/profile',
  className,
}: UserProfileDropdownProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      if (onLogout) {
        await onLogout()
      } else {
        // Default logout behavior
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
        })

        if (response.ok) {
          router.push('/en/admin/login')
          router.refresh()
        }
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get initials from email for avatar fallback
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 px-3 py-2 h-auto ${className}`}
        >
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={email}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">
                  {getInitials(email)}
                </span>
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                {email}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {role}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push(profileHref)}
          className="cursor-pointer"
        >
          <UserCog className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        {showSettings && (
          <DropdownMenuItem
            onClick={() => router.push(settingsHref)}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}