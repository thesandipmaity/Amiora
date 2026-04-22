import type { SupabaseClient } from '../client'
import type { LiveMetal } from '../types/supabase'

type LivePriceRow = {
  id: string
  metal: LiveMetal
  price_per_gram: number
  currency: string
  fetched_at: string
}

type PriceUpdateCallback = (row: LivePriceRow) => void

/**
 * Subscribe to live price changes via Supabase Realtime.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToPricingUpdates(
  client: SupabaseClient,
  onUpdate: PriceUpdateCallback
): () => void {
  const channel = client
    .channel('live-prices')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'live_prices',
      },
      (payload) => {
        const row = payload.new as LivePriceRow
        onUpdate(row)
      }
    )
    .subscribe()

  return () => {
    void client.removeChannel(channel)
  }
}
