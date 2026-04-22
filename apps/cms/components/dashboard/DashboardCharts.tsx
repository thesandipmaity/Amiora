'use client'

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  pending:    '#C9A84C',
  confirmed:  '#548C92',
  processing: '#285260',
  shipped:    '#AB9072',
  delivered:  '#3D7A47',
  cancelled:  '#B03A2E',
}

interface ChartsProps {
  revenueChart: { date: string; amount: number }[]
  statusChart:  { name: string; value: number }[]
}

export function DashboardCharts({ revenueChart, statusChart }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Revenue Trend */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-divider p-5">
        <h3 className="font-display text-base text-deep-teal mb-4">Revenue — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueChart} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E3" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A8A29C' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#A8A29C' }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v > 999 ? (v/1000).toFixed(0)+'K' : v}`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
            <Line type="monotone" dataKey="amount" stroke="#548C92" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders by Status */}
      <div className="bg-white rounded-xl border border-divider p-5">
        <h3 className="font-display text-base text-deep-teal mb-4">Orders by Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusChart} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
              {statusChart.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.name] ?? '#E0D7CF'} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(v) => <span className="text-xs text-ink-muted capitalize">{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
