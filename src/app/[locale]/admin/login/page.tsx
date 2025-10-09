'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// Simple in-memory rate limiter
interface RateLimitEntry {
  attempts: number
  lockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

// Utility to get client identifier (using a simple hash of browser fingerprint)
function getClientIdentifier(): string {
  // Use a combination of user agent and screen properties for basic fingerprinting
  const fingerprint = `${navigator.userAgent}-${window.screen.width}x${window.screen.height}`
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No entry yet - allow and create entry
  if (!entry) {
    rateLimitStore.set(identifier, { attempts: 1 })
    return { allowed: true }
  }

  // Check if currently locked out
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const remainingMs = entry.lockedUntil - now
    return { allowed: false, remainingTime: Math.ceil(remainingMs / 60000) } // minutes
  }

  // Lockout expired - reset
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    rateLimitStore.set(identifier, { attempts: 1 })
    return { allowed: true }
  }

  // Check if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION
    rateLimitStore.set(identifier, entry)
    return { allowed: false, remainingTime: 15 }
  }

  // Increment attempts and allow
  entry.attempts += 1
  rateLimitStore.set(identifier, entry)
  return { allowed: true }
}

function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [clientId, setClientId] = useState<string>('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [remainingTime, setRemainingTime] = useState<number>(0)

  useEffect(() => {
    // Set client identifier on mount
    setClientId(getClientIdentifier())
  }, [])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true)
      setError('')

      // Check rate limit before attempting login
      if (!clientId) {
        setError('Unable to verify request. Please refresh the page.')
        return
      }

      const rateLimitCheck = checkRateLimit(clientId)
      if (!rateLimitCheck.allowed) {
        setIsRateLimited(true)
        setRemainingTime(rateLimitCheck.remainingTime || 15)
        setError(`Too many login attempts. Please try again in ${rateLimitCheck.remainingTime || 15} minutes.`)
        return
      }

      console.log('🔐 Starting login...')

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      console.log('✅ Sign in response:', { data, error: signInError })

      if (signInError) {
        console.error('❌ Sign in error:', signInError)
        setError(signInError.message)
        return
      }

      if (!data.user) {
        console.error('❌ No user data returned')
        setError('Login failed. Please try again.')
        return
      }

      console.log('👤 User signed in:', data.user.id)

      // Check if user has admin role
      console.log('🔍 Checking admin role for user:', data.user.id)

      const { data: roleData, error: roleError } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', data.user.id)
        .single()

      console.log('📋 Role check result:', { roleData, roleError })

      if (roleError || !roleData) {
        console.error('❌ Admin check failed:', roleError)
        // Sign out if not admin
        await supabase.auth.signOut()
        setError('Access denied. Admin privileges required.')
        return
      }

      // Check if user is active (any admin role is allowed)
      if (!roleData.is_active) {
        console.error('❌ User account is inactive')
        await supabase.auth.signOut()
        setError('Access denied. Your account is inactive.')
        return
      }

      console.log('✅ Admin verified! Redirecting...')

      // Reset rate limit on successful login
      resetRateLimit(clientId)
      setIsRateLimited(false)

      // Redirect to admin dashboard
      router.push('/en/admin/dashboard')
      router.refresh()
    } catch (err) {
      console.error('💥 Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
      console.log('🏁 Login process complete')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isRateLimited}
              >
                {isLoading ? 'Signing in...' : isRateLimited ? `Locked (${remainingTime}m)` : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
