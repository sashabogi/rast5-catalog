'use server'

/**
 * Server Actions for User Management
 *
 * These server actions handle all CRUD operations for admin users.
 * Each action includes permission checks, audit logging, and proper error handling.
 */

import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentAdminUserWithRole } from '@/lib/supabase/server'
import { hasPermission, type Role } from '@/lib/auth/permissions'
import { logUserAction } from '@/lib/audit/log'
import { revalidatePath } from 'next/cache'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name: string
  role: Role
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at?: string | null
}

export interface CreateUserData {
  email: string
  full_name: string
  role: Role
  is_active?: boolean
  password: string // For creating auth user
}

export interface UpdateUserData {
  full_name?: string
  role?: Role
  is_active?: boolean
}

export interface ActionResult<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

// ============================================================================
// CREATE USER
// ============================================================================

/**
 * Create a new admin user
 *
 * This action:
 * 1. Checks permissions (users:create)
 * 2. Creates an auth user in Supabase Auth
 * 3. Creates an admin user record in admin_users table
 * 4. Logs the action
 * 5. Revalidates the users page
 *
 * @param data - User creation data
 * @returns ActionResult with the created user or error
 */
export async function createAdminUser(data: CreateUserData): Promise<ActionResult<AdminUser>> {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentAdminUserWithRole()

    if (!currentUser) {
      return { success: false, error: 'Authentication required' }
    }

    // Check permission
    if (!hasPermission(currentUser, 'users:create')) {
      return { success: false, error: 'Insufficient permissions to create users' }
    }

    // Only super_admin can create other super_admins
    if (data.role === 'super_admin' && currentUser.role !== 'super_admin') {
      return { success: false, error: 'Only super admins can create other super admins' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Invalid email format' }
    }

    // Validate password strength
    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long' }
    }

    const supabase = createServiceClient()

    // Step 1: Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: data.full_name,
        role: data.role,
      }
    })

    if (authError || !authUser.user) {
      console.error('Failed to create auth user:', authError)
      return {
        success: false,
        error: authError?.message || 'Failed to create authentication user'
      }
    }

    // Step 2: Create admin user record
    const { data: newUser, error: dbError } = await supabase
      .from('admin_users')
      .insert({
        user_id: authUser.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: data.is_active ?? true,
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single()

    if (dbError || !newUser) {
      // Rollback: Delete auth user if admin_users creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id)

      console.error('Failed to create admin user record:', dbError)
      return {
        success: false,
        error: dbError?.message || 'Failed to create admin user record'
      }
    }

    // Step 3: Log the action
    await logUserAction('create', newUser.id, {
      userEmail: newUser.email,
      userRole: newUser.role,
      changes: {
        created: true,
        full_name: newUser.full_name,
        role: newUser.role,
        is_active: newUser.is_active,
      }
    }, currentUser.id)

    // Step 4: Revalidate the users page
    revalidatePath('/admin/users')

    return { success: true, data: newUser as AdminUser }

  } catch (error) {
    console.error('Error creating admin user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    }
  }
}

// ============================================================================
// GET USERS
// ============================================================================

/**
 * Get all admin users with optional filtering
 *
 * @param filters - Optional filters (role, is_active, search)
 * @returns ActionResult with array of users or error
 */
export async function getAdminUsers(filters?: {
  role?: Role
  is_active?: boolean
  search?: string
}): Promise<ActionResult<AdminUser[]>> {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentAdminUserWithRole()

    if (!currentUser) {
      return { success: false, error: 'Authentication required' }
    }

    // Check permission
    if (!hasPermission(currentUser, 'users:read')) {
      return { success: false, error: 'Insufficient permissions to view users' }
    }

    const supabase = createServiceClient()
    let query = supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.role) {
      query = query.eq('role', filters.role)
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters?.search) {
      query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`)
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Failed to fetch admin users:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: users as AdminUser[] }

  } catch (error) {
    console.error('Error fetching admin users:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    }
  }
}

// ============================================================================
// GET USER BY ID
// ============================================================================

/**
 * Get a single admin user by ID
 *
 * @param id - The user's admin_users table ID
 * @returns ActionResult with the user or error
 */
export async function getAdminUserById(id: string): Promise<ActionResult<AdminUser>> {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentAdminUserWithRole()

    if (!currentUser) {
      return { success: false, error: 'Authentication required' }
    }

    // Check permission
    if (!hasPermission(currentUser, 'users:read')) {
      return { success: false, error: 'Insufficient permissions to view users' }
    }

    const supabase = createServiceClient()
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to fetch admin user:', error)
      return { success: false, error: error.message }
    }

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, data: user as AdminUser }

  } catch (error) {
    console.error('Error fetching admin user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user'
    }
  }
}

// ============================================================================
// UPDATE USER
// ============================================================================

/**
 * Update an existing admin user
 *
 * This action:
 * 1. Checks permissions (users:update)
 * 2. Prevents self-modification of critical fields
 * 3. Updates the admin user record
 * 4. Logs the action
 * 5. Revalidates the users page
 *
 * @param userId - The user's admin_users table ID
 * @param data - Fields to update
 * @returns ActionResult with updated user or error
 */
export async function updateAdminUser(
  userId: string,
  data: UpdateUserData
): Promise<ActionResult<AdminUser>> {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentAdminUserWithRole()

    if (!currentUser) {
      return { success: false, error: 'Authentication required' }
    }

    // Check permission
    if (!hasPermission(currentUser, 'users:update')) {
      return { success: false, error: 'Insufficient permissions to update users' }
    }

    const supabase = createServiceClient()

    // Get the user being updated
    const { data: targetUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !targetUser) {
      return { success: false, error: 'User not found' }
    }

    // Prevent self-deactivation
    if (targetUser.user_id === currentUser.id && data.is_active === false) {
      return { success: false, error: 'You cannot deactivate your own account' }
    }

    // Prevent self-demotion from super_admin
    if (targetUser.user_id === currentUser.id &&
        data.role &&
        data.role !== 'super_admin' &&
        targetUser.role === 'super_admin') {
      return { success: false, error: 'You cannot change your own super admin role' }
    }

    // Only super_admin can promote to super_admin
    if (data.role === 'super_admin' && currentUser.role !== 'super_admin') {
      return { success: false, error: 'Only super admins can promote users to super admin' }
    }

    // Track changes for audit log
    const changes: Record<string, unknown> = {}
    if (data.full_name && data.full_name !== targetUser.full_name) {
      changes.full_name = { from: targetUser.full_name, to: data.full_name }
    }
    if (data.role && data.role !== targetUser.role) {
      changes.role = { from: targetUser.role, to: data.role }
    }
    if (data.is_active !== undefined && data.is_active !== targetUser.is_active) {
      changes.is_active = { from: targetUser.is_active, to: data.is_active }
    }

    // Update the user
    const { data: updatedUser, error: updateError } = await supabase
      .from('admin_users')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .eq('id', userId)
      .select()
      .single()

    if (updateError || !updatedUser) {
      console.error('Failed to update admin user:', updateError)
      return {
        success: false,
        error: updateError?.message || 'Failed to update user'
      }
    }

    // Log the action
    await logUserAction('update', updatedUser.id, {
      userEmail: updatedUser.email,
      userRole: updatedUser.role,
      changes,
    }, currentUser.id)

    // Revalidate the users page
    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, data: updatedUser as AdminUser }

  } catch (error) {
    console.error('Error updating admin user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    }
  }
}

// ============================================================================
// DELETE USER (SOFT DELETE)
// ============================================================================

/**
 * Soft delete an admin user by setting is_active to false
 *
 * This action:
 * 1. Checks permissions (users:delete)
 * 2. Prevents self-deletion
 * 3. Deactivates the user (soft delete)
 * 4. Logs the action
 * 5. Revalidates the users page
 *
 * @param userId - The user's admin_users table ID
 * @returns ActionResult indicating success or error
 */
export async function deleteAdminUser(userId: string): Promise<ActionResult> {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentAdminUserWithRole()

    if (!currentUser) {
      return { success: false, error: 'Authentication required' }
    }

    // Check permission
    if (!hasPermission(currentUser, 'users:delete')) {
      return { success: false, error: 'Insufficient permissions to delete users' }
    }

    const supabase = createServiceClient()

    // Get the user being deleted
    const { data: targetUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !targetUser) {
      return { success: false, error: 'User not found' }
    }

    // Prevent self-deletion
    if (targetUser.user_id === currentUser.id) {
      return { success: false, error: 'You cannot delete your own account' }
    }

    // Soft delete: Set is_active to false
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to delete admin user:', updateError)
      return { success: false, error: updateError.message }
    }

    // Log the action
    await logUserAction('delete', targetUser.id, {
      userEmail: targetUser.email,
      userRole: targetUser.role,
      reason: 'Soft deleted by admin',
    }, currentUser.id)

    // Revalidate the users page
    revalidatePath('/admin/users')

    return { success: true }

  } catch (error) {
    console.error('Error deleting admin user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    }
  }
}

// ============================================================================
// RESTORE USER
// ============================================================================

/**
 * Restore a soft-deleted user by setting is_active to true
 *
 * @param userId - The user's admin_users table ID
 * @returns ActionResult indicating success or error
 */
export async function restoreAdminUser(userId: string): Promise<ActionResult> {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentAdminUserWithRole()

    if (!currentUser) {
      return { success: false, error: 'Authentication required' }
    }

    // Check permission (use update permission for restore)
    if (!hasPermission(currentUser, 'users:update')) {
      return { success: false, error: 'Insufficient permissions to restore users' }
    }

    const supabase = createServiceClient()

    // Get the user being restored
    const { data: targetUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !targetUser) {
      return { success: false, error: 'User not found' }
    }

    // Restore: Set is_active to true
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to restore admin user:', updateError)
      return { success: false, error: updateError.message }
    }

    // Log the action
    await logUserAction('update', targetUser.id, {
      userEmail: targetUser.email,
      userRole: targetUser.role,
      changes: {
        is_active: { from: false, to: true }
      },
      reason: 'User restored by admin',
    }, currentUser.id)

    // Revalidate the users page
    revalidatePath('/admin/users')

    return { success: true }

  } catch (error) {
    console.error('Error restoring admin user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore user'
    }
  }
}
