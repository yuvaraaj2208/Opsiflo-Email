import { createClient } from '@/lib/supabase/server'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, campaign_stats(*)')
    .eq('user_id', user!.id)
    .not('sent_at', 'is', null)

  const { data: events } = await supabase
    .from('email_events')
    .select('*')
    .in('campaign_id', (campaigns ?? []).map((c) => c.id))
    .order('occurred_at', { ascending: true })

  return <AnalyticsDashboard campaigns={campaigns ?? []} events={events ?? []} />
}
