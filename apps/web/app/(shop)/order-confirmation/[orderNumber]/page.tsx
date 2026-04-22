import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@amiora/database'
import { OrderConfirmationClient } from '@/components/checkout/OrderConfirmationClient'

export const metadata: Metadata = { title: 'Order Confirmed!' }

interface Props {
  params: Promise<{ orderNumber: string }>
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params
  const supabase = createServerClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name,slug), product_images:products(product_images(*)))')
    .eq('order_number', orderNumber)
    .single()

  if (!order) {
    return (
      <div className="section-x py-24 text-center">
        <p className="font-display text-xl text-ink-muted">Order not found.</p>
        <Link href="/" className="mt-4 inline-block text-teal underline">Go home</Link>
      </div>
    )
  }

  return <OrderConfirmationClient order={order as Parameters<typeof OrderConfirmationClient>[0]['order']} />
}
