'use client'

/**
 * User Management Component
 *
 * Main client component for managing admin users.
 * Handles data fetching, search, filtering, and user actions.
 */

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  UserCheck,
  UserX,
} from 'lucide-react'
import { getAdminUsers, restoreAdminUser, type AdminUser } from './actions'
import CreateUserDialog from './CreateUserDialog'
import DeleteUserDialog from './DeleteUserDialog'
import { type Role } from '@/lib/auth/permissions'

// Role display configurations
const ROLE_CONFIG: Record<Role, { label: string; color: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  super_admin: {
    label: 'Super Admin',
    color: 'bg-red-100 text-red-800 border-red-300',
    variant: 'destructive',
  },
  content_manager: {
    label: 'Content Manager',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    variant: 'default',
  },
  translator: {
    label: 'Translator',
    color: 'bg-green-100 text-green-800 border-green-300',
    variant: 'secondary',
  },
  sales_viewer: {
    label: 'Sales Viewer',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    variant: 'outline',
  },
}

export default function UserManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getAdminUsers()
      if (result.success && result.data) {
        setUsers(result.data)
      } else {
        toast.error(result.error || 'Failed to load users')
      }
    } catch (error) {
      toast.error('An error occurred while loading users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Load users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())

      // Role filter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'inactive' && !user.is_active)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  // Handle delete user
  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  // Handle restore user
  const handleRestoreUser = async (user: AdminUser) => {
    try {
      const result = await restoreAdminUser(user.id)
      if (result.success) {
        toast.success(`User ${user.email} has been restored`)
        fetchUsers() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to restore user')
      }
    } catch (error) {
      toast.error('An error occurred while restoring the user')
      console.error(error)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as Role | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="content_manager">Content Manager</SelectItem>
            <SelectItem value="translator">Translator</SelectItem>
            <SelectItem value="sales_viewer">Sales Viewer</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={fetchUsers}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        {/* Create User Button */}
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Active Users</div>
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Inactive Users</div>
          <div className="text-2xl font-bold text-red-600">
            {users.filter((u) => !u.is_active).length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600">No users found</p>
              {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('all')
                    setStatusFilter('all')
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={ROLE_CONFIG[user.role].variant}
                      className={ROLE_CONFIG[user.role].color}
                    >
                      {ROLE_CONFIG[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.is_active ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            title="Deactivate user"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreUser(user)}
                          title="Restore user"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchUsers}
      />

      {userToDelete && (
        <DeleteUserDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          user={userToDelete}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  )
}
