import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link         from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { WishlistGrid } from '@/components/account/WishlistGrid'

export const metadata: Metadata = { title: 'My Wishlist' }

export default async function WishlistPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('*, product:products(id,name,slug,making_charge_pct,product_images(*),product_variants(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const products = (wishlists ?? []).map((w) => w.product).filter(Boolean) as Parameters<typeof WishlistGrid>[0]['products']

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-xl text-ink">My Wishlist</h1>
        <p className="text-sm text-ink-muted">{products.length} items</p>
      </div>
      {products.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <p className="font-display text-xl text-ink-muted">Your wishlist is empty</p>
          <p className="text-sm text-ink-faint">Save items you love and come back later.</p>
          <Link href="/shop" className="inline-block bg-deep-teal text-cream px-8 py-3 text-sm uppercase tracking-widest rounded-xl hover:bg-teal transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <WishlistGrid products={products} />
      )}
    </div>
  )
}
