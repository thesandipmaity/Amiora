import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { OrdersList } from '@/components/account/OrdersList'

export const metadata: Metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name,slug,product_images(*)))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-display text-display-xl text-ink mb-8">My Orders</h1>
      <OrdersList orders={orders ?? []} />
    </div>
  )
}
