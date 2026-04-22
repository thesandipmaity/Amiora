import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@amiora/database'
import { RequestsTabs } from '@/components/account/RequestsTabs'

export const metadata: Metadata = { title: 'My Requests' }

export default async function RequestsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: customizations },
    { data: callbacks },
    { data: demos },
  ] = await Promise.all([
    supabase.from('customization_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('callback_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('demo_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <h1 className="font-display text-display-xl text-ink mb-8">My Requests</h1>
      <RequestsTabs
        customizations={customizations ?? []}
        callbacks={callbacks ?? []}
        demos={demos ?? []}
      />
    </div>
  )
}
