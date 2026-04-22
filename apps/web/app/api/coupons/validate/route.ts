import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { code, order_amount } = await req.json()

  if (!code) {
    return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
  }

  const supabase = await createServerClient()

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()

  if (error || !coupon) {
    return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
  }

  // Check usage limit
  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
  }

  // Check minimum order amount
  if (order_amount !== undefined && coupon.min_order_amount > 0) {
    if (Number(order_amount) < coupon.min_order_amount) {
      return NextResponse.json({
        error: `Minimum order of ₹${coupon.min_order_amount} required for this coupon`,
      }, { status: 400 })
    }
  }

  // Calculate discount
  let discount = 0
  if (coupon.type === 'percentage') {
    discount = (Number(order_amount ?? 0) * coupon.value) / 100
    if (coupon.max_discount_amount) {
      discount = Math.min(discount, coupon.max_discount_amount)
    }
  } else {
    discount = coupon.value
  }
  discount = Math.round(discount)

  return NextResponse.json({
    valid:       true,
    coupon_id:   coupon.id,
    code:        coupon.code,
    description: coupon.description,
    type:        coupon.type,
    value:       coupon.value,
    discount,    // final discount amount in ₹
  })
}
