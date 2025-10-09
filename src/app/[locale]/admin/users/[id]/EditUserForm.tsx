'use client'

/**
 * Edit User Form Component
 *
 * A form for editing existing admin users.
 * Includes validation, permission checks, and audit logging.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Save, UserCheck, UserX } from 'lucide-react'
import { updateAdminUser, type AdminUser, type UpdateUserData } from '../actions'
import { type Role } from '@/lib/auth/permissions'

interface EditUserFormProps {
  user: AdminUser
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

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateUserData>({
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.full_name !== user.full_name ||
      formData.role !== user.role ||
      formData.is_active !== user.is_active
    )
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required'
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters'
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

    if (!hasChanges()) {
      toast.info('No changes to save')
      return
    }

    setLoading(true)

    try {
      const result = await updateAdminUser(user.id, formData)

      if (result.success) {
        toast.success('User updated successfully')
        router.push('/admin/users')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update user')
      }
    } catch (error) {
      toast.error('An error occurred while updating the user')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      )
      if (!confirmed) return
    }
    router.push('/admin/users')
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/users')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Button>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Read-only information about this user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Email</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">{user.email}</p>
            </div>
            <div>
              <Label className="text-gray-600">Current Status</Label>
              <div className="mt-1">
                {user.is_active ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <UserX className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="text-gray-600">Created</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(user.created_at)}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Last Updated</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit User Details</CardTitle>
          <CardDescription>
            Update user information and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                type="text"
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

            <Separator />

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
                  <SelectValue />
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
              <p className="text-xs text-gray-500">
                Changing the role will affect the user&apos;s permissions
              </p>
            </div>

            <Separator />

            {/* Active Status */}
            <div className="space-y-3">
              <Label>Account Status</Label>
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
              <p className="text-xs text-gray-500">
                Inactive accounts cannot log in to the admin panel
              </p>
            </div>

            {/* Change Warning */}
            {hasChanges() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-medium">
                  You have unsaved changes
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !hasChanges()}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
