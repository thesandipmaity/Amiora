import type { SupabaseClient } from '../client'
import type { PaginationParams } from '@amiora/types'

export async function getCustomers(
  client: SupabaseClient,
  params: PaginationParams & { tier?: string } = {}
) {
  const { page = 1, pageSize = 20, search } = params

  let query = client.from('profiles').select('*', { count: 'exact' })

  if (params.tier) query = query.eq('tier', params.tier)
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)

  return query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)
}

export async function getCustomerById(client: SupabaseClient, id: string) {
  return client
    .from('profiles')
    .select(`*, orders (id, order_number, total, status, created_at)`)
    .eq('id', id)
    .single()
}

export async function updateCustomerTier(
  client: SupabaseClient,
  customerId: string,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
) {
  return client
    .from('profiles')
    .update({ tier, updated_at: new Date().toISOString() })
    .eq('id', customerId)
    .select()
    .single()
}

export async function getWishlistItems(client: SupabaseClient, customerId: string) {
  return client
    .from('wishlist_items')
    .select(`*, products (id, slug, name, product_images: product_images (*))`)
    .eq('customer_id', customerId)
    .order('added_at', { ascending: false })
}
