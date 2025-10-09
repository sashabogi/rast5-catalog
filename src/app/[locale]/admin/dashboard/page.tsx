import { getCurrentAdminUser, createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Cable, Terminal, Video, Languages } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getDashboardStats() {
  const supabase = await createClient()

  // Get counts from database
  const [connectorsResult, terminalsResult] = await Promise.all([
    supabase.from('connectors').select('*', { count: 'exact', head: true }),
    supabase.from('terminals').select('*', { count: 'exact', head: true }),
  ])

  return {
    connectors: connectorsResult.count || 0,
    terminals: terminalsResult.count || 0,
    videos: 0, // Placeholder for video count
    translations: 0, // Placeholder for translation count
  }
}

export default async function AdminDashboardPage() {
  const user = await getCurrentAdminUser()
  const stats = await getDashboardStats()

  const quickActions = [
    {
      title: 'Manage Connectors',
      description: 'Add, edit, or delete connector entries',
      icon: Cable,
      href: '/en/admin/connectors',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Manage Terminals',
      description: 'Configure terminal specifications',
      icon: Terminal,
      href: '/en/admin/terminals',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Video Library',
      description: 'Upload and manage 360° videos',
      icon: Video,
      href: '/en/admin/videos',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Translations',
      description: 'Manage multi-language content',
      icon: Languages,
      href: '/en/admin/translations',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const statCards = [
    {
      title: 'Total Connectors',
      value: stats.connectors,
      icon: Cable,
      color: 'text-blue-600',
    },
    {
      title: 'Total Terminals',
      value: stats.terminals,
      icon: Terminal,
      color: 'text-green-600',
    },
    {
      title: '360° Videos',
      value: stats.videos,
      icon: Video,
      color: 'text-purple-600',
    },
    {
      title: 'Languages',
      value: stats.translations,
      icon: Languages,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user?.email}
        </h1>
        <p className="text-slate-600">
          Manage your RAST 5 Connector Catalog content from this dashboard.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={action.href}>
                    <Button variant="outline" className="w-full">
                      Open
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-slate-600">User Role</span>
            <span className="text-sm font-medium">Administrator</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-slate-600">Database Status</span>
            <span className="text-sm font-medium text-green-600">Connected</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-600">Last Updated</span>
            <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
