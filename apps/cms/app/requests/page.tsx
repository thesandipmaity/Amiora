import { createServerClient } from '@amiora/database'
import { RequestsClient } from '@/components/tables/RequestsClient'

export default async function RequestsPage() {
  const supabase = createServerClient()
  const [{ data: customizations }, { data: callbacks }, { data: demos }] = await Promise.all([
    supabase.from('customization_requests').select('id, description, contact_preference, contact_value, status, created_at, user_id').order('created_at', { ascending: false }),
    supabase.from('callback_requests').select('id, name, phone, preferred_time, status, created_at').order('created_at', { ascending: false }),
    supabase.from('demo_requests').select('id, type, preferred_date, preferred_time, notes, status, created_at, store_id').order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-deep-teal">Requests Inbox</h2>
      <RequestsClient
        customizations={customizations ?? []}
        callbacks={callbacks ?? []}
        demos={demos ?? []}
      />
    </div>
  )
}
