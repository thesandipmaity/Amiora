import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@amiora/database'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { images, variants, full_description, tag_ids, ...rest } = await req.json()

    // Map form field → DB column
    const product = {
      ...rest,
      ...(full_description !== undefined && { description: full_description }),
    }

    // Remove any undefined / form-only keys that don't exist in DB
    const dbProduct = Object.fromEntries(
      Object.entries(product).filter(([, v]) => v !== undefined && v !== '')
    )

    const { data, error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[PATCH /api/products] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Replace images
    if (Array.isArray(images)) {
      await supabase.from('product_images').delete().eq('product_id', id)
      if (images.length) {
        const { error: imgErr } = await supabase.from('product_images').insert(
          images.map((img: { url: string; is_primary: boolean }, i: number) => ({
            product_id: id,
            url:        img.url,
            is_primary: img.is_primary,
            sort_order: i,
          }))
        )
        if (imgErr) console.error('[PATCH /api/products] image insert error:', imgErr)
      }
    }

    // Replace tags — delete existing then re-insert selected
    if (Array.isArray(tag_ids)) {
      await supabase.from('product_tags').delete().eq('product_id', id)
      if (tag_ids.length > 0) {
        const { error: tagErr } = await supabase.from('product_tags').insert(
          tag_ids.map((tag_id: string) => ({ product_id: id, tag_id }))
        )
        if (tagErr) console.error('[PATCH /api/products] tag insert error:', tagErr)
      }
    }

    return NextResponse.json({ data })
  } catch (err: unknown) {
    console.error('[PATCH /api/products] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
