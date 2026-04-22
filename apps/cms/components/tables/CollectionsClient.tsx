'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Loader2, X, Save } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  sort_order?: number
  banner_url?: string | null
  created_at: string
}

export function CollectionsClient({ collections: initial }: { collections: Collection[] }) {
  const [collections, setCollections] = useState(initial)
  const [editing, setEditing] = useState<Partial<Collection> | null>(null)
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const isNew = !editing.id
      const res = await fetch(isNew ? '/api/collections' : `/api/collections/${editing.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error('Save failed')
      const { data } = await res.json()
      setCollections(cs => isNew ? [...cs, data] : cs.map(c => c.id === data.id ? data : c))
      toast.success(isNew ? 'Collection created' : 'Collection updated')
      setEditing(null)
    } catch {
      toast.error('Failed to save collection')
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' })
    if (res.ok) { setCollections(cs => cs.filter(c => c.id !== id)); toast.success('Deleted') }
    else toast.error('Delete failed')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ is_active: true, sort_order: 0 })} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal transition-colors">
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-deep-teal">{editing.id ? 'Edit' : 'New'} Collection</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-ink-muted" /></button>
            </div>
            {[
              ['name', 'Name *', 'text'],
              ['slug', 'Slug', 'text'],
              ['description', 'Description', 'text'],
              ['banner_url', 'Banner Image URL', 'text'],
              ['sort_order', 'Sort Order', 'number'],
            ].map(([k, l, t]) => (
              <div key={k} className="space-y-1">
                <label className="text-xs text-ink-muted uppercase tracking-wider">{l}</label>
                <input
                  type={t}
                  value={(editing as Record<string, string>)[k] ?? ''}
                  onChange={e => setEditing(s => ({ ...s!, [k]: t === 'number' ? +e.target.value : e.target.value }))}
                  className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input type="checkbox" checked={editing.is_active ?? true} onChange={e => setEditing(s => ({ ...s!, is_active: e.target.checked }))} className="rounded accent-teal" />
              Active
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-divider rounded-lg text-sm text-ink-muted hover:bg-surface">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-divider overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-surface">
              <th className="px-5 py-3 text-left text-xs text-ink-faint font-medium w-14"></th>
              <th className="px-5 py-3 text-left text-xs text-ink-faint font-medium">Name</th>
              <th className="px-5 py-3 text-left text-xs text-ink-faint font-medium">Slug</th>
              <th className="px-5 py-3 text-left text-xs text-ink-faint font-medium">Status</th>
              <th className="px-5 py-3 text-left text-xs text-ink-faint font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {collections.map(c => (
              <tr key={c.id} className="hover:bg-surface/50">
                <td className="px-5 py-3">
                  {c.banner_url ? (
                    <div className="relative w-12 h-8 rounded overflow-hidden bg-surface-2">
                      <Image src={c.banner_url} alt={c.name} fill className="object-cover" sizes="48px" />
                    </div>
                  ) : <div className="w-12 h-8 rounded bg-surface-2" />}
                </td>
                <td className="px-5 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-5 py-3 text-ink-faint font-mono text-xs">{c.slug}</td>
                <td className="px-5 py-3"><Badge variant={c.is_active ? 'success' : 'default'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-5 py-3 flex items-center gap-1.5">
                  <button onClick={() => setEditing(c)} className="p-1.5 rounded hover:bg-surface text-ink-muted hover:text-teal"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => del(c.id, c.name)} className="p-1.5 rounded hover:bg-red-50 text-ink-muted hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
