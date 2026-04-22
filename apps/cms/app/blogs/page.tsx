import { createServerClient } from '@amiora/database'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { BlogsListClient } from '@/components/tables/BlogsListClient'

export default async function BlogsPage() {
  const supabase = createServerClient()
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, is_published, published_at, created_at, author, cover_url')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-deep-teal">Blogs</h2>
        <Link href="/blogs/new" className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-deep-teal transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>
      <BlogsListClient blogs={blogs ?? []} />
    </div>
  )
}
