import { createClient } from '@/lib/supabase/server'
import { TemplatesView } from '@/components/templates/templates-view'

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [userTemplatesResult, publicTemplatesResult] = await Promise.all([
    supabase.from('templates').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('templates').select('*').eq('is_public', true).order('upvotes', { ascending: false }).limit(20),
  ])

  return (
    <TemplatesView
      userTemplates={userTemplatesResult.data ?? []}
      publicTemplates={publicTemplatesResult.data ?? []}
    />
  )
}
