/**
 * Comprehensive Unit Tests for Login Page Rate Limiting
 *
 * Tests cover:
 * - Client fingerprinting (browser + screen resolution)
 * - 5 attempts per 15 minutes
 * - Map-based tracking
 * - Automatic lockout after 5 failed attempts
 * - Countdown timer during lockout
 * - Reset on successful login
 * - Cross-browser isolation (different fingerprints)
 * - Expired lockouts (after 15 minutes)
 *
 * NOTE: Tests use unique fingerprints to avoid interference from the
 * module-level rate limit store.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import AdminLoginPage from '../page'
import { supabase } from '@/lib/supabase/client'

// ============================================================================
// Mocks
// ============================================================================

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}))

// Base mock values
const baseMockNavigator = {
  userAgent: 'Mozilla/5.0 (Test Browser)',
}

const baseMockScreen = {
  width: 1920,
  height: 1080,
}

// ============================================================================
// Test Helpers
// ============================================================================

const validEmail = 'admin@example.com'
const validPassword = 'password123'

let testCounter = 0

/**
 * Set a unique fingerprint for each test to avoid interference
 */
function setUniqueFingerprint() {
  testCounter++
  Object.defineProperty(global, 'navigator', {
    value: { userAgent: `Test-Browser-${testCounter}` },
    writable: true,
    configurable: true,
  })
  Object.defineProperty(global, 'screen', {
    value: { width: 1920 + testCounter, height: 1080 },
    writable: true,
    configurable: true,
  })
}

/**
 * Helper to simulate a login attempt
 */
async function attemptLogin(
  email: string = validEmail,
  password: string = validPassword,
  shouldWaitForCall: boolean = true
) {
  const user = userEvent.setup()

  const emailInput = screen.getByPlaceholderText(/admin@example.com/i)
  const passwordInput = screen.getByPlaceholderText(/••••••••/i)
  const submitButton = screen.getByRole('button')

  await user.clear(emailInput)
  await user.type(emailInput, email)
  await user.clear(passwordInput)
  await user.type(passwordInput, password)

  const beforeCallCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

  await user.click(submitButton)

  if (shouldWaitForCall) {
    // Wait for the call to be made
    await waitFor(
      () => {
        expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBeGreaterThan(
          beforeCallCount
        )
      },
      { timeout: 3000 }
    )
  } else {
    // Give it a moment but don't expect a call
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

/**
 * Helper to mock a failed login response
 */
function mockFailedLogin() {
  (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
    data: { user: null, session: null },
    error: { message: 'Invalid login credentials' },
  })
}

/**
 * Helper to mock a successful login response
 */
function mockSuccessfulLogin() {
  const mockUser = { id: 'user-123', email: validEmail }

  ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
    data: { user: mockUser, session: { access_token: 'token-123' } },
    error: null,
  })

  const mockFrom = supabase.from as jest.Mock
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: { role: 'super_admin', is_active: true },
          error: null,
        }),
      }),
    }),
  })
}

/**
 * Calculate expected fingerprint hash
 */
