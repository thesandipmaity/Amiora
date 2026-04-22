'use client'

import dynamic from 'next/dynamic'
import { IndianRupee, ShoppingBag, Clock, MessageSquare } from 'lucide-react'
import { StatCard }    from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/Badge'

// Recharts is ~300KB — lazy-load so it doesn't block dashboard shell
const DashboardCharts = dynamic(
  () => import('./DashboardCharts').then(m => ({ default: m.DashboardCharts })),
  { ssr: false, loading: () => <div className="h-[248px] rounded-xl bg-surface animate-pulse" /> }
)

interface Props {
  totalRevenue:    number
  totalOrders:     number
  pendingOrders:   number
  pendingRequests: number
  revenueChart:    { date: string; amount: number }[]
  statusChart:     { name: string; value: number }[]
  recentOrders:    { id: string; order_number: string; total_amount: number; status: string; created_at: string }[]
  recentRequests:  { id: string; name: string; phone: string; preferred_time: string; status: string; created_at: string }[]
}

export function DashboardClient(props: Props) {
  const { totalRevenue, totalOrders, pendingOrders, pendingRequests, revenueChart, statusChart, recentOrders, recentRequests } = props

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={IndianRupee} color="teal" sub="All time" />
        <StatCard title="Total Orders"   value={totalOrders}     icon={ShoppingBag}   color="deep-teal" />
        <StatCard title="Pending Orders" value={pendingOrders}   icon={Clock}         color="gold" />
        <StatCard title="Open Requests"  value={pendingRequests} icon={MessageSquare} color="sand" />
      </div>

      {/* Charts — lazily loaded (Recharts ~300KB skips initial bundle) */}
      <DashboardCharts revenueChart={revenueChart} statusChart={statusChart} />

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-divider overflow-hidden">
          <div className="px-5 py-4 border-b border-divider flex items-center justify-between">
            <h3 className="font-display text-base text-deep-teal">Recent Orders</h3>
            <a href="/orders" className="text-xs text-teal hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-divider bg-surface">
                <th className="px-5 py-2.5 text-left text-xs text-ink-faint font-medium">Order #</th>
                <th className="px-5 py-2.5 text-left text-xs text-ink-faint font-medium">Amount</th>
                <th className="px-5 py-2.5 text-left text-xs text-ink-faint font-medium">Status</th>
                <th className="px-5 py-2.5 text-left text-xs text-ink-faint font-medium">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-divider">
                {recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-teal">{o.order_number}</td>
                    <td className="px-5 py-3 font-medium">₹{o.total_amount?.toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-ink-muted text-xs">{new Date(o.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan={4} className="px-5 py-6 text-center text-ink-faint text-sm">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl border border-divider overflow-hidden">
          <div className="px-5 py-4 border-b border-divider flex items-center justify-between">
            <h3 className="font-display text-base text-deep-teal">Pending Callbacks</h3>
            <a href="/requests" className="text-xs text-teal hover:underline">View all</a>
          </div>
          <div className="divide-y divide-divider">
            {recentRequests.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{r.name}</p>
                  <p className="text-xs text-ink-muted">{r.phone} · {r.preferred_time}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {recentRequests.length === 0 && <p className="px-5 py-6 text-center text-ink-faint text-sm">No pending callbacks</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
