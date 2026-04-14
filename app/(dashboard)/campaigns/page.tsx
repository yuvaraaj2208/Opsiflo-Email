import { createClient } from '@/lib/supabase/server'
import { CampaignsListView } from '@/components/campaigns/campaigns-list'

export default async function CampaignsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, campaign_stats(*)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return <CampaignsListView campaigns={campaigns ?? []} />
}
