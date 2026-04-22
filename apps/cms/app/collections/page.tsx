import { createServerClient } from '@amiora/database'
import { TaxonomyClient }     from '@/components/tables/TaxonomyClient'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
  const supabase = createServerClient()

  const [collectionsRes, tagsRes, categoriesRes] = await Promise.all([
    supabase
      .from('collections')
      .select('id, name, slug, description, banner_url, parent_id, menu_type, is_active, sort_order, created_at')
      .order('sort_order'),
    supabase
      .from('tags')
      .select('id, name, slug, color, sort_order, is_active, created_at')
      .order('sort_order'),
    supabase
      .from('categories')
      .select('id, name, slug, description, image_url, parent_id, is_active, sort_order, created_at')
      .order('sort_order'),
  ])

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-deep-teal">Taxonomy Manager</h2>
      <TaxonomyClient
        collections={collectionsRes.data ?? []}
        tags={tagsRes.data        ?? []}
        categories={categoriesRes.data ?? []}
      />
    </div>
  )
}
