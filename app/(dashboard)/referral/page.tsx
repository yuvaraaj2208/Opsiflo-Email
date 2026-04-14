import { createClient } from '@/lib/supabase/server'
import { ReferralDashboard } from '@/components/referral/referral-dashboard'

export default async function ReferralPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileResult, referralsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('referrals').select('*').eq('referrer_id', user!.id),
  ])

  return (
    <ReferralDashboard
      profile={profileResult.data}
      referrals={referralsResult.data ?? []}
    />
  )
}
