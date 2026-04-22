import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * Called when an order is confirmed to increment the coupon's used_count.
 * POST body: { coupon_id: string }
 */
export async function POST(req: NextRequest) {
  const { coupon_id } = await req.json()
  if (!coupon_id) return NextResponse.json({ error: 'coupon_id required' }, { status: 400 })

  const supabase = await createServerClient()

  const { data: coupon } = await supabase
    .from('coupons')
    .select('used_count')
    .eq('id', coupon_id)
    .single()

  if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })

  await supabase
    .from('coupons')
    .update({ used_count: coupon.used_count + 1 })
    .eq('id', coupon_id)

  return NextResponse.json({ success: true })
}
