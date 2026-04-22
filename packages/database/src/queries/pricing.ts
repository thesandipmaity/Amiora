import type { SupabaseClient } from '../client'
import type { LiveMetal } from '../types/supabase'

/** Fetch the most recent live prices for all metals */
export async function getLivePrices(client: SupabaseClient) {
  return client
    .from('live_prices')
    .select('*')
    .order('fetched_at', { ascending: false })
}

/** Get the latest price for a specific metal */
export async function getLatestMetalPrice(client: SupabaseClient, metal: LiveMetal) {
  return client
    .from('live_prices')
    .select('price_per_gram, currency, fetched_at')
    .eq('metal', metal)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single()
}

/** Upsert (insert or update) a live price record */
export async function upsertLivePrice(
  client: SupabaseClient,
  data: { metal: LiveMetal; price_per_gram: number; currency?: string }
) {
  return client
    .from('live_prices')
    .insert({
      metal: data.metal,
      price_per_gram: data.price_per_gram,
      currency: data.currency ?? 'INR',
      fetched_at: new Date().toISOString(),
    })
    .select()
    .single()
}
