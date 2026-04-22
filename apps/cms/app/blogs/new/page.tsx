import { BlogEditorForm } from '@/components/forms/BlogEditorForm'

export default function NewBlogPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-deep-teal">New Blog Post</h2>
        <p className="text-sm text-ink-muted mt-0.5">Create and publish a new article</p>
      </div>
      <BlogEditorForm />
    </div>
  )
}
