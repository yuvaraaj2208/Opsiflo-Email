import { createClient } from '@/lib/supabase/server'
import { InboxView } from '@/components/inbox/inbox-view'

export default async function InboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: replies } = await supabase
    .from('replies')
    .select('*, prospect:prospects(*), campaign:campaigns(name, subject)')
    .order('received_at', { ascending: false })
    .limit(50)

  return <InboxView replies={replies ?? []} />
}
