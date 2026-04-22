'use client'

import { useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ImagePlus, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload'

// TipTap (ProseMirror) is ~500KB — lazy load so blog-list page stays fast
const TipTapEditor = dynamic(
  () => import('@/components/editor/TipTapEditor').then(m => ({ default: m.TipTapEditor })),
  { ssr: false, loading: () => <div className="h-40 rounded-lg border border-divider bg-surface animate-pulse" /> }
)
import { toast } from 'sonner'

const schema = z.object({
  title:           z.string().min(1, 'Title required'),
  slug:            z.string().min(1),
  excerpt:         z.string().optional(),
  body:            z.string().optional(),
  cover_url:       z.string().optional().or(z.literal('')),
  tags:            z.string().optional(),
  author:          z.string().optional(),
  status:          z.enum(['draft', 'published']).default('draft'),
  published_at:    z.string().optional(),
  meta_title:      z.string().optional(),
  meta_description:z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface Props { defaultValues?: Partial<FormData> & { id?: string } }

export function BlogEditorForm({ defaultValues }: Props) {
  const router   = useRouter()
  const coverRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const { uploading: uploadingCover, uploadFile } = useCloudinaryUpload('amiora/blogs')
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft', ...defaultValues },
  })

  function genSlug(v: string) {
    setValue('slug', v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await uploadFile(file)
    if (result) {
      setValue('cover_url', result.url)
      toast.success('Cover image uploaded!')
    }
    if (coverRef.current) coverRef.current.value = ''
  }

  const onSubmit = useCallback(async (data: FormData) => {
    setSaving(true)
    try {
      const isEdit = !!defaultValues?.id
      const res = await fetch(isEdit ? `/api/blogs/${defaultValues!.id}` : '/api/blogs', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          published_at: data.status === 'published' && !data.published_at ? new Date().toISOString() : data.published_at,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success(isEdit ? 'Blog updated' : 'Blog created')
      router.push('/blogs')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }, [defaultValues, router])

  const status = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-4xl">
      {/* Basics */}
      <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
        <h3 className="font-display text-base text-deep-teal border-b border-divider pb-2">Post Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Title *</label>
            <input {...register('title')} onBlur={e => genSlug(e.target.value)}
              className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
              placeholder="e.g. The Art of Choosing Your Perfect Diamond" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Slug *</label>
            <input {...register('slug')} className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Author</label>
            <input {...register('author')} className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" placeholder="AMIORA Team" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Cover Image</label>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            {watch('cover_url') ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-divider bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={watch('cover_url')} alt="Cover" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setValue('cover_url', '')}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverRef.current?.click()} disabled={uploadingCover}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-divider rounded-xl py-8 text-sm text-ink-muted hover:border-teal hover:text-teal transition-colors disabled:opacity-50">
                {uploadingCover
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  : <><ImagePlus className="w-4 h-4" /> Click to upload cover image</>}
              </button>
            )}
            <input {...register('cover_url')} type="hidden" />
            <input
              placeholder="Or paste image URL…"
              className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal mt-2"
              onChange={e => setValue('cover_url', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Tags (comma separated)</label>
            <input {...register('tags')} className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" placeholder="diamond, guide, care" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-ink-muted uppercase tracking-wider">Excerpt</label>
          <textarea {...register('excerpt')} rows={2} className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal resize-none" placeholder="Short summary shown in blog listing…" />
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-xl border border-divider p-5 space-y-3">
        <h3 className="font-display text-base text-deep-teal border-b border-divider pb-2">Content</h3>
        <TipTapEditor
          value={watch('body') ?? ''}
          onChange={v => setValue('body', v)}
          placeholder="Start writing your blog post…"
        />
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
        <h3 className="font-display text-base text-deep-teal border-b border-divider pb-2">SEO</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Meta Title</label>
            <input {...register('meta_title')} className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-ink-muted uppercase tracking-wider">Meta Description</label>
            <textarea {...register('meta_description')} rows={2} className="w-full border border-divider rounded-lg px-3 py-2 text-sm outline-none focus:border-teal resize-none" />
          </div>
        </div>
      </div>

      {/* Publish Controls */}
      <div className="bg-white rounded-xl border border-divider p-5 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-ink font-medium">Status:</label>
          <select {...register('status')} className="border border-divider rounded-lg px-3 py-1.5 text-sm outline-none focus:border-teal">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        {status === 'published' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-ink-muted">Publish Date:</label>
            <input type="datetime-local" {...register('published_at')} className="border border-divider rounded-lg px-3 py-1.5 text-sm outline-none focus:border-teal" />
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-divider rounded-lg text-sm text-ink-muted hover:bg-surface">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === 'published' ? 'Publish' : 'Save Draft'}
          </button>
        </div>
      </div>
    </form>
  )
}
