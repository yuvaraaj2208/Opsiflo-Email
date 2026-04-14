import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/dashboard')
  }

  const [usersResult, statsResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('campaign_stats').select('total_sent, replies, unique_opens'),
  ])

  const totalUsers = (usersResult.data ?? []).length
  const paidUsers = (usersResult.data ?? []).filter((u) => u.plan !== 'free').length

  const globalStats = (statsResult.data ?? []).reduce(
    (acc, s) => ({
      emails: acc.emails + (s.total_sent ?? 0),
      opens: acc.opens + (s.unique_opens ?? 0),
      replies: acc.replies + (s.replies ?? 0),
    }),
    { emails: 0, opens: 0, replies: 0 }
  )

  return (
    <AdminDashboard
      users={usersResult.data ?? []}
      globalStats={globalStats}
      totalUsers={totalUsers}
      paidUsers={paidUsers}
    />
  )
}
