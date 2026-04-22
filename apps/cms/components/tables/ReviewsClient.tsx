'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Star, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { toast } from 'sonner'

interface Review {
  id: string; rating: number; title?: string; body?: string
  is_verified?: boolean; status: string; created_at: string
  product?: { name: string; slug: string } | null
  user?:    { full_name?: string } | null
}

export function ReviewsClient({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('pending')

  const filtered = reviews.filter(r => !filterStatus || r.status === filterStatus)

  async function moderate(id: string, status: 'approved' | 'rejected') {
    setUpdating(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setReviews(rs => rs.map(r => r.id === id ? { ...r, status } : r))
      toast.success(status === 'approved' ? 'Review approved' : 'Review rejected')
    } catch { toast.error('Failed to update') } finally { setUpdating(null) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filterStatus === s ? 'bg-teal text-white' : 'bg-white border border-divider text-ink-muted hover:bg-surface'}`}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s && <span className="ml-1.5 text-xs opacity-70">({reviews.filter(r => r.status === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-divider overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-divider bg-surface">
            {['Product','Customer','Rating','Review','Date','Status','Actions'].map(h => (
              <th key={h} className="px-5 py-3 text-left text-xs text-ink-faint font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-divider">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-surface/50">
                <td className="px-5 py-3 text-sm text-teal font-medium">{r.product?.name ?? '—'}</td>
                <td className="px-5 py-3 text-ink-muted">{r.user?.full_name ?? 'Anonymous'}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-divider'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 max-w-xs">
                  {r.title && <p className="font-medium text-ink text-xs">{r.title}</p>}
                  <p className="text-ink-muted text-xs line-clamp-2">{r.body}</p>
                </td>
                <td className="px-5 py-3 text-ink-muted text-xs">{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-3">
                  {r.status === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => moderate(r.id, 'approved')} disabled={updating === r.id}
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-60 transition-colors">
                        {updating === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => moderate(r.id, 'rejected')} disabled={updating === r.id}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60 transition-colors">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-ink-faint">No reviews found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
