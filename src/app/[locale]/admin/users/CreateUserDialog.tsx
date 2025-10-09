'use client'

/**
 * Create User Dialog Component
 *
 * A dialog for creating new admin users.
 * Includes form validation and error handling.
 */

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { createAdminUser, type CreateUserData } from './actions'
import { type Role } from '@/lib/auth/permissions'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  {
    value: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access including user management',
  },
  {
    value: 'content_manager',
    label: 'Content Manager',
    description: 'Manage all content and view audit logs',
  },
  {
    value: 'translator',
    label: 'Translator',
    description: 'Manage translations only',
  },
  {
    value: 'sales_viewer',
    label: 'Sales Viewer',
    description: 'Read-only access to all content',
  },
]

export default function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    full_name: '',
    role: 'sales_viewer',
    is_active: true,
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        email: '',
        full_name: '',
        role: 'sales_viewer',
        is_active: true,
        password: '',
      })
      setErrors({})
    }
    onOpenChange(newOpen)
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required'
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await createAdminUser(formData)

      if (result.success) {
        toast.success(`User ${formData.email} has been created successfully`)
        handleOpenChange(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to create user')
      }
    } catch (error) {
      toast.error('An error occurred while creating the user')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new admin user to the system. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className={errors.full_name ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={errors.password ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                User will be able to change this password after first login
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as Role })
                }
                disabled={loading}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-500">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
                disabled={loading}
              />
              <Label
                htmlFor="is_active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account is active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
