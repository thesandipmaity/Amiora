'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Package } from 'lucide-react'
import { formatINR } from '@/lib/pricing/calculator'

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  delivery_method: string
  store_id: string | null
  pickup_date: string | null
  created_at: string
}

export function OrderConfirmationClient({ order }: { order: Order }) {
  const isPickup = order.delivery_method === 'pickup'

  return (
    <div className="section-x py-20">
      <div className="max-w-xl mx-auto text-center space-y-8">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto w-24 h-24 rounded-full bg-teal/10 flex items-center justify-center"
        >
          <CheckCircle className="h-14 w-14 text-teal" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-2xs uppercase tracking-widest2 text-teal">
            {isPickup && order.status === 'booked_for_pickup' ? 'Booking Confirmed' : 'Order Confirmed'}
          </p>
          <h1 className="font-display text-display-2xl text-ink">Thank you!</h1>
          <p className="text-ink-muted">
            Your order <span className="font-semibold text-deep-teal">{order.order_number}</span> has been placed successfully.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-surface rounded-2xl p-6 text-left space-y-4"
        >
          <div className="flex items-center gap-3 text-sm">
            <Package className="h-4 w-4 text-teal shrink-0" />
            <div>
              <p className="font-medium text-ink">Order Total</p>
              <p className="text-ink-muted">{formatINR(order.total_amount)}</p>
            </div>
          </div>

          {isPickup && order.pickup_date && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-teal shrink-0" />
              <div>
                <p className="font-medium text-ink">Pickup Date</p>
                <p className="text-ink-muted">
                  {new Date(order.pickup_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <div className={`h-2.5 w-2.5 rounded-full ${
              order.status === 'confirmed' || order.status === 'booked_for_pickup' ? 'bg-teal' : 'bg-gold'
            }`} />
            <div>
              <p className="font-medium text-ink">Status</p>
              <p className="text-ink-muted capitalize">{order.status.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href="/account/orders" className="bg-deep-teal text-cream px-8 py-3.5 text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal transition-colors">
            View My Orders
          </Link>
          <Link href="/shop" className="border border-deep-teal text-deep-teal px-8 py-3.5 text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-deep-teal/5 transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
