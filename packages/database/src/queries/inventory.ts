import type { SupabaseClient } from '../client'

export async function getVariantInventory(client: SupabaseClient, variantId: string) {
  return client
    .from('product_variants')
    .select('id, sku, stock_quantity, reserved_quantity, is_available')
    .eq('id', variantId)
    .single()
}

export async function getLowStockVariants(client: SupabaseClient, threshold = 5) {
  return client
    .from('product_variants')
    .select(`*, products (name, slug)`)
    .lte('stock_quantity', threshold)
    .eq('is_available', true)
    .order('stock_quantity', { ascending: true })
}

export async function updateVariantStock(
  client: SupabaseClient,
  variantId: string,
  stockQuantity: number
) {
  return client
    .from('product_variants')
    .update({
      stock_quantity: stockQuantity,
      is_available: stockQuantity > 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', variantId)
    .select()
    .single()
}

export async function reserveStock(
  client: SupabaseClient,
  variantId: string,
  quantity: number
) {
  return client.rpc('reserve_stock', { p_variant_id: variantId, p_quantity: quantity })
}

export async function releaseStock(
  client: SupabaseClient,
  variantId: string,
  quantity: number
) {
  return client.rpc('release_stock', { p_variant_id: variantId, p_quantity: quantity })
}
