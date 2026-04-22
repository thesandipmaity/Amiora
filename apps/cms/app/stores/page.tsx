import { createServerClient } from '@amiora/database'
import { StoresCRUD } from '@/components/tables/StoresCRUD'

export default async function StoresPage() {
  const supabase = createServerClient()
  // Note: stores table has no created_at column — do NOT select it
  const { data: stores, error } = await supabase
    .from('stores')
    .select('id, name, address, city, state, pincode, phone, email, is_active, timings, lat, lng, image_url')
    .order('name')

  if (error) console.error('[StoresPage]', error.message)

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-deep-teal">Stores</h2>
      <StoresCRUD stores={(stores ?? []) as Parameters<typeof StoresCRUD>[0]['stores']} />
    </div>
  )
}
