import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type AdminRole = 'super_admin' | 'content_manager' | 'translator' | 'sales_viewer';

interface AdminUser {
  user_id: string;
  role: AdminRole;
  is_active: boolean;
  email: string | null;
  full_name: string | null;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROTECTED_ADMIN_PATHS = [
  '/en/admin',
  '/it/admin',
  '/es/admin',
  '/de/admin',
  '/ru/admin',
  '/pt/admin',
];

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
];

// All valid admin roles
const VALID_ADMIN_ROLES: AdminRole[] = [
  'super_admin',
  'content_manager',
  'translator',
  'sales_viewer',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract locale from pathname
 * Example: /en/admin/dashboard -> 'en'
 */
function extractLocale(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})\//);
  return match ? match[1] : null;
}

/**
 * Check if path is an admin path
 */
function isAdminPath(pathname: string): boolean {
  return PROTECTED_ADMIN_PATHS.some(path => pathname.startsWith(path));
}

/**
 * Check if path is a public admin path (like login)
 */
function isPublicAdminPath(pathname: string): boolean {
  const locale = extractLocale(pathname) || defaultLocale;
  return PUBLIC_ADMIN_PATHS.some(path => pathname === `/${locale}${path}`);
}

/**
 * Create Supabase client for middleware with cookie handling
 */
function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
}

/**
 * Create Supabase service client for admin checks
 */
function createSupabaseServiceClient() {
  // Use service role key to bypass RLS
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for service client
        },
      },
    }
  );

  return supabase;
}

/**
 * Check if user has admin role and is active
 */
async function checkAdminAccess(userId: string): Promise<{
  isAdmin: boolean;
  adminUser?: AdminUser;
  error?: string;
}> {
  try {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id, role, is_active, email, full_name')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('[Middleware] Admin check error:', error);
      return { isAdmin: false, error: error.message };
    }

    if (!data) {
      console.log('[Middleware] No admin user found for userId:', userId);
      return { isAdmin: false, error: 'User not found in admin_users' };
    }

    const adminUser = data as AdminUser;

    // Check if user is active
    if (!adminUser.is_active) {
      console.log('[Middleware] Admin user is inactive:', userId);
      return { isAdmin: false, error: 'Admin user is inactive' };
    }

    // Check if role is valid
    if (!VALID_ADMIN_ROLES.includes(adminUser.role)) {
      console.log('[Middleware] Invalid admin role:', adminUser.role);
      return { isAdmin: false, error: 'Invalid admin role' };
    }

    console.log('[Middleware] Admin access granted:', {
      userId,
      role: adminUser.role,
      email: adminUser.email,
    });

    return { isAdmin: true, adminUser };
  } catch (err) {
    console.error('[Middleware] Unexpected error in checkAdminAccess:', err);
    return { isAdmin: false, error: 'Unexpected error checking admin access' };
  }
}

/**
 * Log unauthorized access attempt (simplified for middleware)
 */
function logUnauthorizedAccess(
  pathname: string,
  userId: string | null,
  reason: string,
  request: NextRequest
): void {
  // Log to console - in production, consider sending to logging service
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  console.warn('[Security] Unauthorized admin access attempt:', {
    pathname,
    userId: userId || 'anonymous',
    reason,
    ipAddress,
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
  });

  // TODO: Consider implementing actual audit logging here
  // This would require edge-compatible logging service
  // For now, console logging provides basic security monitoring
}

// ============================================================================
// ADMIN MIDDLEWARE
// ============================================================================

/**
 * Admin middleware - handles authentication and authorization for admin routes
 */
async function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if not an admin path
  if (!isAdminPath(pathname)) {
    return null; // Continue to next middleware
  }

  // Allow public admin paths (login page)
  if (isPublicAdminPath(pathname)) {
    return null; // Continue to next middleware
  }

  // Extract locale from path
  const locale = extractLocale(pathname) || defaultLocale;

  // Create Supabase client
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (authError || !user) {
    logUnauthorizedAccess(pathname, null, 'Not authenticated', request);

    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access
  const { isAdmin, adminUser, error: adminError } = await checkAdminAccess(user.id);

  if (!isAdmin) {
    logUnauthorizedAccess(
      pathname,
      user.id,
      adminError || 'Not an admin user',
      request
    );

    // Redirect to login with error message
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    loginUrl.searchParams.set('error', 'unauthorized');
    loginUrl.searchParams.set('message', 'You do not have permission to access the admin area');
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated and has admin access
  // Add custom headers to pass user info to the page (optional)
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', adminUser!.role);
  response.headers.set('x-user-email', adminUser!.email || '');

  return response;
}

// ============================================================================
// MAIN MIDDLEWARE
// ============================================================================

/**
 * Main middleware function
 * Combines i18n middleware with admin authentication
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run admin middleware first for admin paths
  const adminResponse = await adminMiddleware(request);
  if (adminResponse) {
    return adminResponse; // Return early if admin middleware handled it (redirect)
  }

  // 2. Run i18n middleware for all paths
  const intlMiddleware = createIntlMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localeDetection: true,
  });

  return intlMiddleware(request);
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  // Match all pathnames except for
  // - API routes (/_next, /api, /_vercel)
  // - Static files (files with dots, e.g., favicon.ico, images, etc.)
  matcher: [
    '/',
    '/(de|en|es|it|ru|pt)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
