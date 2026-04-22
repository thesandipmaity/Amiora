'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'

interface Testimonial {
  id: string; name: string; location?: string; quote: string; rating: number
  is_featured: boolean; avatar_url?: string; sort_order?: number
}

export function TestimonialsClient({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initial)
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const isNew = !editing.id
      const res = await fetch(isNew ? '/api/testimonials' : `/api/testimonials/${editing.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setTestimonials(ts => isNew ? [...ts, data] : ts.map(t => t.id === data.id ? data : t))
      toast.success(isNew ? 'Added' : 'Updated')
      setEditing(null)
    } catch { toast.error('Save failed') } finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    if (res.ok) { setTestimonials(ts => ts.filter(t => t.id !== id)); toast.success('Deleted') }
    else toast.error('Delete failed')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ rating: 5, is_featured: false })} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal transition-colors">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-divider p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-ink">{t.name}</p>
                {t.location && <p className="text-xs text-ink-muted">{t.location}</p>}
              </div>
              <div className="flex items-center gap-1">
                {t.is_featured && <Badge variant="info">Featured</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-gold text-gold' : 'text-divider'}`} />
              ))}
            </div>
            <p className="text-sm text-ink-muted italic line-clamp-3">"{t.quote}"</p>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => setEditing(t)} className="p-1.5 rounded hover:bg-surface text-ink-muted hover:text-teal transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => del(t.id)} className="p-1.5 rounded hover:bg-red-50 text-ink-muted hover:text-red-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-deep-teal">{editing.id ? 'Edit' : 'Add'} Testimonial</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-ink-muted" /></button>
            </div>
            {[
              ['name', 'Name *', 'text'],
              ['location', 'Location', 'text'],
              ['avatar_url', 'Avatar URL', 'text'],
            ].map(([k, l, t]) => (
              <div key={k} className="space-y-1">
                <label className="text-xs text-ink-muted uppercase tracking-wider">{l}</label>
                <input type={t} value={(editing as Record<string, string>)[k] ?? ''}
                  onChange={e => setEditing(s => ({ ...s!, [k]: e.target.value }))}
                  className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-xs text-ink-muted uppercase tracking-wider">Quote *</label>
              <textarea rows={3} value={editing.quote ?? ''}
                onChange={e => setEditing(s => ({ ...s!, quote: e.target.value }))}
                className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-ink-muted uppercase tracking-wider">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setEditing(s => ({ ...s!, rating: n }))}>
                    <Star className={`w-6 h-6 transition-colors ${n <= (editing.rating ?? 5) ? 'fill-gold text-gold' : 'text-divider'}`} />
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input type="checkbox" checked={editing.is_featured ?? false} onChange={e => setEditing(s => ({ ...s!, is_featured: e.target.checked }))} className="rounded accent-teal" />
              Featured on homepage
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-divider rounded-lg text-sm text-ink-muted hover:bg-surface">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
