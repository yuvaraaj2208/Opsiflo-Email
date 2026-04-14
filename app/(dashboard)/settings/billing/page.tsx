import { createClient } from '@/lib/supabase/server'
import { BillingView } from '@/components/settings/billing-view'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileResult, subscriptionResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1).single(),
  ])

  // Detect country
  let country = 'US'
  try {
    // In production this would use ipapi.co
    country = profileResult.data?.country ?? 'US'
  } catch {}

  return (
    <BillingView
      profile={profileResult.data}
      subscription={subscriptionResult.data}
      country={country}
    />
  )
}
