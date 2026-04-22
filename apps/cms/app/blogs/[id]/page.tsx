import { createServerClient } from '@amiora/database'
import { BlogEditorForm } from '@/components/forms/BlogEditorForm'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ id: string }> }

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()
  const { data: blog } = await supabase.from('blogs').select('*').eq('id', id).single()
  if (!blog) notFound()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-deep-teal">Edit Blog Post</h2>
        <p className="text-sm text-ink-muted mt-0.5">{blog.title}</p>
      </div>
      <BlogEditorForm defaultValues={{
        ...blog,
        id,
        body: blog.body ?? '',
        cover_image_url: blog.cover_url ?? '',
        status: blog.is_published ? 'published' : 'draft',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags ?? ''),
      }} />
    </div>
  )
}
