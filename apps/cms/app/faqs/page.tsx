import { createServerClient } from '@amiora/database'
import { FaqsClient } from '@/components/tables/FaqsClient'

export const dynamic = 'force-dynamic'

export default async function FaqsPage() {
  const supabase = createServerClient()
  const { data: faqs } = await supabase
    .from('site_faqs')
    .select('*')
    .order('sort_order')
    .order('created_at')

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-deep-teal">FAQs</h2>
        <p className="text-sm text-ink-muted mt-1">Manage frequently asked questions shown on the homepage.</p>
      </div>
      <FaqsClient faqs={(faqs ?? []) as Parameters<typeof FaqsClient>[0]['faqs']} />
    </div>
  )
}
