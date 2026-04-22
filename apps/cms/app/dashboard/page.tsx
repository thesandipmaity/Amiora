import { createServerClient } from '@amiora/database'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

async function getDashboardData() {
  const supabase = createServerClient()

  // Was 4 separate orders queries → now 2: one for all orders (aggregation),
  // one for recent orders (display). pending/revenue derived in-memory.
  const [allOrdersRes, requestsRes, recentOrdersRes, recentRequestsRes] = await Promise.all([
    supabase.from('orders').select('id, total_amount, created_at, status'),
    supabase.from('customization_requests').select('id').eq('status', 'pending'),
    supabase.from('orders').select('id, order_number, total_amount, status, created_at, user_id').order('created_at', { ascending: false }).limit(10),
    supabase.from('callback_requests').select('id, name, phone, preferred_time, status, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const allOrders    = allOrdersRes.data ?? []
  const totalRevenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total_amount ?? 0), 0)
  const pendingOrders = allOrders.filter(o => o.status === 'pending').length

  const now = new Date()
  const revenueByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    revenueByDay[d.toISOString().slice(0, 10)] = 0
  }
  allOrders.forEach(o => {
    const day = o.created_at?.slice(0, 10)
    if (day && day in revenueByDay) revenueByDay[day] += o.total_amount ?? 0
  })
  const revenueChart = Object.entries(revenueByDay).map(([date, amount]) => ({ date: date.slice(5), amount }))

  const statusCounts: Record<string, number> = {}
  allOrders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1 })
  const statusChart = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  return {
    totalRevenue,
    totalOrders:    allOrders.length,
    pendingOrders,
    pendingRequests: requestsRes.data?.length ?? 0,
    revenueChart,
    statusChart,
    recentOrders:   recentOrdersRes.data ?? [],
    recentRequests: recentRequestsRes.data ?? [],
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  return <DashboardClient {...data} />
}
