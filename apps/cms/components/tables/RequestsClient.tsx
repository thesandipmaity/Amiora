'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/ui/Badge'
import { Phone, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  customizations: { id: string; description?: string; contact_preference?: string; contact_value?: string; status: string; created_at: string }[]
  callbacks:      { id: string; name: string; phone: string; preferred_time?: string; status: string; created_at: string }[]
  demos:          { id: string; type?: string; preferred_date?: string; preferred_time?: string; notes?: string; status: string; created_at: string; store_id?: string }[]
}

type Tab = 'customizations' | 'callbacks' | 'demos'

export function RequestsClient({ customizations, callbacks, demos }: Props) {
  const [tab, setTab] = useState<Tab>('callbacks')
  const [updating, setUpdating] = useState<string | null>(null)

  async function markStatus(table: string, id: string, status: string) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/requests/${table}/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success('Status updated')
      window.location.reload()
    } catch { toast.error('Failed to update') } finally { setUpdating(null) }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'callbacks',      label: 'Callbacks',      count: callbacks.filter(c => c.status === 'pending').length },
    { key: 'customizations', label: 'Customizations', count: customizations.filter(c => c.status === 'pending').length },
    { key: 'demos',          label: 'Demo Requests',  count: demos.filter(d => d.status === 'pending').length },
  ]

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-surface p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tab === t.key ? 'bg-white text-teal shadow-sm font-medium' : 'text-ink-muted hover:text-ink'}`}>
            {t.label}
            {t.count > 0 && <span className="bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Callbacks */}
      {tab === 'callbacks' && (
        <div className="bg-white rounded-xl border border-divider divide-y divide-divider">
          {callbacks.length === 0 && <p className="p-6 text-center text-ink-faint">No callback requests</p>}
          {callbacks.map(cb => (
            <div key={cb.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{cb.name}</p>
                <p className="text-sm text-ink-muted flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5" /> {cb.phone}
                  {cb.preferred_time && <span className="text-ink-faint">· {cb.preferred_time}</span>}
                </p>
                <p className="text-xs text-ink-faint mt-0.5">{new Date(cb.created_at).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={cb.status} />
                {cb.status !== 'called' && (
                  <button onClick={() => markStatus('callback-requests', cb.id, 'called')} disabled={updating === cb.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs hover:bg-green-100 transition-colors disabled:opacity-60">
                    {updating === cb.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Mark Called
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customizations */}
      {tab === 'customizations' && (
        <div className="space-y-3">
          {customizations.length === 0 && <p className="bg-white rounded-xl border border-divider p-6 text-center text-ink-faint">No customization requests</p>}
          {customizations.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-divider p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-ink leading-relaxed">{c.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink-muted">
                    <span>Contact via: <strong className="text-ink capitalize">{c.contact_preference}</strong></span>
                    {c.contact_value && <span>· {c.contact_value}</span>}
                    <span>· {new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  {c.status === 'pending' && (
                    <select onChange={e => markStatus('customization-requests', c.id, e.target.value)} defaultValue="" className="border border-divider rounded-lg px-2 py-1 text-xs outline-none focus:border-teal">
                      <option value="" disabled>Update…</option>
                      {['in_review','quoted','completed','cancelled'].map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Demos */}
      {tab === 'demos' && (
        <div className="bg-white rounded-xl border border-divider divide-y divide-divider">
          {demos.length === 0 && <p className="p-6 text-center text-ink-faint">No demo requests</p>}
          {demos.map(d => (
            <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink capitalize">{d.type === 'home_visit' ? '🏠 Home Visit' : '🏬 Store Visit'}</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {d.preferred_date} {d.preferred_time && `at ${d.preferred_time}`}
                </p>
                {d.notes && <p className="text-xs text-ink-faint mt-1 italic">"{d.notes}"</p>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={d.status} />
                {d.status === 'pending' && (
                  <select onChange={e => markStatus('demo-requests', d.id, e.target.value)} defaultValue="" className="border border-divider rounded-lg px-2 py-1 text-xs outline-none focus:border-teal">
                    <option value="" disabled>Update…</option>
                    {['confirmed','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
