import { createClient } from '@/lib/supabase/server'
import { ProspectsView } from '@/components/prospects/prospects-view'

export default async function ProspectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [prospectsResult, listsResult] = await Promise.all([
    supabase
      .from('prospects')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('prospect_lists')
      .select('*')
      .eq('user_id', user!.id),
  ])

  return (
    <ProspectsView
      prospects={prospectsResult.data ?? []}
      lists={listsResult.data ?? []}
    />
  )
}
