import { createServerClient } from '@amiora/database'
import { CustomersClient } from '@/components/tables/CustomersClient'

export default async function CustomersPage() {
  const supabase = createServerClient()
  const { data: customers } = await supabase
    .from('user_profiles')
    .select(`
      id, full_name, phone, gender, created_at,
      orders:orders(id, total_amount),
      wishlist:wishlists(id)
    `)
    .order('created_at', { ascending: false })

  const customersWithEmail = await Promise.all(
    (customers ?? []).slice(0, 100).map(async (c) => {
      const { data: auth } = await supabase.auth.admin.getUserById(c.id)
      return { ...c, email: auth.user?.email ?? '' }
    })
  )

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-deep-teal">Customers</h2>
      <CustomersClient customers={customersWithEmail} />
    </div>
  )
}
