import { createServerClient } from '@amiora/database'
import { ReviewsClient } from '@/components/tables/ReviewsClient'

export default async function ReviewsPage() {
  const supabase = createServerClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id, rating, title, body, is_verified, status, created_at,
      product:products(name, slug),
      user:user_profiles(full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-deep-teal">Reviews Moderation</h2>
      <ReviewsClient reviews={(reviews ?? []) as unknown as Parameters<typeof ReviewsClient>[0]['reviews']} />
    </div>
  )
}
