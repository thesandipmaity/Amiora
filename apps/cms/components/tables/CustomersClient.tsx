'use client'

import { useState } from 'react'
import { Search, X, User } from 'lucide-react'

interface Customer {
  id: string; full_name?: string; phone?: string; email?: string; gender?: string; created_at: string
  orders?: { id: string; total_amount: number }[]
  wishlist?: { id: string }[]
}

export function CustomersClient({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return !q || c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q)
  })

  return (
    <div>
      <div className="flex items-center gap-2 bg-white border border-divider rounded-lg px-3 py-2 mb-4 max-w-sm">
        <Search className="w-3.5 h-3.5 text-ink-faint" />
        <input placeholder="Search by name, email or phone…" value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm flex-1 placeholder:text-ink-faint" />
      </div>

      <div className="bg-white rounded-xl border border-divider overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-divider bg-surface">
            {['Name','Email','Phone','Orders','Spent','Joined'].map(h => (
              <th key={h} className="px-5 py-3 text-left text-xs text-ink-faint font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-divider">
            {filtered.map(c => {
              const spent = c.orders?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0
              return (
                <tr key={c.id} className="hover:bg-surface/50 cursor-pointer" onClick={() => setSelected(c)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal/10 flex items-center justify-center text-teal text-xs font-medium">
                        {c.full_name?.charAt(0) ?? <User className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-medium text-ink">{c.full_name ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">{c.email ?? '—'}</td>
                  <td className="px-5 py-3 text-ink-muted">{c.phone ?? '—'}</td>
                  <td className="px-5 py-3">{c.orders?.length ?? 0}</td>
                  <td className="px-5 py-3 font-medium">₹{spent.toLocaleString()}</td>
                  <td className="px-5 py-3 text-ink-muted text-xs">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-ink-faint">No customers found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-deep-teal">{selected.full_name ?? 'Customer'}</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-ink-muted" /></button>
            </div>
            <div className="space-y-2 text-sm text-ink-muted">
              <p><span className="text-ink font-medium">Email:</span> {selected.email ?? '—'}</p>
              <p><span className="text-ink font-medium">Phone:</span> {selected.phone ?? '—'}</p>
              <p><span className="text-ink font-medium">Gender:</span> {selected.gender ?? '—'}</p>
              <p><span className="text-ink font-medium">Joined:</span> {new Date(selected.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Orders', value: selected.orders?.length ?? 0 },
                { label: 'Total Spent', value: `₹${(selected.orders?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0).toLocaleString()}` },
                { label: 'Wishlist', value: selected.wishlist?.length ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface rounded-xl p-3 text-center">
                  <p className="font-display text-lg text-deep-teal">{value}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
