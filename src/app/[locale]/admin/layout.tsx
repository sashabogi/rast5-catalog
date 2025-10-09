import { getCurrentAdminUser } from '@/lib/supabase/server'
import { AdminNavbar } from '@/components/admin/AdminNavbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAdminUser()

  // If user is authenticated and admin, show admin layout with navbar
  if (user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar userEmail={user.email || ''} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    )
  }

  // If not authenticated, just render children (for login page)
  return <>{children}</>
}
