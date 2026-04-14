import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import type { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: unreadCount } = await supabase
    .from('replies')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  const isAdmin = user.user_metadata?.role === 'admin'

  return (
    <div className="flex h-screen bg-[#0D1321] overflow-hidden">
      <Sidebar unreadCount={unreadCount ?? 0} isAdmin={isAdmin} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header profile={profile as Profile} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
