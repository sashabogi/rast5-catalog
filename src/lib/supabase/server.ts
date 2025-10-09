import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type { Role, PermissionUser } from '@/lib/auth/permissions'

// Create server client with cookie handling (for user sessions)
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Create service role client for admin operations (bypasses RLS)
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Helper function to get the current user
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

// Helper function to check if user has admin role
export async function isUserAdmin(userId: string) {
  try {
    console.log('[DEBUG] isUserAdmin called with userId:', userId)

    const supabase = createServiceClient()
    console.log('[DEBUG] Service client created')

    const { data, error } = (await supabase
      .from('admin_users' as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select('role, is_active')
      .eq('user_id', userId)
      .single()) as any // eslint-disable-line @typescript-eslint/no-explicit-any

    console.log('[DEBUG] Query result:', {
      userId,
      data,
      error: error?.message || null,
      errorDetails: error
    })

    if (error) {
      console.error('[ERROR] Database query failed:', error)
      return false
    }

    if (!data) {
      console.log('[DEBUG] No admin user found for userId:', userId)
      return false
    }

    // Check if user exists in admin_users table and is active (any admin role)
    const isAdmin = data.is_active === true
    console.log('[DEBUG] Admin check result:', {
      userId,
      role: data.role,
      isActive: data.is_active,
      isAdmin
    })

    return isAdmin
  } catch (err) {
    console.error('[ERROR] Unexpected error in isUserAdmin:', err)
    return false
  }
}

// Combined helper to get current user and check admin status
export async function getCurrentAdminUser() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const isAdmin = await isUserAdmin(user.id)

  if (!isAdmin) {
    return null
  }

  return user
}

/**
 * Get the current admin user with their role information
 * Returns a PermissionUser object that can be used with permission utilities
 *
 * @returns {Promise<PermissionUser | null>} The user with role information or null if not authenticated/not admin
 */
export async function getCurrentAdminUserWithRole(): Promise<PermissionUser | null> {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = (await supabase
      .from('admin_users' as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select('role, is_active')
      .eq('user_id', user.id)
      .single()) as any // eslint-disable-line @typescript-eslint/no-explicit-any

    if (error || !data || !data.is_active) {
      return null
    }

    // Return user with role information
    return {
      id: user.id,
      role: data.role as Role,
      email: user.email
    }
  } catch (err) {
    console.error('[ERROR] Error fetching admin user role:', err)
    return null
  }
}
