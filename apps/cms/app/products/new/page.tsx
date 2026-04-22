import { createServerClient } from '@amiora/database'
import { ProductForm } from '@/components/forms/ProductForm'

export default async function NewProductPage() {
  const supabase = createServerClient()

  const [{ data: collections }, { data: categories }, { data: tags }] = await Promise.all([
    supabase
      .from('collections')
      .select('id, name, parent_id, menu_type')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('categories')
      .select('id, name, parent_id')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('tags')
      .select('id, name, slug, color')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-deep-teal">Add New Product</h2>
        <p className="text-sm text-ink-muted mt-0.5">Create a new product listing</p>
      </div>
      <ProductForm
        collections={collections ?? []}
        categories={categories  ?? []}
        tags={tags              ?? []}
      />
    </div>
  )
}
