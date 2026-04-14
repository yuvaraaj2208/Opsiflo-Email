import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import type { Profile } from '@/types'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex h-screen bg-[#0D1321] overflow-hidden">
      <Sidebar isAdmin={true} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header profile={profile as Profile} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
