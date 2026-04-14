import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/overview'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, campaignsResult, prospectsResult, repliesResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('campaigns')
      .select('*, campaign_stats(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('prospects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('replies')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
  ])

  // Aggregate stats
  const campaigns = campaignsResult.data ?? []
  const totalSent = campaigns.reduce((sum, c) => sum + (c.campaign_stats?.[0]?.total_sent ?? 0), 0)
  const totalOpens = campaigns.reduce((sum, c) => sum + (c.campaign_stats?.[0]?.unique_opens ?? 0), 0)
  const totalReplies = campaigns.reduce((sum, c) => sum + (c.campaign_stats?.[0]?.replies ?? 0), 0)

  return (
    <DashboardOverview
      profile={profileResult.data}
      recentCampaigns={campaigns}
      totalProspects={prospectsResult.count ?? 0}
      unreadReplies={repliesResult.count ?? 0}
      stats={{
        totalSent,
        totalOpens,
        totalReplies,
        openRate: totalSent > 0 ? (totalOpens / totalSent) * 100 : 0,
        replyRate: totalSent > 0 ? (totalReplies / totalSent) * 100 : 0,
      }}
    />
  )
}
