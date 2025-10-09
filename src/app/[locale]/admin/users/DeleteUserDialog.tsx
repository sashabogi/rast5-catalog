'use client'

/**
 * Delete User Dialog Component
 *
 * A confirmation dialog for soft-deleting (deactivating) admin users.
 * Prevents accidental deletions and provides clear feedback.
 */

import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { deleteAdminUser, type AdminUser } from './actions'

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser
  onSuccess: () => void
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const result = await deleteAdminUser(user.id)

      if (result.success) {
        toast.success(`User ${user.email} has been deactivated`)
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to deactivate user')
      }
    } catch (error) {
      toast.error('An error occurred while deactivating the user')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate this user? This action will:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-4">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {user.full_name}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">
                Role: {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Consequences */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              The user will:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
              <li>Be immediately logged out</li>
              <li>Lose access to the admin panel</li>
              <li>Be unable to log in</li>
              <li>Retain their account history</li>
            </ul>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              This is a soft delete. You can restore this user later if needed.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deactivate User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
