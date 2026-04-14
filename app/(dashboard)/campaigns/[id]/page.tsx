import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CampaignDetail } from '@/components/campaigns/campaign-detail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, campaign_stats(*)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!campaign) notFound()

  const { data: events } = await supabase
    .from('email_events')
    .select('*')
    .eq('campaign_id', id)
    .order('occurred_at', { ascending: false })
    .limit(50)

  const { data: replies } = await supabase
    .from('replies')
    .select('*, prospect:prospects(*)')
    .eq('campaign_id', id)
    .order('received_at', { ascending: false })

  return (
    <CampaignDetail
      campaign={campaign}
      events={events ?? []}
      replies={replies ?? []}
    />
  )
}
