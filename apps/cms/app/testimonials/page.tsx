import { createServerClient } from '@amiora/database'
import { TestimonialsClient } from '@/components/tables/TestimonialsClient'

export default async function TestimonialsPage() {
  const supabase = createServerClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, name, location, quote, rating, is_featured, avatar_url, sort_order')
    .order('sort_order')

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-deep-teal">Testimonials</h2>
      <TestimonialsClient testimonials={testimonials ?? []} />
    </div>
  )
}
