import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createClient() {
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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single()

  if (error || !data) {
    return false
  }

  return true
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
