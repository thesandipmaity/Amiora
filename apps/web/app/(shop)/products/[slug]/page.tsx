import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@amiora/database'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'
import { ProductCard }         from '@/components/product/ProductCard'
import { ReviewsSection }      from '@/components/product/ReviewsSection'
import { calculateVariantPrice } from '@/lib/pricing/calculator'
import { getLatestPrices }       from '@/lib/pricing/engine'

interface Props { params: Promise<{ slug: string }> }

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amioradiamonds.in'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase  = createServerClient()
    const { data }  = await supabase
      .from('products')
      .select('name, short_description, product_images(url, is_primary)')
      .eq('slug', slug)
      .single()
    if (!data) return {}
    const imgs = (data.product_images ?? []) as { url: string; is_primary: boolean }[]
    const primaryImage = imgs.find(i => i.is_primary)?.url ?? imgs[0]?.url
    const title       = `${data.name} — AMIORA Jewellery`
    const description = data.short_description ?? `Explore ${data.name} — crafted in gold, silver & diamonds by AMIORA.`
    return {
      title, description,
      openGraph: { title, description, url: `${BASE}/products/${slug}`, images: primaryImage ? [{ url: primaryImage }] : [], type: 'website' },
      twitter:   { card: 'summary_large_image', title, description, images: primaryImage ? [primaryImage] : [] },
      alternates: { canonical: `${BASE}/products/${slug}` },
    }
  } catch {
    return {}
  }
}

// ISR: cache product pages for 60s, regenerate in background on next request
export const revalidate    = 60
export const dynamicParams = true   // on-demand ISR for slugs not pre-built

export default async function ProductPage({ params }: Props) {
  const { slug }  = await params
  const supabase  = createServerClient()

  // ── Round 1: Product + live prices run IN PARALLEL ─────────────────────────
  const [{ data: product, error: productError }, prices] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id, name, slug, short_description, description, making_charge_pct,
        collection:collections(id, name, slug),
        category:categories(id, name, slug),
        product_images(*),
        product_variants(
          id, purity, weight_grams, gem_weight_ct, gem_price_override, stock_status, is_active,
          metal_variant:metal_variants(variant_name),
          gem_variant:gem_variants(cut_name),
          sizes:product_sizes(*)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single(),
    getLatestPrices().catch(() => ({ gold: null, silver: null })),
  ])

  if (productError) {
    console.error('[ProductPage] query error:', productError.message, '| slug:', slug)
  }
  if (!product) notFound()

  // ── Round 2: Reviews + smart-pairs run IN PARALLEL (need product.id) ───────
  type SmartPairRow = { paired_product_id: string }
  type ReviewRow    = { id: string; reviewer_name: string | null; rating: number; title: string | null; body: string | null; created_at: string; is_verified_purchase: boolean }

  const [reviewsRes, smartPairsRes] = await Promise.all([
    Promise.resolve(
      supabase
        .from('reviews')
        .select('id, reviewer_name, rating, title, body, created_at, is_verified_purchase')
        .eq('product_id', product.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
    ).then(r => (r.data ?? []) as ReviewRow[]).catch(() => [] as ReviewRow[]),

    Promise.resolve(
      supabase
        .from('smart_pairs')
        .select('paired_product_id')
        .eq('product_id', product.id)
        .limit(6)
    ).then(r => ((r.data ?? []) as SmartPairRow[]).map(x => x.paired_product_id).filter(Boolean))
     .catch(() => [] as string[]),
  ])

  const reviews             = reviewsRes
  const smartPairProductIds = smartPairsRes

  // ── Round 3: Paired products (conditional, smart-pair IDs known) ────────────
  type PairedProduct = { id: string; name: string; slug: string; making_charge_pct: number; product_images: { url: string; is_primary: boolean }[]; product_variants: { purity: string; weight_grams: number | null; gem_price_override: number | null }[] }
  let pairedProducts: PairedProduct[] = []
  if (smartPairProductIds.length) {
    pairedProducts = await Promise.resolve(
      supabase
        .from('products')
        .select('id, name, slug, making_charge_pct, product_images(*), product_variants(purity, weight_grams, gem_price_override)')
        .in('id', smartPairProductIds)
        .eq('is_active', true)
    ).then(r => (r.data ?? []) as PairedProduct[]).catch(() => [])
  }

  const goldPrice   = (prices as { gold?: { pricePerGram: number } | null }).gold?.pricePerGram   ?? 7200
  const silverPrice = (prices as { silver?: { pricePerGram: number } | null }).silver?.pricePerGram ?? 90

  // ── Smart pairs with prices ───────────────────────────────────────────────
  const smartPairs = pairedProducts.map(p => {
    const v = p.product_variants?.[0]
    const basePrice = v?.weight_grams
      ? calculateVariantPrice({
          weightGrams:         v.weight_grams,
          purity:              v.purity,
          livePricePerGram999: v.purity === '92.5' ? silverPrice : goldPrice,
          makingChargePct:     p.making_charge_pct,
          gemPriceOverride:    v.gem_price_override,
        }).finalPrice
      : 0
    return { ...p, basePrice }
  }) as Parameters<typeof ProductCard>[0]['product'][]

  // ── Review stats ──────────────────────────────────────────────────────────
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  // ── JSON-LD ───────────────────────────────────────────────────────────────
  const imgs       = (product.product_images ?? []) as { url: string; is_primary: boolean }[]
  const primaryImg = imgs.find(i => i.is_primary)?.url ?? imgs[0]?.url
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:        product.name,
    description: product.short_description ?? '',
    image:       primaryImg ?? '',
    url:         `${BASE}/products/${slug}`,
    brand:       { '@type': 'Brand', name: 'AMIORA' },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type':      'AggregateRating',
        ratingValue:  avgRating.toFixed(1),
        reviewCount:  reviews.length,
        bestRating:   5,
        worstRating:  1,
      },
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ProductDetailClient
        product={{
          id:                product.id,
          name:              product.name,
          short_description: product.short_description,
          making_charge_pct: product.making_charge_pct,
          avgRating,
          reviewCount:    reviews.length,
          collectionName: (product.collection as unknown as { name: string } | null)?.name ?? null,
          collectionSlug: (product.collection as unknown as { slug: string } | null)?.slug ?? null,
          categoryName:   (product.category   as unknown as { name: string } | null)?.name ?? null,
        }}
        variants={product.product_variants ?? []}
        images={imgs}
      />

      {smartPairs.length > 0 && (
        <section className="section-x pb-14">
          <h2 className="font-display text-display-xl text-ink mb-8">Complete the Look</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
            {smartPairs.map((p) => (
              <div key={p.id} className="w-56 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <ReviewsSection
        reviews={reviews}
        total={reviews.length}
        avgRating={avgRating}
      />
    </>
  )
}
