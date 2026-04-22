import type { SupabaseClient } from '../client'
import type { OrderStatus, PaginationParams } from '@amiora/types'

export async function getOrders(
  client: SupabaseClient,
  params: PaginationParams & {
    customerId?: string
    status?: OrderStatus
    fromDate?: string
    toDate?: string
  } = {}
) {
  const { page = 1, pageSize = 20, sortBy = 'created_at', sortOrder = 'desc', search } = params

  let query = client
    .from('orders')
    .select(`*, order_items (*), profiles (full_name, email, phone)`, { count: 'exact' })

  if (params.customerId) query = query.eq('customer_id', params.customerId)
  if (params.status) query = query.eq('status', params.status)
  if (params.fromDate) query = query.gte('created_at', params.fromDate)
  if (params.toDate) query = query.lte('created_at', params.toDate)
  if (search) query = query.ilike('order_number', `%${search}%`)

  return query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1)
}

export async function getOrderById(client: SupabaseClient, id: string) {
  return client
    .from('orders')
    .select(`*, order_items (*), order_status_history (*), profiles (full_name, email, phone)`)
    .eq('id', id)
    .single()
}

export async function getOrderByNumber(client: SupabaseClient, orderNumber: string) {
  return client
    .from('orders')
    .select(`*, order_items (*), order_status_history (*)`)
    .eq('order_number', orderNumber)
    .single()
}

export async function updateOrderStatus(
  client: SupabaseClient,
  orderId: string,
  status: OrderStatus,
  note?: string
) {
  const { data: order, error } = await client
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) return { data: null, error }

  await client.from('order_status_history').insert({
    order_id: orderId,
    status,
    note: note ?? null,
    changed_at: new Date().toISOString(),
  })

  return { data: order, error: null }
}
