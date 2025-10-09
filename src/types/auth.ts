import { User, Session } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface UserRoleData {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  role?: UserRole
}

export interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

export interface LoginFormData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  status?: number
}
