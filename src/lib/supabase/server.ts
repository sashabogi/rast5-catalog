import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Create client for session-aware operations (reads cookies)
async function createSessionClient() {
  const cookieStore = await cookies()
  const supabaseAccessToken = cookieStore.get('sb-rbbjnwebxrxzxvwgdykf-auth-token')?.value

  if (!supabaseAccessToken) {
    return null
  }

  // Parse the token (it's stored as JSON)
  let accessToken: string
  try {
    const tokenData = JSON.parse(supabaseAccessToken)
    accessToken = tokenData.access_token
  } catch {
    return null
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  )
}

// Create service role client for admin operations (bypasses RLS)
// Exported as createClient for backward compatibility with dashboard/logout
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
  const supabase = await createSessionClient()

  if (!supabase) {
    return null
  }

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

// Helper function to check if user has admin role
export async function isUserAdmin(userId: string) {
  const supabase = createClient()

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
