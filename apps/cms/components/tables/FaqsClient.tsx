'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Loader2, HelpCircle, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'

interface Faq {
  id:         string
  question:   string
  answer:     string
  sort_order: number
  is_active:  boolean
}

type EditingFaq = Partial<Faq>

export function FaqsClient({ faqs: initial }: { faqs: Faq[] }) {
  const [faqs, setFaqs]       = useState<Faq[]>(initial)
  const [editing, setEditing] = useState<EditingFaq | null>(null)
  const [saving, setSaving]   = useState(false)

  function openNew() {
    setEditing({ question: '', answer: '', sort_order: faqs.length, is_active: true })
  }

  function openEdit(f: Faq) {
    setEditing({ ...f })
  }

  async function save() {
    if (!editing) return
    if (!editing.question?.trim() || !editing.answer?.trim()) {
      toast.error('Question and Answer are required')
      return
    }
    setSaving(true)
    try {
      const isNew = !editing.id
      const res = await fetch(isNew ? '/api/faqs' : `/api/faqs/${editing.id}`, {
        method:  isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(editing),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Save failed')
      const { data } = json
      setFaqs(fs => isNew ? [...fs, data] : fs.map(f => f.id === data.id ? data : f))
      toast.success(isNew ? 'FAQ added!' : 'FAQ updated!')
      setEditing(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setFaqs(fs => fs.filter(f => f.id !== id))
      toast.success('FAQ deleted')
    } else {
      toast.error('Delete failed')
    }
  }

  async function toggleActive(faq: Faq) {
    const res = await fetch(`/api/faqs/${faq.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ is_active: !faq.is_active }),
    })
    if (res.ok) {
      setFaqs(fs => fs.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} — shown on homepage
        </p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal transition-colors"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* FAQ list */}
      {faqs.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-divider rounded-2xl">
          <HelpCircle className="w-10 h-10 text-ink-faint mx-auto mb-3" />
          <p className="text-ink-muted font-medium">No FAQs yet</p>
          <p className="text-sm text-ink-faint mt-1">Add FAQs that will appear on the homepage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="bg-white rounded-xl border border-divider p-5">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-ink-faint mt-1 shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-teal font-medium mb-1">Q{i + 1}</p>
                      <p className="font-medium text-ink text-sm leading-snug">{faq.question}</p>
                      <p className="text-sm text-ink-muted mt-2 leading-relaxed line-clamp-2">{faq.answer}</p>
                    </div>
                    <Badge variant={faq.is_active ? 'success' : 'default'}>
                      {faq.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-divider">
                    <button
                      onClick={() => openEdit(faq)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-divider text-ink-muted hover:border-teal hover:text-teal transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => toggleActive(faq)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-divider text-ink-muted hover:border-teal hover:text-teal transition-colors"
                    >
                      {faq.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => del(faq.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-divider text-ink-muted hover:border-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-divider">
              <h3 className="font-display text-lg text-deep-teal">
                {editing.id ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-surface text-ink-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-ink-muted uppercase tracking-wider font-medium">Question *</label>
                <input
                  type="text"
                  value={editing.question ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev!, question: e.target.value }))}
                  placeholder="e.g. Do you offer free shipping?"
                  className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-teal transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-ink-muted uppercase tracking-wider font-medium">Answer *</label>
                <textarea
                  value={editing.answer ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev!, answer: e.target.value }))}
                  placeholder="e.g. Yes, we offer free shipping on all orders above ₹999."
                  rows={4}
                  className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-teal transition-colors resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-ink-muted uppercase tracking-wider font-medium">Sort Order</label>
                  <input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={e => setEditing(prev => ({ ...prev!, sort_order: +e.target.value }))}
                    className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-teal transition-colors"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-5">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={editing.is_active ?? true}
                      onChange={e => setEditing(prev => ({ ...prev!, is_active: e.target.checked }))} />
                    <div className={`w-10 h-5 rounded-full transition-colors ${editing.is_active ? 'bg-teal' : 'bg-divider'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editing.is_active ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm text-ink">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-deep-teal disabled:opacity-60 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : 'Save FAQ'}
                </button>
                <button onClick={() => setEditing(null)}
                  className="px-5 py-2.5 border border-divider rounded-lg text-sm text-ink-muted hover:bg-surface transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
