export { createBrowserClient, createServerClient } from './client'
export type { SupabaseClient, SupabaseServerClient } from './client'

export * from './queries/products'
export * from './queries/pricing'
export * from './queries/orders'
export * from './queries/inventory'
export * from './queries/customers'

export * from './realtime/pricingSubscription'

export type { Database } from './types/supabase'
