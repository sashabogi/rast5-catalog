import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/supabase/server'
import { AdminNavbar } from '@/components/admin/AdminNavbar'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentAdminUser()

  // Redirect to login if not authenticated or not admin
  if (!user) {
    redirect(`/${locale}/admin/login`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar userEmail={user.email || ''} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
