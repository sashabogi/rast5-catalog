import { getCurrentAdminUser } from '@/lib/supabase/server'
import { Sidebar } from '@/components/admin/Sidebar'
import { UserProfileDropdown } from '@/components/admin/UserProfileDropdown'
import { AdminBreadcrumbs } from '@/components/admin/Breadcrumbs'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/admin/ErrorBoundary'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAdminUser()

  // If user is authenticated and admin, show admin layout with navbar and sidebar
  if (user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-50">
          {/* Sidebar - Fixed on desktop, drawer on mobile */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="lg:pl-64">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs on the left */}
                <div className="flex items-center flex-1">
                  <AdminBreadcrumbs className="hidden sm:flex" />
                </div>

                {/* User Profile Dropdown on the right */}
                <UserProfileDropdown
                  email={user.email || ''}
                  role="Administrator"
                />
              </div>
            </header>

            {/* Page Content */}
            <main className="p-4 sm:p-6 lg:p-8">
              {/* Mobile Breadcrumbs */}
              <div className="mb-4 sm:hidden">
                <AdminBreadcrumbs />
              </div>

              {children}
            </main>
          </div>

          {/* Toast Notifications */}
          <Toaster position="top-right" richColors />
        </div>
      </ErrorBoundary>
    )
  }

  // If not authenticated, just render children (for login page)
  // Wrap login page in ErrorBoundary too
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}