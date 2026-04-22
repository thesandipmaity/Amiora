import type { Metadata } from 'next'
import { createServerClient } from '@amiora/database'
import { CouponsClient } from '@/components/tables/CouponsClient'

export const metadata: Metadata = { title: 'Coupons | Amiora CMS' }
export const dynamic = 'force-dynamic'

export default async function CouponsPage() {
  const supabase = createServerClient()
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return <CouponsClient initial={coupons ?? []} />
}
