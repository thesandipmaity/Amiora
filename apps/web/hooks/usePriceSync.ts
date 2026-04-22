'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@amiora/database'
import { toast } from 'sonner'

type PriceUpdateCallback = () => void

/**
 * Subscribes to Supabase Realtime live_prices table changes.
 * When a price update is detected, calls the provided callback so the
 * caller can refetch prices — e.g., invalidate SWR or React Query cache.
 */
export function usePriceSync(onUpdate: PriceUpdateCallback) {
  useEffect(() => {
    // Skip when Supabase is not yet configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    if (!url || url.includes('placeholder')) return

    let supabase: ReturnType<typeof createBrowserClient>
    try {
      supabase = createBrowserClient()
    } catch {
      return
    }

    const channel = supabase
      .channel('storefront-prices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_prices' },
        () => {
          onUpdate()
          toast.info('Gold & silver rates updated', {
            description: 'Prices on this page have been refreshed.',
            duration:    4000,
          })
        }
      )
      .subscribe((_, err) => {
        if (err) console.warn('[PriceSync] Realtime not active yet:', err.message)
      })

    return () => { supabase.removeChannel(channel) }
  }, [onUpdate])
}
