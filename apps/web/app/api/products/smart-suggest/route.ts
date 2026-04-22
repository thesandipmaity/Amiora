import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'
import { calculateVariantPrice } from '@/lib/pricing/calculator'
import { getLatestPrices }       from '@/lib/pricing/engine'

export async function POST(req: NextRequest) {
  try {
    const { product_ids } = (await req.json()) as { product_ids: string[] }

    const supabase = createServerClient()
    const prices   = await getLatestPrices()

    // Get smart pairs
    const { data: pairs } = await supabase
      .from('smart_pairs')
      .select('paired_product_id')
      .in('product_id', product_ids)
      .limit(8)

    const pairedIds = pairs?.map((p) => p.paired_product_id) ?? []

    // Fetch those products, exclude already in cart
    const ids = pairedIds.filter((id) => !product_ids.includes(id))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let products: any[] = []
    if (ids.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('id,name,slug,making_charge_pct,product_images(*),product_variants(*)')
        .in('id', ids.slice(0, 4))
        .eq('is_active', true)
      products = data ?? []
    }

    // Fallback: fetch related products from same collections
    if (products.length < 4) {
      const { data: featured } = await supabase
        .from('products')
        .select('id,name,slug,making_charge_pct,product_images(*),product_variants(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .not('id', 'in', `(${product_ids.join(',')})`)
        .limit(4 - products.length)
      products = [...products, ...(featured ?? [])]
    }

    const withPrices = products.map((p) => {
      const v = (p.product_variants as { purity: string; weight_grams: number | null; gem_price_override: number | null }[])?.[0]
      const basePrice = v?.weight_grams
        ? calculateVariantPrice({
            weightGrams: v.weight_grams, purity: v.purity,
            livePricePerGram999: v.purity === '92.5' ? (prices.silver?.pricePerGram ?? 90) : (prices.gold?.pricePerGram ?? 7200),
            makingChargePct: p.making_charge_pct, gemPriceOverride: v.gem_price_override,
          }).finalPrice
        : 0
      return { ...p, basePrice }
    })

    return NextResponse.json({ products: withPrices })
  } catch {
    return NextResponse.json({ products: [] })
  }
}