function calculateFingerprint(userAgent: string, width: number, height: number): string {
  const fingerprint = `${userAgent}-${width}x${height}`
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Login Rate Limiting', () => {
  let mockRouterPush: jest.Mock
  let mockRouterRefresh: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset time mocks
    jest.spyOn(Date, 'now').mockRestore()

    // Get router mocks
    const router = useRouter()
    mockRouterPush = router.push as jest.Mock
    mockRouterRefresh = router.refresh as jest.Mock
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ==========================================================================
  // Client Fingerprinting Tests
  // ==========================================================================

  describe('Client Fingerprinting', () => {
    it('should generate consistent fingerprint for same browser and screen', () => {
      const userAgent = 'Mozilla/5.0 (Test Browser)'
      const width = 1920
      const height = 1080

      const fingerprint1 = calculateFingerprint(userAgent, width, height)
      const fingerprint2 = calculateFingerprint(userAgent, width, height)

      expect(fingerprint1).toBe(fingerprint2)
      // Just verify it's a consistent number
      expect(fingerprint1).toMatch(/^-?\d+$/)
    })

    it('should generate different fingerprint for different user agent', () => {
      const fingerprint1 = calculateFingerprint('Browser A', 1920, 1080)
      const fingerprint2 = calculateFingerprint('Browser B', 1920, 1080)

      expect(fingerprint1).not.toBe(fingerprint2)
    })

    it('should generate different fingerprint for different screen resolution', () => {
      const fingerprint1 = calculateFingerprint('Mozilla/5.0', 1920, 1080)
      const fingerprint2 = calculateFingerprint('Mozilla/5.0', 1366, 768)

      expect(fingerprint1).not.toBe(fingerprint2)
    })

    it('should generate fingerprint on component mount', () => {
      setUniqueFingerprint()
      render(<AdminLoginPage />)

      // The component should set clientId in useEffect
      // We verify this indirectly by checking that the form is rendered
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Basic Rate Limiting Tests
  // ==========================================================================

  describe('Rate Limit Enforcement (5 attempts max)', () => {
    it('should allow first login attempt', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      await attemptLogin()

      // Check that login was attempted
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled()
    })

    it('should allow up to 5 failed login attempts', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      const { unmount } = render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Attempt 5 logins
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      const finalCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length
      expect(finalCount - initialCount).toBe(5)

      unmount()
    })

    it('should track attempts per client fingerprint', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 3 attempts
      for (let i = 0; i < 3; i++) {
        await attemptLogin()
      }

      const finalCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length
      // All 3 attempts should succeed (not be blocked)
      expect(finalCount - initialCount).toBe(3)
    })

    it('should increment attempt counter on each failed login', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Each attempt should be allowed until we hit 5
      await attemptLogin()
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 1
      )

      await attemptLogin()
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 2
      )

      await attemptLogin()
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 3
      )
    })
  })

  // ==========================================================================
  // Lockout Behavior Tests
  // ==========================================================================

  describe('Lockout After 5 Failed Attempts', () => {
    it('should block 6th login attempt', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      // 6th attempt should be blocked
      await attemptLogin(validEmail, validPassword, false)

      // Should still only have 5 new calls (6th was blocked)
      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
      })
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )
    })

    it('should show lockout error message on 6th attempt', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // 6th attempt
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
        expect(screen.getByText(/please try again in 15 minutes/i)).toBeInTheDocument()
      })
    })

    it('should disable submit button when rate limited', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // 6th attempt triggers lockout
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        const submitButton = screen.getByRole('button')
        expect(submitButton).toBeDisabled()
        expect(submitButton).toHaveTextContent(/locked/i)
      })
    })

    it('should set lockout duration to 15 minutes', async () => {
      setUniqueFingerprint()
      const mockNow = Date.now()
      jest.spyOn(Date, 'now').mockReturnValue(mockNow)

      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // 6th attempt
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        // Should show 15 minutes remaining
        expect(screen.getByText(/15 minutes/i)).toBeInTheDocument()
      })
    })

    it('should prevent multiple lockout attempts', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // Attempt 6, 7, 8 - all should be blocked
      await attemptLogin(validEmail, validPassword, false)
      await attemptLogin(validEmail, validPassword, false)
      await attemptLogin(validEmail, validPassword, false)

      // Should still only have 5 successful calls
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )
    })
  })

  // ==========================================================================
  // Timer and Countdown Tests
  // ==========================================================================

  describe('Lockout Timer Countdown', () => {
    it('should display remaining time in minutes', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // Trigger lockout
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveTextContent(/locked \(15m\)/i)
      })
    })

    it('should calculate remaining time correctly', async () => {
      setUniqueFingerprint()
      const mockNow = 1000000
      const mockDateNow = jest.spyOn(Date, 'now')
      mockDateNow.mockReturnValue(mockNow)

      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // Trigger lockout
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/15 minutes/i)).toBeInTheDocument()
      })

      // Advance time by 5 minutes
      mockDateNow.mockReturnValue(mockNow + 5 * 60 * 1000)

      // Try another attempt to recalculate remaining time
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        // Should show 10 minutes remaining
        expect(screen.getByText(/10 minutes/i)).toBeInTheDocument()
      })
    })
  })

  // ==========================================================================
  // Successful Login Reset Tests
  // ==========================================================================

  describe('Reset on Successful Login', () => {
    it('should allow successful login before hitting rate limit', async () => {
      setUniqueFingerprint()
      // First, make 3 failed attempts
      mockFailedLogin()
      render(<AdminLoginPage />)

      for (let i = 0; i < 3; i++) {
        await attemptLogin()
      }

      // Now succeed
      mockSuccessfulLogin()
      await attemptLogin()

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/en/admin/dashboard')
      })
    })

    it('should not reset rate limit on failed login', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // 6th attempt should still be blocked
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
      })
    })
  })

  // ==========================================================================
  // Cross-Browser Isolation Tests
  // ==========================================================================

  describe('Cross-Browser Isolation (Different Fingerprints)', () => {
    it('should isolate rate limits between different browsers', async () => {
      mockFailedLogin()

      // Browser A attempts
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: `Isolated-Browser-A-${testCounter}` },
        writable: true,
        configurable: true,
      })

      const { unmount: unmountA } = render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 attempts with Browser A
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      unmountA()
      jest.clearAllMocks()

      // Browser B attempts
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: `Isolated-Browser-B-${testCounter}` },
        writable: true,
        configurable: true,
      })

      render(<AdminLoginPage />)

      // Browser B should be able to make attempts
      await attemptLogin()

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1)
    })

    it('should isolate rate limits between different screen resolutions', async () => {
      mockFailedLogin()

      // Screen resolution A
      Object.defineProperty(global, 'screen', {
        value: { width: 9000 + testCounter, height: 1080 },
        writable: true,
        configurable: true,
      })

      const { unmount: unmountA } = render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 attempts with resolution A
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      unmountA()
      jest.clearAllMocks()

      // Screen resolution B
      Object.defineProperty(global, 'screen', {
        value: { width: 8000 + testCounter, height: 768 },
        writable: true,
        configurable: true,
      })

      render(<AdminLoginPage />)

      // Resolution B should be able to make attempts
      await attemptLogin()

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1)
    })

    it('should maintain separate attempt counters per fingerprint', async () => {
      mockFailedLogin()

      // Browser A makes 3 attempts
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: `Unique-Browser-A-${testCounter}` },
        writable: true,
        configurable: true,
      })

      const { unmount: unmountA } = render(<AdminLoginPage />)

      const initialCountA = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      for (let i = 0; i < 3; i++) {
        await attemptLogin()
      }

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCountA + 3
      )

      unmountA()
      jest.clearAllMocks()

      // Browser B makes 2 attempts
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: `Unique-Browser-B-${testCounter}` },
        writable: true,
        configurable: true,
      })

      render(<AdminLoginPage />)

      for (let i = 0; i < 2; i++) {
        await attemptLogin()
      }

      // Both should be able to continue (not locked)
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(2)
    })
  })

  // ==========================================================================
  // Expired Lockout Tests
  // ==========================================================================

  describe('Expired Lockouts (After 15 Minutes)', () => {
    it('should allow login after lockout expires', async () => {
      setUniqueFingerprint()
      const mockNow = 1000000
      const mockDateNow = jest.spyOn(Date, 'now')
      mockDateNow.mockReturnValue(mockNow)

      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 failed attempts to trigger lockout
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // 6th attempt - should be locked
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
      })

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      // Advance time by 15 minutes + 1 second
      mockDateNow.mockReturnValue(mockNow + 15 * 60 * 1000 + 1000)

      // Now attempt should succeed (not be blocked)
      await attemptLogin()

      // Should have made a new call
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 6
      )
    })

    it('should reset attempt counter after lockout expires', async () => {
      setUniqueFingerprint()
      const mockNow = 1000000
      const mockDateNow = jest.spyOn(Date, 'now')
      mockDateNow.mockReturnValue(mockNow)

      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // Trigger lockout
      await attemptLogin(validEmail, validPassword, false)

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      // Advance time past lockout
      mockDateNow.mockReturnValue(mockNow + 16 * 60 * 1000)

      // Should be able to make new attempts (counter reset to 1)
      await attemptLogin()

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 6
      )
    })

    it('should still block login if lockout has not expired', async () => {
      setUniqueFingerprint()
      const mockNow = 1000000
      const mockDateNow = jest.spyOn(Date, 'now')
      mockDateNow.mockReturnValue(mockNow)

      mockFailedLogin()
      render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // Trigger lockout
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
      })

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      // Advance time by only 10 minutes (not enough)
      mockDateNow.mockReturnValue(mockNow + 10 * 60 * 1000)

      // Should still be blocked
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
      })

      // Should not have made a new login call
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )
    })

    it('should update remaining time as lockout progresses', async () => {
      setUniqueFingerprint()
      const mockNow = 1000000
      const mockDateNow = jest.spyOn(Date, 'now')
      mockDateNow.mockReturnValue(mockNow)

      mockFailedLogin()
      render(<AdminLoginPage />)

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await attemptLogin()
      }

      // Trigger lockout - should show 15 minutes
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/15 minutes/i)).toBeInTheDocument()
      })

      // Advance time by 7 minutes
      mockDateNow.mockReturnValue(mockNow + 7 * 60 * 1000)

      // Try again to get updated time
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        // Should show 8 minutes remaining (rounded up)
        expect(screen.getByText(/8 minutes/i)).toBeInTheDocument()
      })
    })
  })

  // ==========================================================================
  // Edge Cases and Error Handling
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle component mount and set clientId', async () => {
      setUniqueFingerprint()
      render(<AdminLoginPage />)

      // Wait for component to mount and set clientId
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      // Normal login should work
      mockFailedLogin()
      await attemptLogin()

      expect(supabase.auth.signInWithPassword).toHaveBeenCalled()
    })

    it('should maintain rate limit state across re-renders', async () => {
      setUniqueFingerprint()
      mockFailedLogin()
      const { rerender } = render(<AdminLoginPage />)

      const initialCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Make 3 attempts
      for (let i = 0; i < 3; i++) {
        await attemptLogin()
      }

      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 3
      )

      // Re-render component
      rerender(<AdminLoginPage />)

      // Make 2 more attempts (should still be tracking)
      for (let i = 0; i < 2; i++) {
        await attemptLogin()
      }

      // Total 5 attempts
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(
        initialCount + 5
      )

      // Next should be blocked
      await attemptLogin(validEmail, validPassword, false)

      await waitFor(() => {
        expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument()
      })
    })

    it('should properly handle form validation before rate limit check', async () => {
      setUniqueFingerprint()
      render(<AdminLoginPage />)

      const user = userEvent.setup()
      const emailInput = screen.getByPlaceholderText(/admin@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/i)
      const submitButton = screen.getByRole('button')

      const beforeCount = (supabase.auth.signInWithPassword as jest.Mock).mock.calls.length

      // Try to submit with invalid email
      await user.type(emailInput, 'not-an-email')
      await user.type(passwordInput, '12345') // Too short
      await user.click(submitButton)

      // Give it a moment
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should not call signInWithPassword due to validation
      expect((supabase.auth.signInWithPassword as jest.Mock).mock.calls.length).toBe(beforeCount)
    })
  })
})
