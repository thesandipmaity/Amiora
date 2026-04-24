'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Save, X, MapPin, Phone, Clock, Loader2, ImagePlus, Link as LinkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'

type Timings = Record<string, string>

interface Store {
  id: string
  name: string
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  phone?: string | null
  email?: string | null
  is_active: boolean
  timings?: Timings | string | null
  lat?: number | null
  lng?: number | null
  image_url?: string | null
}

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DEFAULT_TIMING = '10:00 AM - 8:00 PM'

function emptyTimings(): Timings {
  return DAYS.reduce((a, d) => ({ ...a, [d]: DEFAULT_TIMING }), {} as Timings)
}

function normalizeTimings(raw: Timings | string | null | undefined): Timings {
  if (!raw) return emptyTimings()
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return emptyTimings() }
  }
  return raw
}

export function StoresCRUD({ stores: initial }: { stores: Store[] }) {
  const [stores, setStores]     = useState<Store[]>(initial)
  const [editing, setEditing]   = useState<Partial<Store> | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlMode, setUrlMode]   = useState(false)
  const fileInputRef            = useRef<HTMLInputElement>(null)

  async function uploadImage(file: File) {
    setUploading(true)
    try {
      // Get signed upload params
      const sigRes = await fetch('/api/upload?folder=amiora/stores')
      const { signature, timestamp, folder, cloud_name, api_key } = await sigRes.json()
      const form = new FormData()
      form.append('file', file)
      form.append('signature', signature)
      form.append('timestamp', String(timestamp))
      form.append('folder', folder)
      form.append('api_key', api_key)
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: form })
      const upJson = await upRes.json()
      if (!upRes.ok) throw new Error(upJson.error?.message ?? 'Upload failed')
      setEditing(prev => ({ ...prev!, image_url: upJson.secure_url }))
      toast.success('Image uploaded!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function openNew() {
    setEditing({ is_active: true, timings: emptyTimings() })
  }

  function openEdit(s: Store) {
    setEditing({ ...s, timings: normalizeTimings(s.timings) })
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const isNew = !editing.id
      const res = await fetch(isNew ? '/api/stores' : `/api/stores/${editing.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Save failed')
      const { data } = json
      setStores(ss => isNew ? [...ss, data] : ss.map(s => s.id === data.id ? data : s))
      toast.success(isNew ? 'Store added!' : 'Store updated!')
      setEditing(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this store?')) return
    const res = await fetch(`/api/stores/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setStores(ss => ss.filter(s => s.id !== id))
      toast.success('Store deleted')
    } else {
      toast.error('Delete failed')
    }
  }

  const editingTimings = normalizeTimings((editing?.timings) as Timings | null | undefined)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Store
        </button>
      </div>

      {/* Store Cards */}
      {stores.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-divider rounded-2xl">
          <MapPin className="w-10 h-10 text-ink-faint mx-auto mb-3" />
          <p className="text-ink-muted font-medium">No stores yet</p>
          <p className="text-sm text-ink-faint mt-1">Click &ldquo;Add Store&rdquo; to add your first store.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map(s => {
            const timings = normalizeTimings(s.timings)
            const today   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]
            const todayHours = timings[today] ?? null
            return (
              <div key={s.id} className="bg-white rounded-xl border border-divider overflow-hidden">
                {/* Store image thumbnail */}
                {s.image_url ? (
                  <div className="relative h-36 w-full bg-surface">
                    <Image src={s.image_url} alt={s.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                ) : (
                  <div className="h-24 w-full bg-gradient-to-br from-light-teal/20 to-cream flex items-center justify-center">
                    <ImagePlus className="w-6 h-6 text-ink-faint" />
                  </div>
                )}

                <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-deep-teal/10 rounded-lg shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-deep-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      {(s.city || s.state) && (
                        <p className="text-sm text-ink-muted mt-0.5">{[s.city, s.state].filter(Boolean).join(', ')}{s.pincode ? ` — ${s.pincode}` : ''}</p>
                      )}
                      {s.address && <p className="text-xs text-ink-faint mt-0.5">{s.address}</p>}
                    </div>
                  </div>
                  <Badge variant={s.is_active ? 'success' : 'default'}>{s.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>

                <div className="space-y-1 text-xs text-ink-muted pl-11">
                  {s.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-teal" />
                      <span>{s.phone}</span>
                    </div>
                  )}
                  {todayHours && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-teal" />
                      <span>Today: {todayHours}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-divider">
                  <button
                    onClick={() => openEdit(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-divider text-ink-muted hover:border-teal hover:text-teal transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => del(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-divider text-ink-muted hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Edit / Add Modal ──────────────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 pt-5 pb-4 border-b border-divider">
              <h3 className="font-display text-lg text-deep-teal">
                {editing.id ? 'Edit Store' : 'Add Store'}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-surface text-ink-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['name',    'Store Name *',  'col-span-2', 'text'],
                  ['address', 'Address',       'col-span-2', 'text'],
                  ['city',    'City *',        'col-span-1', 'text'],
                  ['state',   'State *',       'col-span-1', 'text'],
                  ['pincode', 'Pincode',       'col-span-1', 'text'],
                  ['phone',   'Phone',         'col-span-1', 'text'],
                  ['email',   'Email',         'col-span-2', 'text'],
                  ['lat',     'Latitude',      'col-span-1', 'number'],
                  ['lng',     'Longitude',     'col-span-1', 'number'],
                ] as [string, string, string, string][]).map(([k, label, span, type]) => (
                  <div key={k} className={`space-y-1 ${span}`}>
                    <label className="block text-xs text-ink-muted uppercase tracking-wider font-medium">{label}</label>
                    <input
                      type={type}
                      step={type === 'number' ? 'any' : undefined}
                      value={(editing as Record<string, string | number | boolean>)[k] as string ?? ''}
                      onChange={e => setEditing(prev => ({
                        ...prev!,
                        [k]: type === 'number' ? (e.target.value === '' ? '' : +e.target.value) : e.target.value,
                      }))}
                      className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-teal transition-colors"
                      placeholder={label.replace(' *', '')}
                    />
                  </div>
                ))}
              </div>

              {/* Store Image */}
              <div className="space-y-2">
                <p className="text-xs text-ink-muted uppercase tracking-wider font-medium">Store Image</p>

                {/* Preview */}
                {editing.image_url && (
                  <div className="relative h-40 rounded-xl overflow-hidden bg-surface border border-divider group">
                    <Image src={editing.image_url} alt="Store preview" fill className="object-cover" sizes="500px" />
                    <button
                      type="button"
                      onClick={() => setEditing(prev => ({ ...prev!, image_url: null }))}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Upload / URL toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setUrlMode(false); fileInputRef.current?.click() }}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 border border-divider rounded-lg text-xs text-ink-muted hover:border-teal hover:text-teal transition-colors disabled:opacity-60"
                  >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                    {uploading ? 'Uploading…' : 'Upload Photo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlMode(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 border border-divider rounded-lg text-xs text-ink-muted hover:border-teal hover:text-teal transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Paste URL
                  </button>
                </div>

                {/* URL input */}
                {urlMode && (
                  <input
                    type="url"
                    value={editing.image_url ?? ''}
                    onChange={e => setEditing(prev => ({ ...prev!, image_url: e.target.value || null }))}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-teal transition-colors"
                  />
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }}
                />
              </div>

              {/* Timings */}
              <div className="space-y-2">
                <p className="text-xs text-ink-muted uppercase tracking-wider font-medium">Opening Hours</p>
                <div className="border border-divider rounded-xl overflow-hidden divide-y divide-divider">
                  {DAYS.map(day => (
                    <div key={day} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-xs text-ink-muted w-24 shrink-0 font-medium">{day}</span>
                      <input
                        value={editingTimings[day] ?? ''}
                        onChange={e => setEditing(prev => ({
                          ...prev!,
                          timings: { ...editingTimings, [day]: e.target.value },
                        }))}
                        className="flex-1 border border-divider rounded-lg px-3 py-1.5 text-xs text-ink outline-none focus:border-teal transition-colors"
                        placeholder="10:00 AM - 8:00 PM or Closed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={editing.is_active ?? true}
                    onChange={e => setEditing(prev => ({ ...prev!, is_active: e.target.checked }))}
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${editing.is_active ? 'bg-teal' : 'bg-divider'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editing.is_active ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm text-ink">Store Active</span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-deep-teal disabled:opacity-60 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : 'Save Store'}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-5 py-2.5 border border-divider rounded-lg text-sm text-ink-muted hover:bg-surface transition-colors"
                >
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
